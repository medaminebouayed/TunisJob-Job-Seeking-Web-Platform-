<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'IT & Logiciels' => [
                'Développement Web', 'Développement Mobile', 'Administration Systèmes',
                'DevOps', 'Cloud Computing', 'Support IT', 'Réseaux Informatiques',
                'Sécurité Informatique', 'QA & Testing', 'Architecture Logicielle'
            ],
            'Marketing Digital' => [
                'SEO', 'SEA (Google Ads)', 'Social Media Management', 'Content Marketing',
                'Email Marketing', 'Growth Hacking', 'Marketing d’Influence',
                'Analytics & Data Marketing', 'Branding', 'E-commerce Marketing'
            ],
            'Finance & Comptabilité' => [
                'Comptabilité Générale', 'Audit', 'Contrôle de Gestion', 'Fiscalité',
                'Finance d’Entreprise', 'Gestion de Trésorerie', 'Analyse Financière',
                'Banque', 'Assurance', 'Investissement'
            ],
            'Design & Créativité' => [
                'Design Graphique', 'UI Design', 'UX Design', 'Motion Design',
                'Illustration', 'Branding Visuel', 'Design Produit', 'Design Web',
                'Animation 2D/3D', 'Photographie'
            ],
            'Développement Web' => [
                'Frontend (Angular, React)', 'Backend (Node.js, Laravel)', 'Full Stack',
                'API Development', 'CMS (WordPress, Drupal)', 'Web Performance',
                'Web Security', 'Progressive Web Apps', 'Microservices', 'Testing Web'
            ],
            'Data & Intelligence Artificielle' => [
                'Data Analysis', 'Data Science', 'Machine Learning', 'Deep Learning',
                'Data Engineering', 'Big Data', 'Business Intelligence',
                'NLP (Traitement du langage)', 'Computer Vision', 'Data Visualization'
            ],
            'Management & Leadership' => [
                'Gestion de Projet', 'Agile & Scrum', 'Leadership d’Équipe',
                'Management Stratégique', 'Gestion du Changement', 'Coaching Professionnel',
                'Prise de Décision', 'Communication Managériale', 'Gestion des Conflits',
                'Organisation du Travail'
            ],
            'Ressources Humaines' => [
                'Recrutement', 'Gestion des Talents', 'Formation & Développement',
                'Paie', 'Droit du Travail', 'Gestion des Performances', 'Marque Employeur',
                'Relations Sociales', 'RH Digital', 'Onboarding'
            ],
            'Commerce & Vente' => [
                'Vente B2B', 'Vente B2C', 'Négociation', 'Relation Client',
                'Account Management', 'Business Development', 'Vente en Ligne',
                'Techniques de Vente', 'CRM', 'Service Client'
            ],
            'Cybersécurité' => [
                'Sécurité Réseau', 'Pentesting', 'Sécurité des Applications',
                'Cryptographie', 'Sécurité Cloud', 'Analyse des Menaces',
                'SOC (Security Operations Center)', 'Gestion des Identités (IAM)',
                'Sécurité des Données', 'Conformité & Audit Sécurité'
            ]
        ];

        foreach ($data as $catName => $specialties) {
            $category = \App\Models\Category::firstOrCreate(['nom_categ' => $catName]);

            foreach ($specialties as $specName) {
                \App\Models\Specialty::firstOrCreate([
                    'nom_spec' => $specName,
                    'categorie_id' => $category->id
                ]);
            }
        }
    }
}
