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
                            date: data,
                            previewLink: exibirLink,
                            downloadLink: downloadLink
                        }
                    )
                    // console.log('Data:', data);
                    // console.log('Link de Exibir:', exibirLink);
                    // console.log('Link de Download:', downloadLink);
                });

                dataLinks.shift();

                console.log("dataLinks: ", dataLinks);
                console.log("dataLinks: ", dataLinks.length);

                resolve({
                    status: 200,
                    dataLinks
                });
            } else {
                console.log('Classe não encontrada.');
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