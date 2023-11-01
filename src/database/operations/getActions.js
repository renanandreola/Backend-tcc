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
            
            const database = client.db('actions');
            const collectionActions = database.collection('actions');

            const result = await collectionActions.find().toArray();
   
            resolve(result);

        } catch (error) {
            console.log('Error on get actions: ', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = getActions;