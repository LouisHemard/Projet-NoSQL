import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchNotes, deleteNote, updateNoteTitle } from '../data/notes'; // Assurez-vous d'importer correctement vos fonctions d'API

const NotePage = () => {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const userId = JSON.parse(sessionStorage.getItem('user')).id; // Assurez-vous que l'ID utilisateur est stocké dans le sessionStorage

    useEffect(() => {
        const getNotes = async () => {
            try {
                const fetchedNotes = await fetchNotes(userId);
                setNotes(fetchedNotes);
            } catch (error) {
                console.error(error);
            }
        };

        getNotes();
    }, [userId]);

    const handleDeleteNote = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
            try {
                await deleteNote(id, userId);
                setNotes(notes.filter(note => note._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/ModifNote/${id}`); // Assurez-vous que cette route est configurée dans ton application
    };

    const handleEditTitle = async (id, index) => {
        const newTitle = prompt('Veuillez saisir le nouveau titre :');
        if (newTitle !== null) {
            //console.log(id, newTitle)
            try {
                await updateNoteTitle(id, newTitle);
                const updatedNotes = [...notes];
                updatedNotes[index].titre = newTitle;
                setNotes(updatedNotes);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className='container'>
            <h1>Mes Notes</h1>
            <ul>
                {notes.map((note, index) => (
                    <li key={note._id}>
                        <span onDoubleClick={() => handleEditTitle(note._id, index)}>{note.titre}</span>
                        <span>{note.date}</span>
                        <button onClick={() => handleViewDetails(note._id)}>Voir</button>
                        <button onClick={() => handleDeleteNote(note._id)}>Supprimer</button>
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
