const { MongoClient, ObjectId } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

async function removeFavorite(favoriteId) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();
            
            const database = client.db('favorites');
            const collection = database.collection('favorites');

            const objectId = new ObjectId(favoriteId);

            const result = await collection.deleteOne({ _id: objectId });
            
            resolve(result);

        } catch (error) {
            console.log('Erro ao remover favorito: ', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = removeFavorite;