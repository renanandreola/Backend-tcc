const upsAndDownsB3 = require('../routes/upsAndDownsActivesRoute');

async function getPromiseVariations() {
    return new Promise(async (resolve, reject) => {
        try {
            const resultado = await upsAndDownsB3();
            
            if (!resultado.success) {
                throw 'Error on get variations TradeMap.'
            }
            
            let downs = resultado.result.asc;
            let ups = resultado.result.desc;

            const variations = {
                "less": downs,
                "more": ups
            }

            resolve(variations);
        } catch (error) {
            console.log('Error at controller variationsController: ', error);
            reject(error);
        }
    })
}

module.exports = getPromiseVariations;
