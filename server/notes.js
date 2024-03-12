const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Chaîne de connexion MongoDB
const uri = "mongodb://root:NoSql@localhost:27017/NoSql?authSource=admin";
const client = new MongoClient(uri);
const dbName = 'NoSql';

// Endpoint pour afficher toutes les notes (potentiellement filtrées par utilisateur)
app.get('/notes', async (req, res) => {
    const {userId}  = req.body;
    if (!userId) {
        return res.status(400).json({ message: "UserId is required" }); // Vérifie que l'ID de l'utilisateur est fourni
    }
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        // Filtrer les notes par userId
        const notes = await collection.find({ userId: userId }, { projection: { contenu: 0 } }).toArray();
        res.status(200).json(notes);
    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
});


// Endpoint pour afficher les détails d'une note spécifique
app.get('/detailsNotes', async (req, res) => {
    const {id}  = req.body;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const note = await collection.findOne({ _id: new ObjectId(id) });
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
    console.log(req.body);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const result = await collection.insertOne({ titre, date, contenu, userId });
        res.status(201).json({ id: result.insertedId });
    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
});

// Endpoint pour modifier une note existante
app.patch('/notes', async (req, res) => {
    const {id}  = req.body;
    console.log(id);
    const { titre, date, contenu ,userId } = req.body; // Supposons que l'on peut modifier userId ici, bien que cela soit inhabituel
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
    const { userId } = req.body; // Récupère l'ID de l'utilisateur depuis le corps de la requête

    if (!userId) {
        return res.status(400).json({ message: "UserId is required in the request body." });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        // Tente de supprimer la note en s'assurant qu'elle appartient à l'utilisateur
        const result = await collection.deleteOne({ _id: new ObjectId(id), userId: userId });

        if (result.deletedCount === 0) {
            // Si aucun document n'a été supprimé, cela signifie que la note n'a pas été trouvée ou qu'elle n'appartient pas à l'utilisateur
            res.status(404).json({ message: "Note not found or user does not have permission to delete this note." });
        } else {
            res.status(200).json({ message: "Note deleted successfully." });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
});


// Les autres endpoints restent inchangés puisqu'ils n'impliquent pas directement `userId` dans leurs opérations.

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
