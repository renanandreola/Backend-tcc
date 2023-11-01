const axios = require('axios');
const cheerio = require('cheerio');
// C2AKWGVXTRCJCP8T

const getTickerPrice = async (code) => {
    return new Promise(async (resolve, reject) => {
        const url = `https://www.fundamentus.com.br/detalhes.php?papel=${code}`;

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const dataDestaqueElement = $('.data.destaque.w3');
        
            if (dataDestaqueElement.length > 0) {
                const dataDestaqueText = dataDestaqueElement.text();
      
                resolve({
                    status: 200,
                    price: dataDestaqueText
                });
            } else {
                console.log('Classe não encontrada ao buscar valor do ativo.');
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

module.exports = getTickerPrice;