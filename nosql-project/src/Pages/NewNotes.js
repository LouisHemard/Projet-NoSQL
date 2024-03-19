import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../data/notes'; // Assure-toi que le chemin vers notes.js est correct
import './Form.css'
import './NewEditNote.css'

const NewNotes = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        let parsedObject = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

        const title = event.target['title-notes'].value;
        const details = event.target['details-notes'].value;
        const userId = parsedObject ? parsedObject.id : null;
        const date = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

        const noteData = {
            titre: title,
            date: date,
            contenu: details,
            userId: userId
        };

        try {
            await createNote(noteData);
            alert('Note ajoutée avec succès');
            navigate('/NotePage'); // Redirige vers la page de notes après succès
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la note:', error);
            alert('Erreur lors de l\'ajout de la note');
        }
    };

    return (
        <div className='container-left container-form'>
            <h1>Ajouter une nouvelle note</h1>
            <form onSubmit={handleSubmit}>
                <div className='title'>
                    <h3 >Titre</h3>
                    <input className="input-form" type="text" id="title-notes" name="title-notes" placeholder='Nouvelle note' required />
                </div>
                <div className='details'>
                    <h3 >Contenu</h3>
                    <textarea className="text-form"  id="details-notes" name="details-notes" placeholder='Rédiger une Note' required />
                </div>
                <button className="submit-form" type="submit-form">Ajouter Note</button>
            </form>
        </div>
    );
};

export default NewNotes;
