const https = require('follow-redirects').https;
const qs = require('querystring');

const requests_telegram = {
    make_request: async (req, res) => {
        try {
            return new Promise((resolve, reject) => {
                const request = https.request(req.options, (res) => {
                    let data = []
    
                    res.on('data', (d) => {
                        data.push(d);
                    });
    
                    res.on("end", function (d) {
                        let body = (Buffer.concat(data)).toString()
                        
                        resolve({success: true, error: false, statusCode: res.statusCode, headers: res.headers, body: body})
                    });
    
                    res.on('error', (e) => {
                        resolve({success: false, error: true, statusCode: 0, headers: null, body: `${e.name}: ${e.message}`})
                    });
                });
        
                if (req.body) { request.write( typeof(req.body) == 'object' ? JSON.stringify(req.body) : req.body) }
                if (req.form) { request.write(qs.stringify(req.form)) }

                request.end();

                request.on('error', (e) => {
                    resolve({success: false, error: true, statusCode: 0, headers: null, body: `${e.name}: ${e.message}`})
                });
            })
            
        } catch (error) {
            return {success: false, error: true, statusCode: 0, headers: null, body: `${error.name}: ${error.message}`}
        }
    }
}

module.exports = requests_telegram;