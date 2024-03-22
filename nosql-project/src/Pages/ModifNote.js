import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import{updateNote, fetchNoteDetails} from "../data/notes";
import './Form.css'
import './NotePage.css'

const ModifNote = () => {
    const location = useLocation();
    const { idNotes, index } = location.state || {};
    const [noteDetails, setNoteDetails] = useState({ titre: '', contenu: '' });
    const navigate = useNavigate();
    const userId = JSON.parse(sessionStorage.getItem('user')).id;

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const details = await fetchNoteDetails(idNotes);
                setNoteDetails(details);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de la note:', error);
            }
        };
        fetchNote();
    }, [idNotes]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNoteDetails({ ...noteDetails, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const title = event.target['title-notes'].value;
        const details = event.target['details-notes'].value;
        const objet = {
            idNotes: idNotes,
            titre: title,
            contenu: details,
            date: noteDetails.date,
            idUser: userId,
            index: index
        };
        console.log(objet);
        try {
            await updateNote(objet);
            alert('Note ajoutée avec succès');
            navigate('/NotePage'); // Redirige vers la page de notes après succès
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la note:', error);
            alert('Erreur lors de l\'ajout de la note');
        }
        // Ici, tu peux décommenter et utiliser ton code de mise à jour
    };

    return (
        <div className='container-left container-form'>
            <h1>Modifier Note</h1>
            <form onSubmit={handleSubmit}>
                <div className='title'>
                    <h3>Titre</h3>
                    <input
                        className="input-form"
                        type="text"
                        id="title-notes"
                        name="titre" // Assure-toi que le nom correspond à la clé dans ton état noteDetails
                        value={noteDetails.titre}
                        onChange={handleInputChange} // Gère le changement d'entrée
                    />
                </div>
                <div className='details'>
                    <h3>Contenu</h3>
                    <textarea
                        className="text-form"
                        id="details-notes"
                        name="contenu" // Assure-toi que le nom correspond à la clé dans ton état noteDetails
                        value={noteDetails.contenu}
                        required
                        onChange={handleInputChange} // Gère le changement d'entrée
                    />
                </div>
                <button className="submit-form" type="submit">Terminé</button>
            </form>
        </div>
    );
};

export default ModifNote;
