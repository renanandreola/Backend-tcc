const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

async function getFavorites(favorite) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();
            
            const database = client.db('favorites');
            const collection = database.collection('favorites');

            const cursor = collection.find({
                'userEmail': favorite.userEmail
            });

            const result = await cursor.toArray();
            
            resolve(result);

        } catch (error) {
            console.log('Erro ao buscar favoritos:', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = getFavorites;