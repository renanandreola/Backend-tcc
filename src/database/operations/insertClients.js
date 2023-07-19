const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')
const ClientsSchema = require('../../database/Schemas/Clients');
const md5 = require('md5');

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

const Clients = mongoose.model('Clients', ClientsSchema);

async function insertClients(newClient) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();

            let user = new Clients(newClient);
            
            const database = client.db('clients');
            const collection = database.collection('clients');

            user.password = md5(user.password);

            const result = await collection.insertOne(user);
            
            console.log('Usuário salvo com sucesso:', result.insertedId);
            
            resolve(result);

        } catch (error) {
            console.error('Erro ao salvar o usuário:', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = insertClients;