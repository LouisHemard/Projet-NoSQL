// Dépendances requises pour exécuter fetch dans Node.js, si utilisé côté serveur
// npm install node-fetch
// import fetch from 'node-fetch';

const baseUrl = "http://localhost:3003";

export async function fetchNotes(userId) {
    try {
        const response = await fetch(`${baseUrl}/notes/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des notes');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        throw error;
    }
}

//details des notes partagé
export async function getDetailSharedNotes(arrayId){
    console.log(arrayId, 'salut')
    try {
        const response = await fetch(`${baseUrl}/arrayDetailsNotes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(arrayId),
        });

        const data = await response.json();

        console.log(data, "coucou array Notes");
        if (!response.ok) throw new Error('Erreur lors de la récupération des détails de la note');
        //return await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la note:', error);
        throw error;
    }

}
export async function fetchNoteDetails(id) {
    //console.log(id);
    try {
        //console.log(`${baseUrl}/detailsNotes/${id}`)
        const response = await fetch(`${baseUrl}/detailsNotes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des détails de la note');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la note:', error);
        throw error;
    }
}

export async function createNote(noteData) {
    try {
        const response = await fetch('http://localhost:3003/notes',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData),
        });

        if (!response.ok) throw new Error('Erreur lors de la création de la note');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création de la note:', error);
        throw error;
    }
}

export async function updateNote(noteData) {
    //console.log(noteData);
    try {
        const response = await fetch(`http://localhost:3003/notes`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({noteData}),
        });
       // if (!response.ok) throw new Error('Erreur lors de la mise à jour de la note');
       // return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la note:', error);
        throw error;
    }
}
export async function mailCorrect(mail) {
    try {
        // Préparer la requête à envoyer à l'API
        const response = await fetch(`http://localhost:3001/mail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({mail}),
        });

        // Vérifier le statut de la réponse. Si ce n'est pas ok, on lance une erreur.
        if (!response.ok) {
            const errorBody = await response.json(); // Tenter de récupérer plus de détails sur l'erreur depuis le corps de la réponse
            throw new Error(`Erreur lors de la vérification du mail: ${errorBody.message || response.status}`);
        }

        // Retourner la réponse de l'API si tout s'est bien passé
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la vérification du mail:', error);
        throw error; // Relancer l'erreur pour que le code appelant puisse la gérer
    }
}

export async function shareNote(user1,user2,idNote) {
    console.log(user1,user2,idNote);
    try {
        // Préparer la requête à envoyer à l'API
        const response = await fetch(`http://localhost:3003/share-note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user1": {
                    "id": user1
                },
                "user2": {
                    "id": user2
                },
                "noteId": idNote
            })
        });

        // Vérifier le statut de la réponse. Si ce n'est pas ok, on lance une erreur.
        if (!response.ok) {
            const errorBody = await response.json(); // Tenter de récupérer plus de détails sur l'erreur depuis le corps de la réponse
            throw new Error(`Erreur lors de la vérification du mail: ${errorBody.message || response.status}`);
        }

        // Retourner la réponse de l'API si tout s'est bien passé
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la vérification du mail:', error);
        throw error; // Relancer l'erreur pour que le code appelant puisse la gérer
    }
}
export async function getNoteShare(userId) {
    try {
        // Préparer la requête à envoyer à l'API
        const response = await fetch(`http://localhost:3003/shared-note/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        //console.log(response);
        // Vérifier le statut de la réponse. Si ce n'est pas ok, on lance une erreur.
        if (!response.ok) {
            const errorBody = await response.json(); // Tenter de récupérer plus de détails sur l'erreur depuis le corps de la réponse
            throw new Error(`Erreur lors de la vérification du mail: ${errorBody.message || response.status}`);
        }

        // Retourner la réponse de l'API si tout s'est bien passé
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la vérification du mail:', error);
        throw error; // Relancer l'erreur pour que le code appelant puisse la gérer
    }
}

export async function updateNoteTitle(uneNotes, titre, index, userId){
    try {

        const response = await fetch(`${baseUrl}/titre`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({uneNotes, titre,index, userId}),
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour du Titre');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du Titre:', error);
        throw error;
    }

}


export async function deleteNote(id, userId, index) {
    try {
        const response = await fetch(`${baseUrl}/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, index }),
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression de la note');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        throw error;
    }
}
