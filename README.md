# Cahier des Spécifications Fonctionnelles et Techniques

## 1. Contexte du projet
L'application vise à centraliser la gestion des signalements, des dossiers des jeunes pris en charge par l’ASE, des structures d’accueil et des organisations, tout en garantissant une traçabilité complète et une gestion multi-entités (départements, organisations, structures). Elle permet un suivi rigoureux des tâches et notifications pour tous les acteurs impliqués.

## 2. Objectifs fonctionnels
### 1. Gestion des signalements :

- Création, routage et priorisation des signalements par gravité.
- Notifications automatiques pour les acteurs concernés.
### 2. Suivi des dossiers des jeunes :

- Historisation complète des signalements, suivis médicaux, éducatifs, placements et tâches.
- Ajout de l’historique des modifications pour garantir la transparence.
### 3. Gestion des structures et organisations :

- Vision consolidée des structures au sein d’une organisation.
- Gestion des placements et des activités.
### 4. Gestion des tâches et rappels :

- Planification et suivi des tâches liées aux jeunes, structures et organisations.
- Notifications automatiques pour les échéances ou rappels.
### 5. Traçabilité renforcée :

- Ajout des champs youthCaseId, authorId, et departmentId dans chaque entité clé.
- Historisation des modifications (date, auteur, détail).
## 3. Fonctionnalités détaillées
### 3.1 Gestion des signalements
#### Création et traitement des signalements
- Saisie des informations requises :
  - Description de la situation.
  - Département responsable.
  - Auteur du signalement (si identifié).
- Routage automatique vers le département concerné.
- Priorisation par gravité (urgent, prioritaire, observatoire).
- Notifications automatiques envoyées aux CRIP.
### 3.2 Suivi des dossiers des jeunes
#### Informations centralisées
- ##### Signalements liés :
  - Tous les signalements associés à un jeune.
- ##### Suivi médical :
  - Consultations, prescriptions, et suivis.
- ##### Suivi éducatif/professionnel :
  - Évaluations scolaires ou professionnelles.
- ##### Placements :
  - Historique et placements en cours.
- ##### Activités :
  - Planning et rapports des activités au sein des structures.
- Tâches :
  - Liste des tâches assignées au personnel éducatif ou aux travailleurs sociaux.
### 3.3 Gestion des structures et organisations
#### Structures
- Informations disponibles :
  - Type de structure (foyer, famille d’accueil, etc.).
  - Capacité totale, places occupées et disponibles.
  - Historique des placements.
- Gestion des tâches associées à une structure.
#### Organisations
- Vision consolidée des structures associées.
- Suivi des placements et activités pour toutes les structures d’une organisation.
### 3.4 Gestion des tâches et rappels
- ##### Planification :
  - Création de tâches liées à un dossier jeune, une structure ou une organisation.
- ##### Suivi des statuts :
  - Statut des tâches : pending, completed, overdue.
- ##### Notifications :
  - Rappels automatiques pour les échéances ou tâches en retard.
### 3.5 Notifications
- Notifications envoyées pour :
  - Rappels de tâches ou échéances.
  - Signalements urgents ou alertes importantes.
- Types de notification : tableau de bord, email, SMS.
## 4. Modèles de données
### 4.1 Signalement (Report)
```typescript
export interface Report {
  id: string;
  youthCaseId?: string; // Optional, in case the youth is not identified yet
  authorId: string; // User who created the report
  departmentId: string; // Department responsible for the report
  dangerType: "violence" | "neglect" | "abandon" | "psychological";
  description: string; // Detailed description of the situation
  status: "new" | "in_progress" | "closed"; // Report status
  createdAt: Date;
  updatedAt?: Date; // Optional, last modification date
  modifications?: Modification[]; // History of changes
}
```
### 4.2 Dossier jeune (YouthCase)
```typescript
export interface YouthCase {
  id: string;
  name: string;
  dateOfBirth: Date;
  departmentId: string; // Department managing the youth case
  reports: Report[]; // Linked reports
  medicalFollowUp: MedicalRecord[]; // Medical history
  educationalFollowUp: EducationRecord[]; // Educational/professional follow-up
  placements: PlacementHistory[]; // Placement history
  structureReports: StructureActivityReport[]; // Activity reports within structures
  activitySchedule: ActivitySchedule[]; // Activity schedule for the youth
  tasks: Task[]; // Tasks assigned to staff or educators related to the youth
  history: CaseAction[]; // Historical actions
  modifications?: Modification[]; // History of changes
  status: "active" | "closed" | "archived"; // Youth case status
}
```
### 4.3 Suivi médical (MedicalRecord)
```typescript
export interface MedicalRecord {
  id: string;
  youthCaseId: string; // Linked youth case
  authorId: string; // User who added or modified this record
  departmentId: string; // Department responsible for the youth
  date: Date; // Consultation or record date
  description: string; // Details of the medical issue or treatment
  prescriptions?: string[]; // List of prescribed medications
  followUpDate?: Date; // Optional follow-up date
  modifications?: Modification[]; // History of changes
}
```
### 4.4 Suivi éducatif ou professionnel (EducationRecord)
```typescript
export interface EducationRecord {
  id: string;
  youthCaseId: string; // Linked youth case
  authorId: string; // User who created or updated this record
  departmentId: string; // Department responsible for the youth
  type: "school" | "apprenticeship" | "training"; // Type of educational/professional follow-up
  institutionName: string; // Name of the school, training center, or workplace
  progressReports: string[]; // Notes or evaluations of progress
  startDate: Date; // Start date of the follow-up
  endDate?: Date; // End date, optional if ongoing
  modifications?: Modification[]; // History of changes
}
```
### 4.5 Placement historique (PlacementHistory)
```typescript
export interface PlacementHistory {
  id: string;
  youthCaseId: string; // Linked youth case
  structureId: string; // Structure where the youth was placed
  organizationId?: string; // Optional if linked to an organization
  authorId: string; // User who created or modified the placement
  departmentId: string; // Department managing the placement
  startDate: Date; // Placement start date
  endDate?: Date; // Placement end date (if ended)
  reason?: string; // Reason for the placement
  modifications?: Modification[]; // History of changes
}
```
### 4.6 Tâches (Task)
```typescript
export interface Task {
   id: string;
  associatedEntityId: string; // ID of the case, structure, or organization
  entityType: "youth_case" | "structure" | "organization"; // Type of entity linked to the task
  title: string; // Title of the task
  description: string; // Detailed description of the task
  assignedTo: string; // User ID of the staff member responsible for the task
  authorId: string; // User who created the task
  departmentId: string; // Department managing the task
  dueDate: Date; // Deadline for the task
  status: "pending" | "completed" | "overdue"; // Status of the task
  modifications?: Modification[]; // History of changes
}
```
### 4.7 Planning d'activités
```typescript
export interface ActivitySchedule {
  id: string;
  youthCaseId: string; // Linked youth case
  description: string; // Description of the planned activity
  date: Date; // Activity date
  location?: string; // Optional location of the activity
  staffResponsible: string; // User ID of the staff member managing the activity
  departmentId: string; // Department managing the youth
  modifications?: Modification[]; // History of changes
}
```
### 4.8 Rapports d’activité en structure (StructureActivityReport)
```typescript
export interface StructureActivityReport {
  id: string;
  youthCaseId: string; // Linked youth case
  structureId: string; // Structure where the activity took place
  date: Date; // Date of the activity
  description: string; // Description of the activity
  staffInvolved: string[]; // List of staff members who participated
  observations?: string; // Optional observations about the youth’s participation
  authorId: string; // User who created the report
  departmentId: string; // Department responsible
  modifications?: Modification[]; // History of changes
}
```
### 4.9 Notifications (Notification)
```typescript
export interface Notification {
  id: string;
  type: "email" | "sms" | "dashboard"; // Type of notification
  recipientId: string; // User ID of the recipient
  associatedEntityId?: string; // Optional, entity related to the notification (task, report, etc.)
  entityType?: "task" | "youth_case" | "structure" | "organization"; // Type of entity
  message: string; // Notification content
  status: "pending" | "sent" | "failed"; // Delivery status
  createdAt: Date; // Notification creation date
  sentAt?: Date; // Optional, when the notification was sent
}
```
### 4.10 Organisation (Organization)
```typescript
export interface Organization {
  id: string;
  name: string; // Organization name
  structures: Structure[]; // Linked structures
  departmentId: string; // Department overseeing the organization
  createdAt: Date; // Date of creation
  modifications?: Modification[]; // History of changes
}
```
### 4.11 Structure (Structure)
```typescript
export interface Structure {
   id: string;
  name: string; // Structure name
  type: "family" | "foster_home" | "specialized_center"; // Type of structure
  capacity: number; // Total capacity of the structure
  occupied: number; // Number of occupied places
  organizationId: string; // Linked organization
  departmentId: string; // Department overseeing the structure
  placements: PlacementHistory[]; // Placement history for the structure
  tasks: Task[]; // Tasks associated with the structure
  modifications?: Modification[]; // History of changes
}
```
### 4.12 Historique des modifications (Modification)
```typescript
export interface Modification {
  modifiedAt: Date; // Date of modification
  modifiedBy: string; // User ID of the person who made the modification
  changeDescription: string; // Description of what was changed
}
```
## 5. Workflows techniques
### 5.1 Gestion des signalements
#### 1.Création :
- Validation des données saisies.
- Enregistrement avec authorId, departmentId, et historique des modifications.
#### 2.Notifications :
- Envoi automatique des notifications.
### 5.2 Suivi des dossiers des jeunes
#### 1. Mise à jour des suivis médicaux et éducatifs :
- Historisation des modifications.
#### 2. Gestion des placements :
- Ajout de l’historique des modifications.
### 5.3 Gestion des tâches et rappels
1. Planification de tâches liées à un jeune, une structure, ou une organisation.
2. Notifications automatiques pour les échéances.
### 5.4 Gestion des structures et organisations
1. Vision consolidée des placements.
2. Historisation des modifications.
## 6. Priorités de développement
### MVP :
1. Gestion des signalements.
2. Tableaux de bord pour la CRIP.
3. Suivi des dossiers jeunes (signalements et suivis de base).
### Étape suivante :
4. Gestion des tâches.
5. Gestion des structures et organisations.
6. Vision consolidée et reporting avancé.

# Architecture application
```less
/app
  /api
    /reports/
      - route.ts            // API pour les signalements
    /youth-cases/
      - route.ts            // API pour les dossiers jeunes
    /tasks/
      - route.ts            // API pour les tâches
    /notifications/
      - route.ts            // API pour les notifications
    /organizations/
      - route.ts            // API pour les organisations
      /[id]/
        - route.ts          // Détails d’une organisation
        /structures/
          - route.ts        // API pour les structures d'une organisation
          /[structureId]/
            - route.ts      // API pour les détails d’une structure
    /departments/
      - route.ts            // API pour les départements
    /placements/
      - route.ts            // API pour les placements
    /structures/
      - available.ts        // Recherche des places disponibles (globale)
  /dashboard
    - layout.tsx            // Layout principal du dashboard
    - page.tsx              // Page d'accueil du dashboard
    /reports/
      - page.tsx            // Liste des signalements
      - [id]/
        - page.tsx          // Détails d’un signalement
    /youth-cases/
      - page.tsx            // Liste des dossiers jeunes
      - [id]/
        - page.tsx          // Détails d’un dossier jeune
    /tasks/
      - page.tsx            // Liste des tâches
      - [id]/
        - page.tsx          // Détails d’une tâche
    /notifications/
      - page.tsx            // Liste des notifications
    /organizations/
      - page.tsx            // Liste des organisations
      - [id]/
        - page.tsx          // Détails d’une organisation
        /structures/
          - page.tsx        // Liste des structures d'une organisation
          - [structureId]/
            - page.tsx      // Détails d’une structure spécifique
    /departments/
      - page.tsx            // Liste des départements
      - [id]/
        - page.tsx          // Détails d’un département
    /placements/
      - page.tsx            // Liste des placements
      - [id]/
        - page.tsx          // Détails d’un placement
  /form
    /report/
      - page.tsx            // Formulaire pour un signalement
    /task/
      - page.tsx            // Formulaire pour une tâche
    /youth-case/
      - page.tsx            // Formulaire pour un dossier jeune
    /organization/
      - page.tsx            // Formulaire pour une organisation
    /organization/[id]/structure/
      - page.tsx            // Formulaire pour créer une structure dans une organisation
    /department/
      - page.tsx            // Formulaire pour un département
  /not-found/
    - page.tsx              // Page pour les ressources introuvables
  /error/
    - page.tsx
```