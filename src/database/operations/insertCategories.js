const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')
const CategoriesSchema = require('../Schemas/Categories');

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

const Categories = mongoose.model('Categories', CategoriesSchema);

async function insertCategories(newCategory) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();

            let category = new Categories(newCategory);
            
            const database = client.db('categories');
            const collection = database.collection('categories');

            const result = await collection.insertOne(category);
    
            resolve(result);

        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = insertCategories;