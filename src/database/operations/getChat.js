const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

async function getChat(chatId, param) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();
            
            const database = client.db('chats');
            const collection = database.collection('chats');
            var cursor;

            if (param == "botMessage") {
                cursor = collection.find({
                    'chatId': chatId
                });
            } else {
                cursor = collection.find({
                    'name': chatId
                });
            }


            const result = await cursor.toArray();
            
            resolve(result);

        } catch (error) {
            console.log('Erro ao buscar chat: ', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = getChat;