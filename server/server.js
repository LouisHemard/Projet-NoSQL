const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mariadb = require('mariadb');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Pour parser le corps des requêtes en JSON

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'example',
    database: 'user',
    port: 3307,
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', async (req, res) => {
    try {
        const { nom, prenom, mail, password } = req.body;
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        //console.log('INSERT INTO utilisateur (nom, prenom, mail, password) VALUES (?, ?, ?, ?)', [nom, prenom, mail, hashedPassword]);
        const conn = await pool.getConnection();
        console.log("cc")

        console.log(await pool.getConnection());
        const result = await conn.query('INSERT INTO utilisateur (nom, prenom, mail, password) VALUES (?, ?, ?, ?)', [nom, prenom, mail, hashedPassword]);
        conn.end();

        res.status(201).send({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log("cc")
        const { mail, password } = req.body;
        const conn = await pool.getConnection();

        // Recherche de l'utilisateur par email
        const result = await conn.query('SELECT * FROM utilisateur WHERE mail = ?', [mail]);
        console.log(result);
        // Vérifie si un utilisateur a été trouvé
        if (result.length === 0) {
            conn.end();
            return res.status(404).send({ message: 'Utilisateur non trouvé.' });
        }

        const user = result[0];

        // Comparaison des mots de passe
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Le mot de passe correspond, authentification réussie
            // Crée un objet user sans le mot de passe pour le retourner
            const { password, ...userWithoutPassword } = user;
            res.send({ message: 'Connexion réussie', user: userWithoutPassword });
        } else {
            // Le mot de passe ne correspond pas, échec de l'authentification
            res.status(401).send({ message: 'Mot de passe incorrect.' });
        }

        conn.end();
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).send({ message: 'Erreur lors de la tentative de connexion.' });
    }
});

app.post('/mail', async (req, res) => {
    try {
        const {mail} = req.body;
        console.log(mail)
        const conn = await pool.getConnection();

        const result = await conn.query('SELECT * FROM utilisateur WHERE mail = ?', [mail]);
        console.log(result[0].id);
        conn.release();

        if (result.length > 0) {
            res.status(200).send({ exists: true, message: 'Un utilisateur existe déjà avec cet email.' , id:result[0].id});
        } else {
            res.status(200).send({ exists: false, message: 'Aucun utilisateur trouvé avec cet email.' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error.message);
        res.status(500).send({ message: 'Erreur lors de la vérification de l\'utilisateur', error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
