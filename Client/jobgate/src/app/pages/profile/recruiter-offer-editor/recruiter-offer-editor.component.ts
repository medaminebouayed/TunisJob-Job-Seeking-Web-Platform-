import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploi } from '../../../core/models/offre-emploi.model';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';


@Component({
  selector: 'app-recruiter-offer-editor',
  templateUrl: './recruiter-offer-editor.component.html',
  styleUrls: ['./recruiter-offer-editor.component.css']
})
export class RecruiterOfferEditorComponent implements OnInit {
  isEditing = false;
  isSaving = false;
  isLoading = false;
  offer: OffreEmploi = {

    titre_poste: '',
    description: '',
    type_contrat: 'Full time',
    statut_offre: 'Ouverte',
    devise: 'TND',
    frequence_salaire: 'Par mois',
    experience_requise: '',
    niveau_etude_requis: '',
    nombre_poste_pourvoir: 1,
    date_expiration: undefined,
    localite: { pays: 'Tunisie', ville: '', gouvernorat: '', code_postal: '' },
    competences_requises: [],
    langues_requises: []
  };

  // Selection lists
  categories: any[] = [];
  specialties: any[] = [];
  languages: any[] = [];
  skills: any[] = [];
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Tableau de Bord', path: '/recruiter/dashboard' },
    { label: 'Éditeur d\'offre', active: true }
  ];
  
  // UI helpers
  selectedCategoryId: number | null = null;
  newSkillValue: string = '';
  newSkillLevel: string = 'Intermediate';
  newLangValue: string = '';
  newLangLevel: string = 'Intermediate';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private offreService: OffreEmploiService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}


  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user || user.role !== 'recruiter' || !user.recruiter || !user.recruiter.enterprise_id) {
      this.notificationService.showError('Profil incomplet ou session expirée. Veuillez vous reconnecter.');
    }


    this.loadSupportingData();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.fetchOffer(Number(id));
    } else {
      this.isEditing = false;
    }
  }

  loadSupportingData(): void {
    // In a real app, these would come from dedicated services
    // For now, we'll fetch them from our existing services or API
    this.offreService.getCategories().subscribe(data => {
      this.categories = data;
      if (this.selectedCategoryId) {
        this.onCategoryChange();
      }
    });
    this.offreService.getLanguages().subscribe(data => this.languages = data);
    this.offreService.getSkills().subscribe(data => this.skills = data);
  }

  onCategoryChange(): void {
    if (this.selectedCategoryId) {
      this.specialties = this.categories.find(c => c.id === Number(this.selectedCategoryId))?.specialties || [];
    } else {
      this.specialties = [];
    }
  }

  addSkill(): void {
    if (this.newSkillValue) {
      const trimmedName = this.newSkillValue.trim();
      if (!trimmedName) return;

      // Check if it already exists in the offer
      const alreadyAdded = this.offer.competences_requises?.some(
        s => s.nom_competence.toLowerCase() === trimmedName.toLowerCase()
      );

      if (!alreadyAdded) {
        // Find if it exists in the suggestions to get the ID
        const existingSkill = this.skills.find(
          s => s.nom_competence.toLowerCase() === trimmedName.toLowerCase()
        );

        this.offer.competences_requises?.push({
          id: existingSkill ? existingSkill.id : undefined,
          nom_competence: trimmedName,
          pivot: { niveau_requis: this.newSkillLevel }
        });
      }
      this.newSkillValue = '';
    }
  }

  removeSkill(skill: any): void {
    this.offer.competences_requises = this.offer.competences_requises?.filter(s => {
      if (s.id && skill.id) return s.id !== skill.id;
      return s.nom_competence !== skill.nom_competence;
    });
  }

  addLanguage(): void {
    if (this.newLangValue) {
      const trimmedName = this.newLangValue.trim();
      if (!trimmedName) return;

      const alreadyAdded = this.offer.langues_requises?.some(
        l => l.nom_langue.toLowerCase() === trimmedName.toLowerCase()
      );

      if (!alreadyAdded) {
        const existingLang = this.languages.find(
          l => l.nom_langue.toLowerCase() === trimmedName.toLowerCase()
        );

        this.offer.langues_requises?.push({
          id: existingLang ? existingLang.id : undefined,
          nom_langue: trimmedName,
          pivot: { niveau_requis: this.newLangLevel }
        });
      }
      this.newLangValue = '';
    }
  }

  removeLanguage(lang: any): void {
    this.offer.langues_requises = this.offer.langues_requises?.filter(l => {
      if (l.id && lang.id) return l.id !== lang.id;
      return l.nom_langue !== lang.nom_langue;
    });
  }

  fetchOffer(id: number): void {
    this.isLoading = true;
    this.offreService.getOffreById(id).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.offer = {
          ...data,
          localite: data.localite || { pays: 'Tunisie', ville: '', gouvernorat: '', code_postal: '' },
          competences_requises: data.competencies || [],
          langues_requises: data.languages || []
        };
        
        if (data.specialty && data.specialty.categorie_id) {
          this.selectedCategoryId = data.specialty.categorie_id;
          this.onCategoryChange();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching offer:', err);
        this.notificationService.showError('Erreur lors du chargement de l\'offre.');
      }
    });
  }
  
  formatDate(date: any): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }

  onDateChange(value: string): void {
    if (value) {
      this.offer.date_expiration = new Date(value);
    } else {
      this.offer.date_expiration = undefined;
    }
  }

  saveOffer(): void {
    if (!this.offer.titre_poste || !this.offer.description) {
      this.notificationService.showError('Veuillez remplir les champs obligatoires.');
      return;
    }

    if (this.offer.salaire_min && this.offer.salaire_max && Number(this.offer.salaire_min) > Number(this.offer.salaire_max)) {
      this.notificationService.showError('Le salaire minimum ne peut pas être supérieur au salaire maximum.');
      return;
    }

    const user = this.authService.currentUserValue;
    const payload: any = {
      ...this.offer,
      enterprise_id: user?.recruiter?.enterprise_id,
      languages: this.offer.langues_requises?.map(l => ({ 
        id: l.id, 
        nom_langue: l.nom_langue,
        niveau_requis: l.pivot?.niveau_requis 
      })) || [],
      competencies: this.offer.competences_requises?.map(c => ({ 
        id: c.id, 
        nom_competence: c.nom_competence, 
        niveau_requis: c.pivot?.niveau_requis 
      })) || []
    };

    this.isSaving = true;
    if (this.isEditing && this.offer.id) {
      this.offreService.updateOffre(this.offer.id, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.notificationService.showSuccess('Offre mise à jour avec succès !');
          this.router.navigate(['/recruiter/dashboard']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Update error:', err);
          this.notificationService.showError('Erreur lors de la mise à jour.');
        }
      });
    } else {
      this.offreService.createOffre(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.notificationService.showSuccess('Nouvelle offre créée avec succès !');
          this.router.navigate(['/recruiter/dashboard']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Create error:', err);
          this.notificationService.showError('Erreur lors de la création de l\'offre.');
        }
      });
    }
  }
}
