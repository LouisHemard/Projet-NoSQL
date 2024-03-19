const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const Redis = require("ioredis");

const app = express();
const port = 3003;

// Utilise le middleware CORS pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());
const redis = new Redis(); // connect to Redis with default settings

// Chaîne de connexion MongoDB
const uri = "mongodb://root:NoSql@localhost:27017/NoSql?authSource=admin";
const client = new MongoClient(uri);
const dbName = 'NoSql';

// Endpoint pour afficher toutes les notes (potentiellement filtrées par utilisateur)
app.get('/notes/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    //console.log(userId);
    try {
        let notes = await redis.lrange(userId, 0, -1);
        //console.log(notes);

        // Convertit chaque note en JSON, en gérant les erreurs de conversion
        notes = notes.map(note => {
            try {
                return JSON.parse(note); // Tente de parser la note
            } catch (err) {
                console.log('Erreur lors de la conversion JSON:', note);
                return null; // Retourne null si la conversion échoue
            }
        }).filter(note => note !== null); // Filtre les éléments non valides (null)
        //console.log(notes);
        res.status(200).send(notes); // Envoie les notes valides au client
    } catch (err) {
        console.error('Erreur lors de la récupération des notes:', err);
        res.status(500).send({ message: 'Erreur serveur.' });
    }
});



// Endpoint pour afficher les détails d'une note spécifique
app.get('/detailsNotes/:idNotes', async (req, res) => {
    const id = req.params.idNotes;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const note = await collection.findOne({ _id: new ObjectId(id) }); // Utiliser new ObjectId(id) pour créer un nouvel ObjectId
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({ message: "Note not found" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
});

// Endpoint pour créer une nouvelle note
app.post('/notes', async (req, res) => {


    const { titre, date, contenu, userId } = req.body; // Récupère userId directement depuis le corps de la requête
    //console.log(req.body);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const result = await collection.insertOne({ titre, date, contenu, userId });
        const id = result.insertedId.toString();
        //console.log(id)
        const noteData = {
            "idNotes": id,
            "titre": titre,
            "date": date
        };
        //console.log(noteData);
        const objetJson = JSON.stringify(noteData);
        await redis.rpush(`${userId}`, objetJson);



        res.status(201).json({ id: id.toString() });

    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }


});


// Endpoint pour modifier une note existante
app.patch('/notes', async (req, res) => {
    const {id}  = req.body;

    const { titre, date, contenu ,userId } = req.body; // Supposons que l'on peut modifier userId ici, bien que cela soit inhabituel
    //console.log(id,titre, date, contenu ,userId);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const result = await collection.updateOne({ _id: new ObjectId(id), userId }, { $set: { titre, date , contenu} });
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: "Note non trouvé ou utilisateur incorect"  });
        } else {
            res.status(200).json({ modifiedCount: result.modifiedCount });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
});

// Endpoint pour supprimer une note spécifique en fonction de l'ID de l'utilisateur passé dans le corps de la requête
app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params; // L'ID de la note à supprimer
    const { userId, index } = req.body; // Récupère l'ID de l'utilisateur et l'index de la note dans la liste Redis

    if (!userId) {
        return res.status(400).json({ message: "UserId is required in the request body." });
    }

    try {
        // Supprime la note dans Redis
        await redis.lset(userId, index, 'deleteMe');
        await redis.lrem(userId, 0, 'deleteMe');

        // Supprime la note dans MongoDB
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const result = await collection.deleteOne({ _id: new ObjectId(id), userId: userId });

        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Note not found or user does not have permission to delete this note." });
        } else {
            res.status(200).json({ message: "Note deleted successfully." });
        }
    } catch (e) {
        console.error(e); // Log l'erreur côté serveur
        res.status(500).json({ message: e.message });
    } finally {
        await client.close(); // S'assurer de fermer la connexion client à MongoDB
    }
});

app.patch('/titre', async (req, res) => {
    const { uneNotes, titre, index ,userId} = req.body;
    const newTitle = {
        idNotes : uneNotes.idNotes,
        titre : titre,
        date: uneNotes.data
    }
    console.log(uneNotes, titre, index, userId);

    const objetJson = JSON.stringify(newTitle);
    try {
        await redis.lset(userId, index, objetJson);

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const result = await collection.updateOne({ _id: new ObjectId(uneNotes.idNotes) }, { $set: { titre: titre } });
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: "Note non trouvée ou utilisateur incorrect" });
        } else {
            res.status(200).json({ modifiedCount: result.modifiedCount });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
