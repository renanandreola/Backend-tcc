const express = require("express");
const router = express.Router();
const { Telegraf } = require('telegraf');
const msg_env = require('./config/envTelegram');

const variationsController = require('./controllers/variationsController');
const loginTradeMapController = require('./controllers/loginTradeMapController');
const teste = require('./routes/actiosYahoo');

const insertClients = require('./database/operations/insertClients');

const bot = new Telegraf(msg_env.Credentials.token);
// const telegram = require('./helpers/telegram');

bot.start((ctx) => ctx.reply('Bem vindo!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('message', (ctx) => {
    console.log(ctx.message);

    let name = ctx.message.from.first_name;
    ctx.reply('Fala ' + name + ', ainda não estou pronto mas logo mais chamo vc!');
});

// Testing chatterbot route
router.get("/testing", async (req, res) => {
    console.log("Chatterbot test routing in running!");
    // bot.telegram.sendMessage(msg_env.Credentials.chat_id, "Chatterbot test routing in running!");

    return res.json({ 
        status: 200, 
        message: "Chatterbot test routing in running!" 
    });
});

// INITIAL PAGE
router.get('/actives', (req, res) => {
    // Get variations day
    async function getPromiseVariations() {
      try {
        const resultado = await variationsController();
        
        return res.json({ 
            status: 200, 
            response: resultado 
        });
      } catch (error) {
        console.error('Error getPromiseVariations at server: ', error);
  
        if (!error.response.data.success) {
          const loginWithVariations = await loginTradeMapController();

            return res.json({ 
                status: 200, 
                response: loginWithVariations 
            });
        } 
        // else {
        //   res.render('index.html');
        // }
      }
    }
  
    getPromiseVariations(); 
});

// CLIENTS
router.post('/client', async (req, res) => {
  async function insertNewClients() {
    console.log(req.body);
    try {
      const resultOpNewClients = await insertClients(req.body);

      if (resultOpNewClients && resultOpNewClients.insertedId) {
        res.send({
          status: 200
        });
      } else {
        res.send({
          status: 500
        });
      }

    } catch (error) {
      console.log("Error at insertNewClients: ", error);
    }
  }

  insertNewClients();
});

// INITIAL PAGE
router.get('/teste', async (req, res) => {

//   const yahooFinance = require('yahoo-finance');

// // Símbolo da ação da B3 que você deseja obter os dados
// const symbol = 'PETR4.SA'; // Exemplo: ação da Petrobras

// // Configura as opções de busca
// const options = {
//   symbols: [symbol],
//   modules: ['price', 'summaryDetail']
// };

// // Realiza a busca dos dados das ações
// yahooFinance.quote(options)
//   .then(response => {
//     const data = response[symbol];
//     // Processa os dados conforme necessário
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('Erro ao obter os dados das ações da B3:', error);
//   });


});

bot.launch();

module.exports = router;