const { MongoClient } = require('mongodb');
const ACCESS_DB = require('../../config/envDB')

const URI = "mongodb+srv://" + ACCESS_DB.DB_Credentials.Username + ":" + ACCESS_DB.DB_Credentials.Password + "@chatterbotcluster.cmwwli4.mongodb.net/Chatterbot_Database?retryWrites=true&w=majority";

async function searchActions(queryParam) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(URI, { 
            useUnifiedTopology: true
        });

        try {
            await client.connect();
            
            console.log("query", queryParam);

            const database = client.db('actions');
            const collectionActions = database.collection('actions');
        
            const query = queryParam;
            let queryObj = {};
            let cond = [];

        
            if (query && query.length > 0) {
              queryObj = { name: { $regex: query, $options: 'i' } };
            }
        
            const actions = await collectionActions.find(queryObj).sort(cond).toArray();
   
            resolve(actions);

        } catch (error) {
            console.error('Erro ao realziar search de ações:', error);
            reject(error);

        } finally {
            await client.close();
        }
    });
}

module.exports = searchActions;