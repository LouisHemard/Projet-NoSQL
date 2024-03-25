import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    fetchNotes,
    deleteNote,
    updateNoteTitle,
    mailCorrect,
    shareNote,
    getNoteShare,
    fetchNoteDetails,
    getDetailSharedNotes
} from '../data/notes';
import './Form.css';
import './NotePage.css'
import { MdDelete, MdEdit } from "react-icons/md";

const NotePage = () => {
    const [notes, setNotes] = useState([]);
    const [sharedNotes, setSharedNotes] = useState([]);
    const navigate = useNavigate();
    const userId = JSON.parse(sessionStorage.getItem('user')).id;

    useEffect(() => {
        const getNotes = async () => {
            try {
                const fetchedNotes = await fetchNotes(userId);
                setNotes(fetchedNotes);

                const fetchedSharedNoteIds = await getNoteShare(userId);
                //console.log(fetchedSharedNoteIds, 'idparage');
                const arrayFetchedSharedNotesID = fetchedSharedNoteIds.sharedNoteIds
                console.log(arrayFetchedSharedNotesID, "arrayFetchedSharedNotesID")
                const fetchedSharedNotes = await getDetailSharedNotes(arrayFetchedSharedNotesID);
                console.log(fetchedSharedNotes, 'derneir');
                setSharedNotes(fetchedSharedNotes);

            } catch (error) {
                console.error('Erreur lors de la récupération des notes:', error);
            }
        };

        getNotes();
    }, [userId]);


    const handleDeleteNote = async (idNotes, index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
            try {
                await deleteNote(idNotes, userId, index);
                setNotes(notes.filter((_, noteIndex) => noteIndex !== index));
            } catch (error) {
                console.error('Erreur lors de la suppression de la note:', error);
            }
        }
    };

    const handleViewDetails = (idNotes, index) => {
        navigate(`/ModifNote`, { state: { idNotes: idNotes, index: index }});
    };
    const handleViewDetailsShared = (sharedNote) => {
        console.log("et oh toi ", sharedNote)
        navigate(`/ViewNote`, { state: { idNotes: sharedNote, titre: sharedNote.titre, contenu:sharedNote.contenu}});
    };

    const handleEditTitle = async (uneNote, index) => {
        const newTitle = prompt('Veuillez saisir le nouveau titre :');
        if (newTitle !== null) {
            try {
                await updateNoteTitle(uneNote, newTitle, index, userId);
                const updatedNotes = [...notes];
                updatedNotes[index].titre = newTitle;
                setNotes(updatedNotes);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du titre:', error);
            }
        }
    };

    const handleShareNote = async (uneNote) => {
        const share = prompt('Veuillez saisir le mail de la personne à partager:');
        if (share !== null) {
            try {
                const reponse =  await mailCorrect(share);
                if (reponse.exists) {
                    const idPartage = reponse.id;
                    await shareNote(userId, idPartage, uneNote);
                } else {
                    console.log('Utilisateur non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors du partage de note : ', error);
            }
        }
    };

    return (
        <div className='container-left container-form'>
            <h1>Mes Notes</h1>
            {notes.map((note, index) => (
                //console.log(note, 'saliut tazkazk'),
                <div key={note.idNotes}>
                    <div className='UneNote'>
                        <div className='NoteName' onDoubleClick={() =>handleEditTitle(note, index)}>{note.titre}</div>
                        <div className='DateName'>{note.date}</div>
                        <div className='Buttons'>
                            <MdEdit  size={20} className='Icon' onClick={() => handleViewDetails(note.idNotes, index)}/>
                            <MdDelete size={20} className='Icon' onClick={() => handleDeleteNote(note.idNotes, index)}/>
                            <MdDelete size={20} className='Icon' onClick={() => handleShareNote(note.idNotes)}/>
                        </div>
                    </div>
                </div>
            ))}
            {sharedNotes.length > 0 && (
                <div>
                    <h2>Notes Partagées</h2>
                    {sharedNotes.map((sharedNote, index) => (
                        console.log(sharedNote._id, "contenu note"),
                        <div key={sharedNote._id}>
                            <div className='UneNote'>
                                <div className='NoteName'>{sharedNote.titre}</div>
                                <div className='DateName'>{sharedNote.date}</div>
                                <div className='Buttons'>
                                    <MdEdit  size={20} className='Icon' onClick={() => handleViewDetailsShared(sharedNote)}/>
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
