const { MongoClient, ObjectId } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

async function deleteAction(actionId) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();
            
            const database = client.db('actions');
            const collection = database.collection('actions');

            const result = await collection.deleteOne({ _id: ObjectId(actionId) });

            resolve(result);

        } catch (error) {
            console.error('Erro ao deletar ativo:', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = deleteAction;