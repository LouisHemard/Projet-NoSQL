# Documentation Technique de l'API

Toutes les opérations liées au backend et aux appels API sont gérées dans le dossier `/Projet-NoSQl/server`.

## Partie Utilisateur

Cette partie concerne la gestion des utilisateurs et comprend deux appels API principaux :

### `/login`

Cet endpoint permet à un utilisateur de se connecter en fournissant son adresse e-mail et son mot de passe dans le corps de la requête. Si l'authentification réussit, les informations telles que le nom, le prénom et l'ID utilisateur sont stockées dans les cookies.

**Paramètres** :
- `email` : l'adresse e-mail de l'utilisateur
- `password` : le mot de passe de l'utilisateur

**Réponses** :
- En cas de succès, un message de validation est renvoyé.
- En cas d'échec, un message d'erreur est renvoyé.

### `/register`

Cet endpoint permet à un nouvel utilisateur de s'inscrire en fournissant toutes les informations nécessaires via le formulaire d'inscription.

**Paramètres** :
- `nom` : le nom de l'utilisateur
- `prenom` : le prénom de l'utilisateur
- `email` : l'adresse e-mail de l'utilisateur
- `password` : le mot de passe de l'utilisateur

**Réponses** :
- En cas de succès, un message de réussite est renvoyé.
- En cas d'échec, un message d'erreur est renvoyé.

## Partie Notes

Cette section traite de la gestion des notes et des opérations associées.

### `/notes`

Endpoint pour afficher toutes les notes d'un utilisateur spécifié.

**Paramètres** :
- `userId` : l'ID de l'utilisateur dont les notes doivent être affichées

**Réponses** :
- En cas de succès, renvoie un tableau contenant les notes de l'utilisateur.
- En cas d'échec, renvoie un message d'erreur.

### `/detailsNotes`

Endpoint pour afficher les détails d'une note spécifique.

**Paramètres** :
- `id` : l'ID de la note dont les détails doivent être affichés

**Réponses** :
- En cas de succès, renvoie les détails de la note demandée.
- En cas d'échec (note non trouvée), renvoie un message d'erreur.

### `/notes`

Endpoint pour créer une nouvelle note.

**Paramètres** :
- `titre` : le titre de la note
- `date` : la date de la note
- `contenu` : le contenu de la note
- `userId` : l'ID de l'utilisateur auquel la note est associée

**Réponses** :
- En cas de succès, renvoie l'ID de la note créée.
- En cas d'échec, renvoie un message d'erreur.

### `/notes`

Endpoint pour modifier une note existante.

**Paramètres** :
- `id` : l'ID de la note à modifier
- `titre` : le nouveau titre de la note
- `date` : la nouvelle date de la note
- `contenu` : le nouveau contenu de la note
- `userId` : l'ID de l'utilisateur auquel la note est associée

**Réponses** :
- En cas de succès, renvoie le nombre de notes modifiées.
- En cas d'échec, renvoie un message d'erreur.

### `/notes/:id`

Endpoint pour supprimer une note spécifique.

**Paramètres** :
- `id` : l'ID de la note à supprimer (dans l'URL)
- `userId` : l'ID de l'utilisateur auquel la note est associée (dans le corps de la requête)

**Réponses** :
- En cas de succès, renvoie un message de confirmation.
- En cas d'échec, renvoie un message d'erreur.

---

**Remarque** : Assurez-vous de remplacer les valeurs factices par les véritables noms de fichiers, adresses, ports et autres informations pertinentes avant de déployer votre application en production.
