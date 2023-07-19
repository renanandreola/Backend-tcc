const request_bot = require('../requests/request_telegram');
// TOKEN -> 5930374320:AAET1Cct1Qx9F9dPPZ4No7wnQdlQIXfB8nk
// GET UPDATES -> https://api.telegram.org/bot5930374320:AAET1Cct1Qx9F9dPPZ4No7wnQdlQIXfB8nk/getUpdates

const configs = {
    host: 'https://api.telegram.org',
    path: '/bot5930374320:AAET1Cct1Qx9F9dPPZ4No7wnQdlQIXfB8nk/sendMessage',
    chat_id: "-914664964"
}

const telegram = {
    send_message: async(message) => {
        try {
            var form = {
                'chat_id': configs.chat_id,
                'text': message
            };

            let options = {
                'method': 'POST',
                'hostname': configs.host.replace('https://', ''),
                'path': configs.path,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                'maxRedirects': 20
            };

            let response = await request_bot.make_request({
                options: options, 
                form: form, 
                json: true
            });

            return response // {success, error, statusCode, headers, body}

        } catch (error) {
            return { 
                success: false,
                statusCode: 400,
                body: `${error.name}: ${error.message}`
            }
        }
    }
}

module.exports = telegram;