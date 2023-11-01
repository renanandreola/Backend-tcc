const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')
const ChatSchema = require('../../database/Schemas/Chats');

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

const Chats = mongoose.model('Chats', ChatSchema);

async function insertChat(newChat) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();

            let chat = new Chats(newChat);
            
            const database = client.db('chats');
            const collection = database.collection('chats');

            const result = await collection.insertOne(chat);
            
            resolve(result);

        } catch (error) {
            console.log('Error on save chat: ', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = insertChat;