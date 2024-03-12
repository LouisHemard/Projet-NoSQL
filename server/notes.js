const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;

// Utilise le middleware CORS pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Chaîne de connexion MongoDB
const uri = "mongodb://root:NoSql@localhost:27017/NoSql?authSource=admin";
const client = new MongoClient(uri);
const dbName = 'NoSql';

// Endpoint pour afficher toutes les notes (potentiellement filtrées par utilisateur)
app.get('/notes/:userId', async (req, res) => {
    // Convertis le paramètre userId en nombre s'il est stocké comme nombre dans MongoDB
    const userId = parseInt(req.params.userId);

    // Si la conversion échoue (par exemple, si req.params.userId n'est pas un nombre valide), cela renverra NaN
    if (isNaN(userId)) {
        return res.status(400).json({ message: "UserId must be a number" });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');

        // Utilise le bon type pour userId dans la requête
        const notes = await collection.find({ userId: userId }).toArray(); // enlève la projection si tu veux tout récupérer
        res.status(200).json(notes);
    } catch (e) {
        console.error(e); // Cela aidera au débogage en cas d'erreur
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
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

    const { titre, date, contenu ,userId } = req.body; // Supposons que l'on peut modifier userId ici, bien que cela soit inhabituel
    console.log(id,titre, date, contenu ,userId);
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
app.patch('/titre', async (req, res) => {
    const { idNote, titre } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const result = await collection.updateOne({ _id: new ObjectId(idNote) }, { $set: { titre: titre } });
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
