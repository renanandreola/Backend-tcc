const express = require("express");
const router = express.Router();
const { Telegraf } = require('telegraf');
const msg_env = require('./config/envTelegram');

const variationsController = require('./controllers/variationsController');
const loginTradeMapController = require('./controllers/loginTradeMapController');

const insertClients = require('./database/operations/insertClients');
const getActions = require('./database/operations/getActions');

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

router.get('/teste', async (req, res) => {

});

bot.launch();

module.exports = router;