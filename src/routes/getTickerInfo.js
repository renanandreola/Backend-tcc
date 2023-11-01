const axios = require('axios');
const cheerio = require('cheerio');
const getTickerPrice = require('./getTickerPrice');
// C2AKWGVXTRCJCP8T

const getTickerInfo = async (code) => {
    return new Promise(async (resolve, reject) => {
        const url = `https://www.fundamentus.com.br/detalhes.php?papel=${code}`;

        try {
            const response = await axios.get(url);

            const $ = cheerio.load(response.data);
            const dataDestaqueElement = $('.data.w2');
        
            if (dataDestaqueElement.length > 0) {
                const dataDestaqueArray = dataDestaqueElement.map((index, element) => {
                    return $(element).text();
                }).get();

                const resultTicker = await getTickerPrice(code);

                let pl = parseFloat(dataDestaqueArray[1].replace(',', '.'));
                let pvp = parseFloat(dataDestaqueArray[3].replace(',', '.'));
                let cot = parseFloat(resultTicker.price.replace(',', '.'));
                let lpa = cot / pl
                let vpa = cot / pvp

                let graham = Math.sqrt(22.5 * lpa * vpa);
                let analyze = false;
                
                if (graham > cot) {
                    analyze = true;
                }

                let data = {
                    analyze: analyze,
                    graham: graham.toFixed(2)
                }

                resolve({
                    status: 200,
                    info: data
                });
            } else {
                console.log('Classe não encontrada para calcular preço justo.');
                reject({
                    status: 400
                });
            }
        } catch (error) {
            console.error('Erro ao acessar a URL:', error);
            reject({
                status: 400
            });
        }
    });
}

module.exports = getTickerInfo;