const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const { promisify } = require('util');

const app = express();
app.use(bodyParser.json());

const redisClient = redis.createClient({ host: 'localhost', port: 6379 });
redisClient.on('error', err => console.error('Redis Client Error', err));

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Ajouter ou mettre à jour une note
app.post('/notes', async (req, res) => {
    const { userId, noteId, titre, date } = req.body;
    const noteKey = `note:${userId}:${noteId}`;

    try {
        await setAsync(noteKey, JSON.stringify({ titre, date }));
        res.status(200).json({ message: 'Note ajoutée ou mise à jour avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la sauvegarde de la note.' });
    }
});

// Récupérer une note spécifique
app.get('/notes/:userId/:noteId', async (req, res) => {
    const { userId, noteId } = req.params;
    const noteKey = `note:${userId}:${noteId}`;

    try {
        const noteData = await getAsync(noteKey);
        if (noteData) {
            res.status(200).json(JSON.parse(noteData));
        } else {
            res.status(404).json({ message: 'Note non trouvée.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la note.' });
    }
});

// Supprimer une note spécifique
app.delete('/notes/:userId/:noteId', async (req, res) => {
    const { userId, noteId } = req.params;
    const noteKey = `note:${userId}:${noteId}`;

    try {
        await delAsync(noteKey);
        res.status(200).json({ message: 'Note supprimée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la note.' });
    }
});

app.listen(3003, () => {
    console.log('Serveur démarré sur http://localhost:3003');
});
