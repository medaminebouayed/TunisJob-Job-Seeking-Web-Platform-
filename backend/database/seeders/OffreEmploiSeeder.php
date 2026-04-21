<?php

namespace Database\Seeders;

use App\Models\Recruiter;
use App\Models\OffreEmploi;
use App\Models\Specialty;
use App\Models\LocaliteOffre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OffreEmploiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recruiters = Recruiter::all();
        $specialties = Specialty::all();
        $localites = LocaliteOffre::all();

        if ($recruiters->isEmpty()) {
            $this->command->warn('No recruiters found. Please seed recruiters first.');
            return;
        }

        if ($specialties->isEmpty() || $localites->isEmpty()) {
            $this->command->warn('Specialties or Localites are missing. Please seed them first.');
            return;
        }

        $titles = [
            'Développeur Full Stack Senior',
            'Ingénieur DevOps',
            'Business Analyst',
            'Product Owner',
            'Designer UX/UI',
            'Data Scientist',
            'Consultant Cloud Azure',
            'Développeur Mobile Flutter',
            'Chef de Projet IT',
            'Architecte Logiciel',
            'Analyste Cybersécurité',
            'Responsable Marketing Digital'
        ];

        // Prepare Skills and Languages for seeding
        $skillsData = [
            'PHP', 'Laravel', 'Angular', 'React', 'Vue.js', 'Python', 'Django', 
            'Node.js', 'Java', 'Spring Boot', 'SQL', 'MongoDB', 'AWS', 'Docker',
            'Git', 'Scrum', 'Figma', 'TypeScript', 'TailwindCSS', 'Bootstrap'
        ];
        $langsData = ['Français', 'Anglais', 'Arabe', 'Allemand', 'Espagnol'];

        $allSkills = [];
        foreach ($skillsData as $sName) {
            $allSkills[] = \App\Models\Competence::firstOrCreate(['nom_competence' => $sName]);
        }

        $allLangs = [];
        foreach ($langsData as $lName) {
            $allLangs[] = \App\Models\Langue::firstOrCreate(['nom_langue' => $lName]);
        }

        $contractTypes = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
        $educationLevels = ['Bac+3', 'Bac+5', 'Doctorat', 'Autodidacte'];
        $experienceLevels = ['Débutant', '1-3 ans', '3-5 ans', '5-10 ans', '10+ ans'];
        $levels = ['Débutant', 'Intermédiaire', 'Expert'];

        foreach ($recruiters as $recruiter) {
            $this->command->info("Seeding 10 offers for recruiter: " . ($recruiter->user->name ?? $recruiter->id));
            
            for ($i = 0; $i < 10; $i++) {
                $title = $titles[array_rand($titles)];
                
                $offer = OffreEmploi::create([
                    'reference_offre' => 'OFF-' . strtoupper(Str::random(8)),
                    'recruiter_id' => $recruiter->id,
                    'enterprise_id' => $recruiter->enterprise_id,
                    'titre_poste' => $title,
                    'description' => "Nous recherchons un $title passionné pour rejoindre notre équipe dynamique. Vous interviendrez sur des projets innovants à forte valeur ajoutée.",
                    'profil_recherche' => "Profil recherché : Passionné, rigoureux et autonome avec une forte culture technique.",
                    'proposition_avantages' => "Télétravail partiel, mutuelle, tickets restaurant, environnement stimulant.",
                    'type_contrat' => $contractTypes[array_rand($contractTypes)],
                    'niveau_etude_requis' => $educationLevels[array_rand($educationLevels)],
                    'experience_requise' => $experienceLevels[array_rand($experienceLevels)],
                    'salaire_min' => rand(2000, 4000),
                    'salaire_max' => rand(4500, 8000),
                    'devise' => 'TND',
                    'frequence_salaire' => 'Mensuel',
                    'est_anonyme' => rand(0, 1),
                    'nombre_poste_pourvoir' => rand(1, 3),
                    'date_publication' => Carbon::now()->subDays(rand(0, 30)),
                    'date_expiration' => Carbon::now()->addDays(rand(30, 90)),
                    'statut_offre' => 'Ouverte',
                    'statut_moderation' => 'Validée',
                    'specialty_id' => $specialties->random()->id,
                    'localite_offre_id' => $localites->random()->id,
                ]);

                // Attach random skills
                $randomSkills = (array) array_rand($allSkills, rand(3, 6));
                $skillSync = [];
                foreach ($randomSkills as $idx) {
                    $skillSync[$allSkills[$idx]->id] = ['niveau_requis' => $levels[array_rand($levels)]];
                }
                $offer->competencies()->sync($skillSync);

                // Attach random languages
                $randomLangs = (array) array_rand($allLangs, rand(1, 3));
                $langSync = [];
                foreach ($randomLangs as $idx) {
                    $langSync[$allLangs[$idx]->id] = ['niveau_requis' => $levels[array_rand($levels)]];
                }
                $offer->languages()->sync($langSync);
            }
        }

        $this->command->info('Seeding completed successfully!');
    }
}
