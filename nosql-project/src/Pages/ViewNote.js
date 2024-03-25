import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { fetchNoteDetails } from "../data/notes";
import './NotePage.css'

const NoteDetails = () => {
    const location = useLocation();
    const { idNotes, titre, contenu } = location.state || {};
    console.log(idNotes)
    const [noteDetails, setNoteDetails] = useState({ titre: '', contenu: '' });

    return (
        <div className='container-left container-form'>
            <h1>Détails de la Note</h1>
            <div className='title'>
                <h3>Titre</h3>
                <input
                    className="input-form"
                    type="text"
                    value={titre}
                    disabled // Désactive le champ de saisie
                />
            </div>
            <div className='details'>
                <h3>Contenu</h3>
                <textarea
                    className="text-form"
                    value={contenu}
                    disabled // Désactive le champ de saisie
                />
            </div>
        </div>
    );

};

export default NoteDetails;
