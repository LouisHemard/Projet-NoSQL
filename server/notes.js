const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const Redis = require("ioredis");
const neo4j = require('neo4j-driver');


const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'adminsql'));
const session = driver.session();

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

app.post('/share-note', async (req, res) => {
    console.log(req.body);
    try {
        const { user1, user2, noteId } = req.body;

        // Vérifier si les données nécessaires sont présentes dans le corps de la requête
        if (!user1 || !user2 || !noteId) {
            return res.status(400).json({ message: 'Les informations des utilisateurs et l\'ID de la note sont requis.' });
        }

        // Convertir les ID des utilisateurs en entiers
        const userId1 = parseInt(user1.id);
        const userId2 = parseInt(user2.id);

        // Exécution de la requête Cypher pour créer les utilisateurs et établir la relation
        const result = await session.run(
            'CREATE (u1:User {id: $userId1})\n' +
            'CREATE (u2:User {id: $userId2})\n' +
            'CREATE (n:Note {id: $noteId})\n' +
            'CREATE (u1)-[:SHARES]->(n)\n' +
            'CREATE (u2)-[:SHARES]->(n)\n' +
            'CREATE (n)-[:SHARED_WITH]->(u1)\n' +
            'CREATE (n)-[:SHARED_WITH]->(u2)',
            { userId1, userId2, noteId }
        );

        console.log('Utilisateurs créés et note partagée avec succès');
        res.status(200).json({ message: 'Utilisateurs créés et note partagée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la création des utilisateurs et du partage de la note:', error);
        res.status(500).json({ message: 'Erreur lors de la création des utilisateurs et du partage de la note' });
    }
});


app.get('/shared-note/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Exécutez une requête Cypher pour trouver l'ID de la note partagée avec l'utilisateur donné
        const result = await session.run(
            `MATCH (u:User {id: ${userId}})-[:SHARES]->(n:Note) RETURN n.id AS sharedNoteId`,
            { userId }
        );

        // Récupérer les ID des notes partagées à partir du résultat de la requête
        const sharedNoteIds = result.records.map(record => record.get('sharedNoteId'));

        res.status(200).json({ sharedNoteIds });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID de la note partagée:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'ID de la note partagée' });
    }
});



// Endpoint pour afficher les détails d'une note spécifique
app.get('/detailsNotes/:idNotes', async (req, res) => {
    console.log(req.params)
    const id = req.params.idNotes;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const note = await collection.findOne({ _id: new ObjectId(id) }); // Utiliser new ObjectId(id) pour créer un nouvel ObjectId
        if (note) {
            //console.log(note);
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

//end Point Tableau Notes Shared
app.post('/arrayDetailsNotes/', async (req, res) => {
    const arrayId = req.body;
    //console.log(req.body ,'coucou sharedd');
   try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
       //console.log(arrayId, 'array id ');
       const arrayObjectId = arrayId.map(id => new ObjectId(id))
        const cursor = await collection.find( { _id : { $in : arrayObjectId } } ); // Utiliser new ObjectId(id) pour créer un nouvel ObjectId
       const documents = await cursor.toArray();
       console.log(documents, 'note recupéré');
       if (documents) {

            res.status(200).json(documents);
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
   console.log('cc')

    const { idNotes, titre, contenu,date,idUser, index } = req.body.noteData;
    console.log(req.body);

    const objetJson = JSON.stringify({ idNotes: idNotes,titre: titre,date: date });
   console.log(objetJson);

    try {
        await redis.lset(idUser, index, objetJson);

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('notes');
        const result = await collection.updateOne({ _id: new ObjectId(idNotes) }, { $set: {contenu: contenu, titre:titre} });
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
