const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')
const FavoritesSchema = require('../../database/Schemas/Favorites');

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

const Favorites = mongoose.model('Favorites', FavoritesSchema);

async function insertFavorites(newFavorite) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();

            let favorite = new Favorites(newFavorite);
            
            const database = client.db('favorites');
            const collection = database.collection('favorites');

            const result = await collection.insertOne(favorite);
            
            resolve(result);

        } catch (error) {
            console.log('Error on save favorite: ', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = insertFavorites;