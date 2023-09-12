const express = require("express");
const router = express.Router();
const { Telegraf } = require('telegraf');
const msg_env = require('./config/envTelegram');
const { spawn } = require('child_process');

const variationsController = require('./controllers/variationsController');
const loginTradeMapController = require('./controllers/loginTradeMapController');

const insertClients = require('./database/operations/insertClients');
const getActions = require('./database/operations/getActions');
const searchActions = require('./database/operations/searchActions');

const getTickerPrice = require('./routes/getTickerPrice');

const bot = new Telegraf(msg_env.Credentials.token);
// const telegram = require('./helpers/telegram');

bot.start((ctx) => ctx.reply('Bem vindo!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('message', (ctx) => {
    console.log(ctx.message);

    let name = ctx.message.from.first_name;
    ctx.reply('Olá, ainda não estou pronto mas logo mais chamo vc!');
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

// GET ALL ACTIVES
router.get('/allActives', async (req, res) => {
  async function getAllActions() {

    try {
      const resultOpGetActions = await getActions();

      // console.log("resultOpGetActions: ", resultOpGetActions);

      if (resultOpGetActions && resultOpGetActions.length > 0) {
        return res.json({ 
          status: 200, 
          actives: resultOpGetActions,
          message: "Get all actions ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get all actions" 
        });
      }

    } catch (error) {
      console.log("Error at getAllActions: ", error);
    }
  }

  getAllActions();
});

// SEARCH ACTIONS
router.post('/searchResults', (req, res) => {
  async function searchActionsOp() {
    try {
      // console.log("req.body", req.body);
      const resultOpSearchActions = await searchActions(req.body.searchTerm);

      console.log("resultOpSearchActions: ", resultOpSearchActions);

      if (resultOpSearchActions && resultOpSearchActions.length > 0) {
        return res.json({ 
          status: 200, 
          results: resultOpSearchActions,
          message: "searchActionsOp ok" 
        });
      } else {
        return res.json({ 
          status: 400,
          message: "searchActionsOp no results"
        });
      }

    } catch (error) {
      console.log("Error at searchActionsOp: ", error);
    }
  }

  searchActionsOp();
});

// GET ACTIVE PRICE
router.post('/tickerPrice', async (req, res) => {
  async function tickerPrice() {

    try {
      const resultTicker = await getTickerPrice(req.body.code);

      console.log("resultTicker: ", resultTicker);

      if (resultTicker.status == 200) {
        return res.json({ 
          status: 200, 
          price: resultTicker.price,
          message: "Get ticker price ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get ticker price" 
        });
      }

    } catch (error) {
      console.log("Error at tickerPrice: ", error);
    }
  }

  tickerPrice();
});


// GET CHART INFO
router.post('/chart', async (req, res) => {
  async function chartInfo() {
    return new Promise((resolve, reject) => {
      const pythonFileName = 'teste.py';
      const pythonArgs = ['arg1', 'arg2'];
      const pythonProcess = spawn('python', [pythonFileName, ...pythonArgs]);

      let jsonData = '';

      pythonProcess.stdout.on('data', (data) => {
        jsonData += data;
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro do script Python: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          console.log('O script Python foi executado com sucesso.');
          resolve(jsonData); // Resolvendo a Promise com o JSON recebido
        } else {
          console.error(`O script Python saiu com código de erro ${code}.`);
          reject(`Erro na execução do script Python (Código ${code})`);
        }
      });
    });
  }

  try {
    const jsonResult = await chartInfo();
    console.log("jsonResult", jsonResult);
    return res.json({ status: 200, results: jsonResult, message: "chart ok" });
  } catch (error) {
    console.log("Error at chartInfo: ", error);
    return res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
});


bot.launch();

module.exports = router;