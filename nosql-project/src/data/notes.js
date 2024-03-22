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

export async function fetchNoteDetails(id) {
    console.log(id);
    try {
        console.log(`${baseUrl}/detailsNotes/${id}`)
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
    console.log(noteData);
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
