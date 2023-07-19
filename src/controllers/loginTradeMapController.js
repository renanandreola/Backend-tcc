const upsAndDownsB3 = require('../routes/upsAndDownsActivesRoute');
const login = require('../routes/loginTradeMapRoute');

async function requestLoginTradeMap() {
    return new Promise(async (resolve, reject) => {
        try {
            const makeLogin = await login()
            // console.log("Makelogin", makeLogin);

            if (makeLogin.success) {
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
            }
        } catch (error) {
            console.error('error at controller login: ', error);
            reject(error);
        }
    })
}

module.exports = requestLoginTradeMap;
