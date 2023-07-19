const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

async function getActions() {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();
            
            const database1 = client.db('categories');
            const database2 = client.db('actions');
            const collectionCategories = database1.collection('categories');
            const collectionActions = database2.collection('actions');

            const result1 = await collectionCategories.find().toArray();
            const result2 = await collectionActions.find().toArray();
   
            resolve({categories: result1, actions: result2});

        } catch (error) {
            console.error('Erro ao buscar ações:', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = getActions;