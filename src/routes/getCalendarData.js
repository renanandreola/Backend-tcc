const axios = require('axios');
const cheerio = require('cheerio');

const getCalendarData = async (code) => {
    return new Promise(async (resolve, reject) => {
        const url = `https://www.fundamentus.com.br/resultados_trimestrais.php?papel=${code}`;

        try {
            const response = await axios.get(url);

            const $ = cheerio.load(response.data);
            const dates = $('.dth-entrega');
            const links = $('.download a');
        
            if (dates.length > 0 && links.length > 0) {

                let dataLinks = [];

                $('tr').each((index, element) => {
                    const data = $(element).find('.dth-entrega span').text();
                    const exibirLink = $(element).find('.download a[target="_blank"]').attr('href');
                    const downloadLink = $(element).find('.download a:not([target="_blank"])').attr('href');
                
                    dataLinks.push(
                        {
                            code: code,
                            date: data,
                            previewLink: exibirLink,
                            downloadLink: downloadLink
                        }
                    )
                });

                dataLinks.shift();

                resolve({
                    dataLinks
                });
            } else {
                console.log('Classe não encontrada para eventos.');
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

module.exports = getCalendarData;