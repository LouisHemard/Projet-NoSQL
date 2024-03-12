// user.js
const express = require('express');
//const router = express.Router();
const pool = require('../db.js');
const bcrypt = require('bcrypt');
var app = express();
// Inscription
app.post('/register', async (req, res) => {
    try {
        console.log("coucou");
        const { nom, prenom, mail, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO utilisateur (nom, prenom, mail, password) VALUES (?, ?, ?, ?)', [nom, prenom, mail, hashedPassword]);
        conn.end();

        res.status(201).send({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
    }
});

// Connexion
app.post('/login', async (req, res) => {
    try {
        const { mail, password } = req.body;

        const conn = await pool.getConnection();
        const users = await conn.query('SELECT * FROM utilisateur WHERE mail = ?', [mail]);
        conn.end();

        if (users.length === 0) {
            return res.status(404).send({ message: 'Utilisateur non trouvé' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.send({ message: 'Connexion réussie' });
        } else {
            res.status(401).send({ message: 'Mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la connexion', error: error.message });
    }
});

module.exports = app;
