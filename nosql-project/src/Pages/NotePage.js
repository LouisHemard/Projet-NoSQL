import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { fetchNotes, deleteNote, updateNoteTitle } from '../data/notes'; // Assurez-vous d'importer correctement vos fonctions d'API
import './Form.css';
import './NotePage.css'
import { MdDelete, MdEdit } from "react-icons/md";

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
                {notes.map((note, index) => (
                    <div key={note.idNotes}>
                        <div className='UneNote'>
                            <div className='NoteName'
                                  onDoubleClick={() =>handleEditTitle(note, index)}>{note.titre}</div>
                            <div className='DateName'>{note.date}</div>
                            <div className='Buttons'>
                                <MdEdit  size={20} className='Icon' onClick={() => handleViewDetails(note.idNotes, index)}/>
                                <MdDelete size={20} className='Icon' onClick={() => handleDeleteNote(note.idNotes, index)}/>
                            </div>
                        </div>
                    </div>
                ))}
            <div className="BtnNewDec">
                <NavLink to="/NewNotes">
                    <button className="submit-form">Nouvelle Note</button>
                </NavLink>
                <NavLink to="/">
                    <button className="submit-form" >Déconnexion</button>
                </NavLink>
            </div>
        </div>
    );
};

export default NotePage;