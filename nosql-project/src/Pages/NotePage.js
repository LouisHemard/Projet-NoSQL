import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchNotes, deleteNote, updateNoteTitle } from '../data/notes'; // Assurez-vous d'importer correctement vos fonctions d'API
import './Form.css';
import './NotePage.css'
import { MdDelete, MdEdit } from "react-icons/md";


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
                {notes.map((note, index) => (
                    <div key={note._id}>
                        <div className='UneNote'>
                            <div className='NoteName'
                                  onDoubleClick={() => handleEditTitle(note._id, index)}>{note.titre}</div>
                            <div className='DateName'>{note.date}</div>
                            <div className='Buttons'>
                                <MdEdit  size={20} className='Icon' onClick={() => handleViewDetails(note._id)}/>
                                <MdDelete size={20} className='Icon' onClick={() => handleDeleteNote(note._id)}/>
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
