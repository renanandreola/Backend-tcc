const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')
const ActionsSchema = require('../Schemas/Actions');

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

const Actions = mongoose.model('Actions', ActionsSchema);

async function insertActives(newActive) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();

            let action = new Actions(newActive);
            
            const database = client.db('actions');
            const collection = database.collection('actions');

            const result = await collection.insertOne(action);
    
            resolve(result);

        } catch (error) {
            console.error('Erro ao cadastrar ação:', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = insertActives;