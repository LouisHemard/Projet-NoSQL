import React, { useState, useEffect } from 'react';
import {useParams, useHistory, useNavigate} from "react-router-dom";
import { fetchNoteDetails, updateNote } from '../data/notes'; // Assurez-vous d'importer correctement vos fonctions d'API
import './Form.css'
import './NotePage.css'

const ModifNote = () => {
    const { idNotes } = useParams();
    const [noteDetails, setNoteDetails] = useState({ titre: '', contenu: '' });
    const [originalNoteDetails, setOriginalNoteDetails] = useState(null);
    const navigate = useNavigate()
    const userId = JSON.parse(sessionStorage.getItem('user')).id; // Assure-toi que l'ID utilisateur est stocké dans le sessionStorage

    // Utilisez useEffect pour charger les détails de la note lorsque le composant est monté
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const details = await fetchNoteDetails(idNotes);
                setNoteDetails(details);
                setOriginalNoteDetails(details);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de la note:', error);
            }
        };
        fetchNote();
    }, [idNotes]);

    const handleTitleChange = (e) => {
        setNoteDetails(prevState => ({
            ...prevState,
            titre: e.target.value
        }));
    };

    const handleContentChange = (e) => {
        setNoteDetails(prevState => ({
            ...prevState,
            contenu: e.target.value
        }));
    };

    const handleUpdateNote = async () => {
        // Vérifie si les données de la note ont été modifiées
        if (
            noteDetails.titre === originalNoteDetails.titre &&
            noteDetails.contenu === originalNoteDetails.contenu
        ) {
            // Si aucune modification n'a été apportée, retournez à la page précédente
            navigate('/NotePage');
            return;
        }

        try {
            await updateNote(idNotes, { titre: noteDetails.titre, contenu: noteDetails.contenu, date:noteDetails.date }, userId);
            // Affichez une notification ou redirigez l'utilisateur après la mise à jour réussie
            console.log('Note mise à jour avec succès !');
            navigate('/NotePage');


        } catch (error) {
            console.error('Erreur lors de la mise à jour de la note:', error);
        }
    };

    return (
        <div className='container-left container-form'>
            <h1>Modifier Note</h1>
            <form>
                <div className='title'>
                    <h3>Titre</h3>
                    <input className="input-form" type="text" id="title-notes" name="title-notes"
                           value={noteDetails.titre} onChange={handleTitleChange} required/>
                </div>
                <div className='details'>
                    <h3>Contenu</h3>
                    <textarea className="text-form" id="details-notes" name="details-notes" value={noteDetails.contenu}
                              onChange={handleContentChange} required/>
                </div>
                <button className="submit-form" type="submit" onClick={handleUpdateNote}>Terminé</button>
            </form>
        </div>
    );
};

export default ModifNote;
