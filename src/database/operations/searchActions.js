const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

async function searchActions(searchTerm) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();

            const database = client.db('actions');
            const collectionActions = database.collection('actions');
        
            const query = searchTerm;
            let queryObj = {};
            let cond = [];

        
            if (query && query.length > 0) {
                queryObj = {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { code: { $regex: query, $options: 'i' } } 
                    ]
                };
            }
        
            const actions = await collectionActions.find(queryObj).sort(cond).toArray();
   
            resolve(actions);

        } catch (error) {
            console.log('Error at search actions: ', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = searchActions;