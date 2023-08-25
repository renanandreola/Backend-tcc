const axios = require('axios');
var request = require('request');
const alpha = require('alphavantage')({ key: 'C2AKWGVXTRCJCP8T' });
// C2AKWGVXTRCJCP8T
const getTickerPrice = async () => {
    return new Promise(async (resolve, reject) => {

        // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
        var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=GFSA3.SA&interval=5min&apikey=C2AKWGVXTRCJCP8T';

        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err) {
            console.log('Error:', err);
            } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
            } else {
            // data is successfully parsed as a JSON object:
            console.log(data);
            }
        });

    });
}

module.exports = getTickerPrice;