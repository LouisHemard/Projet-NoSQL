import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchNotes, deleteNote, updateNoteTitle } from '../data/notes';

const NotePage = () => {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const userId = JSON.parse(sessionStorage.getItem('user')).id;

    useEffect(() => {
        const getNotes = async () => {
            try {
                const fetchedNotes = await fetchNotes(userId);
                setNotes(fetchedNotes);
            } catch (error) {
                console.error('Erreur lors de la récupération des notes:', error);
            }
        };

        getNotes();
    }, [userId]);

    const handleDeleteNote = async (idNotes, index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
            try {
                await deleteNote(idNotes, userId, index); // Assure-toi que deleteNote accepte userId si nécessaire
                setNotes(notes.filter((_, noteIndex) => noteIndex !== index));
            } catch (error) {
                console.error('Erreur lors de la suppression de la note:', error);
            }
        }
    };

    const handleViewDetails = (idNotes) => {
        navigate(`/ModifNote/${idNotes}`);
    };

    const handleEditTitle = async (uneNote, index) => {
        //console.log(uneNote);
        const newTitle = prompt('Veuillez saisir le nouveau titre :');
        if (newTitle !== null) {
            try {
                console.log(uneNote);

                await updateNoteTitle(uneNote, newTitle, index, userId); // Assure-toi que updateNoteTitle accepte userId si nécessaire
                const updatedNotes = [...notes];
                updatedNotes[index].titre = newTitle;
                setNotes(updatedNotes);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du titre:', error);
            }
        }
    };

    return (
        <div className='container'>
            <h1>Mes Notes</h1>
            <ul>
                {notes.map((note, index) => (
                    <li key={note.idNotes}>
                        <span onDoubleClick={() => handleEditTitle(note, index)}>{index}. {note.titre}</span>
                        <span>{note.date}</span>
                        <button onClick={() => handleViewDetails(note.idNotes, index)}>Voir</button>
                        <button onClick={() => handleDeleteNote(note.idNotes, index)}>Supprimer</button>
                    </li>
                ))}
            </ul>
            <NavLink to="/NewNotes">
                <button>Nouvelle Note</button>
            </NavLink>
            <NavLink to="/">
                <button>Déconnexion</button>
            </NavLink>
        </div>
    );
};

export default NotePage;
