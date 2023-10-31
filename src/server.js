const express = require("express");
const router = express.Router();
const { Telegraf } = require('telegraf');
const msg_env = require('./config/envTelegram');
const { spawn } = require('child_process');
const yahooFinance = require('yahoo-finance');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const variationsController = require('./controllers/variationsController');
const loginTradeMapController = require('./controllers/loginTradeMapController');

const insertClients = require('./database/operations/insertClients');
const insertFavorites = require('./database/operations/insertFavorites');
const getActions = require('./database/operations/getActions');
const getFavs = require('./database/operations/getFavorites');
const getChat = require('./database/operations/getChat');
const addChat = require('./database/operations/addChatInfo');
const removeFavs = require('./database/operations/removeFavorite');
const searchActions = require('./database/operations/searchActions');

const getTickerPrice = require('./routes/getTickerPrice');
const getTickerInfo = require('./routes/getTickerInfo');
const getCalendarData = require('./routes/getCalendarData');

const loginClients = require('./database/operations/loginClients');

const bot = new Telegraf(msg_env.Credentials.token);
// const telegram = require('./helpers/telegram');

bot.start((ctx) => ctx.reply('Bem vindo!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('message', async (ctx) => {
  console.log(ctx.message);

  const resultOpGetChat = await getChat(ctx.chat.id);

    console.log("resultOpGetChat: ", resultOpGetChat);

  if (resultOpGetChat && resultOpGetChat.length > 0) {
    console.log("Chat já salvo");
  } else {
    let data = {
      name: ctx.chat.first_name + ' ' + ctx.chat.last_name,
      chatId: ctx.chat.id
    }
    const resultOpInsertChat = await addChat(data);

    console.log("resultOpInsertChat: ", resultOpInsertChat);

    if (resultOpInsertChat && resultOpInsertChat.insertedId) {
      console.log("Chat adicionado com sucesso");
    }
  }

    // let name = ctx.message.from.first_name;
    // ctx.reply('Olá, ainda não estou pronto mas logo mais chamo vc!');
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

// GET TICKER JUST PRICE
router.post('/tickerInfoJustPrice', async (req, res) => {
  async function tickerInfoJustPrice() {

    try {
      
      console.log("req.body", req.body.codes);
      let arrayPrices = [];
      
      for(code of req.body.codes) {
        
        const resultTicker = await getTickerInfo(code);
        
        if (resultTicker.status == 200) {
          arrayPrices.push(resultTicker.info.graham);
        } else {
          arrayPrices.push('');
        }
      }

      if (arrayPrices.length > 0) {
        return res.json({ 
          status: 200, 
          prices: arrayPrices,
          message: "Get ticker price ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get ticker price" 
        });
      }

    } catch (error) {
      console.log("Error at tickerInfoJustPrice: ", error);
    }
  }

  tickerInfoJustPrice();
});

// GET ACTIVE PRICE ARRAY
router.post('/tickerPriceArray', async (req, res) => {
  async function tickerPriceArray() {

    try {
      console.log("req.body", req.body.codes);
      let arrayPrices = [];

      for(code of req.body.codes) {

        const resultTicker = await getTickerPrice(code);
        
        if (resultTicker.status == 200) {
          arrayPrices.push(resultTicker.price);
        } else {
          arrayPrices.push('');
        }
      }

      if (arrayPrices.length > 0) {
        return res.json({ 
          status: 200, 
          prices: arrayPrices,
          message: "Get ticker price ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get ticker price" 
        });
      }

    } catch (error) {
      console.log("Error at tickerPriceArray: ", error);
    }
  }

  tickerPriceArray();
});

// GET TICKER INFO
router.post('/tickerInfo', async (req, res) => {
  async function tickerInfo() {

    try {
      const resultTicker = await getTickerInfo(req.body.code);

      if (resultTicker.status == 200) {
        return res.json({ 
          status: 200, 
          info: resultTicker.info,
          message: "Get ticker info ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get ticker info" 
        });
      }

    } catch (error) {
      console.log("Error at tickerInfo: ", error);
    }
  }

  tickerInfo();
});

// GET TICKER INFO
router.post('/getCalendarData', async (req, res) => {
  async function calendarData() {

    try {
      const resultData = await getCalendarData(req.body.code);

      if (resultData.dataLinks.length > 0) {
        return res.json({ 
          status: 200, 
          info: resultData,
          message: "Get calendar data info ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get calendar data info" 
        });
      }

    } catch (error) {
      console.log("Error at getCalendarData: ", error);
    }
  }

  calendarData();
});


// GET PJ INFO
router.get('/getBestPj', async (req, res) => {
  async function pjInfo() {
    return new Promise((resolve, reject) => {
      const pythonFileName = 'teste.py';
      const pythonArgs = ['arg1', 'arg2'];
      const pythonProcess = spawn('python', [pythonFileName, ...pythonArgs]);

      let jsonData = '';

      pythonProcess.stdout.on('data', (data) => {
        jsonData += data;
        // console.log("data", data);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro do script Python: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          console.log('O script Python foi executado com sucesso.');
          resolve(jsonData);
        } else {
          console.error(`O script Python saiu com código de erro ${code}.`);
          reject(`Erro na execução do script Python (Código ${code})`);
        }
      });
    });
  }

  try {
    const jsonResult = await pjInfo();
    console.log("jsonResult", jsonResult);
    return res.json({ status: 200, results: jsonResult, message: "Best PJ ok" });
  } catch (error) {
    console.log("Error at pjInfo: ", error);
    return res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
});

// GET CHART INFO
router.post('/chart', async (req, res) => {  
  async function getStockHistoricalData(symbol) {
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(1, 'years').format('YYYY-MM-DD'); // 2 anos atrás
  
    try {
      const data = await yahooFinance.historical({
        symbol: symbol,
        from: startDate,
        to: endDate,
      });
  
      return data;
    } catch (error) {
      console.error('Erro ao obter dados históricos de ações:', error);
      throw error;
    }
  }
  
  const symbol = `${req.body.code}.SA`; // Símbolo da ação na B3
  getStockHistoricalData(symbol)
    .then((data) => {
      console.log(data);
      return res.json({ status: 200, prices: data, message: "chart ok" });
    })
    .catch((error) => {
      console.error('Erro:', error);
      return res.json({ status: 400, error: error, message: "chart ok" });
    });
  
});

// LOGIN
router.post('/login', (req, res) => {
  async function makeLogin() {
    try {
      const resultOpLoginClients = await loginClients(req.body);

      if (resultOpLoginClients && resultOpLoginClients._id) {
        const secretKey = 'suaChaveSecretaSuperSecreta';
        const userData = {
          userId: resultOpLoginClients._id,
          username: req.body.email,
        };

        const token = jwt.sign(userData, secretKey);

        res.send({
          status: 200,
          token: token,
          email: req.body.email
        });
      } else {
        res.send({
          status: 500
        });
      }

    } catch (error) {
      console.log("Error at makeLogin: ", error);
    }
  }

  makeLogin();
});

// CREATE FAVORITE
router.post('/favorite', async (req, res) => {
  async function insertFavorite() {
    console.log(req.body);
    try {
      const resultOpNewFavorites = await insertFavorites(req.body);

      if (resultOpNewFavorites && resultOpNewFavorites.insertedId) {
        res.send({
          status: 200
        });
      } else {
        res.send({
          status: 500
        });
      }

    } catch (error) {
      console.log("Error at insertFavorite: ", error);
    }
  }

  insertFavorite();
});

// GET ALL FAVORITES
router.post('/getFavorites', async (req, res) => {
  async function getAllFavorites() {
    console.log(req.body);
    try {
      const resultOpGetFavorites = await getFavs(req.body);

      // console.log("resultOpGetFavorites: ", resultOpGetFavorites);

      if (resultOpGetFavorites && resultOpGetFavorites.length > 0) {
        return res.json({ 
          status: 200, 
          favorites: resultOpGetFavorites,
          message: "Get all favorites ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get all favorites" 
        });
      }

    } catch (error) {
      console.log("Error at getAllFavorites: ", error);
    }
  }

  getAllFavorites();
});

// GET FAVORITE CALENDAR
router.post('/getFavoritesCalendar', async (req, res) => {
  async function getFavoritesCalendar() {
    // console.log(req.body);
    try {
      const resultOpGetFavorites = await getFavs(req.body);

      if (resultOpGetFavorites && resultOpGetFavorites.length > 0) {
        // console.log("renan: ", resultOpGetFavorites);

        async function processElements() {
          const arrayLinks = [];
        
          const promises = resultOpGetFavorites.map(async (element) => {
            const resultData = await getCalendarData(element.code);
        
            if (resultData.dataLinks.length > 0) {
              arrayLinks.push(resultData.dataLinks);
            } else {
              throw new Error("Error on get calendar data info");
            }
          });
        
          try {
            await Promise.all(promises);
            // console.log("arrayLinks: ", arrayLinks);
            
            const mergedArray = arrayLinks.reduce((accumulator, currentArray) => {
              return accumulator.concat(currentArray);
            }, []);
            
            // console.log("mergedArray", mergedArray.length);
            return mergedArray;

          } catch (error) {
            console.error("Erro nas chamadas assíncronas: ", error);
            return res.status(500).json({ 
              status: 500, 
              message: error.message
            });
          }
        }
        
        // Chame a função passando o seu array resultOpGetFavorites.
        var teste = await processElements();
        // console.log("teste: ", teste);

        return res.json({ 
          status: 200, 
          linksCustom: teste 
        });

      } else {
        return res.json({ 
          status: 500, 
          message: "Error on get all favorites" 
        });
      }

    } catch (error) {
      console.log("Error at getFavoritesCalendar: ", error);
    }
  }

  getFavoritesCalendar();
});

// REMOVE FAVORITE
router.post('/removeFavorite', async (req, res) => {
  async function removeFavorite() {
    console.log(req.body);
    try {
      const resultOpRemoveFavorite = await removeFavs(req.body);

      console.log("resultOpRemoveFavorite: ", resultOpRemoveFavorite);

      if (resultOpRemoveFavorite && resultOpRemoveFavorite.deletedCount == 1) {
        return res.json({ 
          status: 200, 
          favorites: resultOpRemoveFavorite,
          message: "Remove favorite ok" 
        });
      } else {
        return res.json({ 
          status: 500, 
          message: "Error on remove favorite" 
        });
      }

    } catch (error) {
      console.log("Error at removeFavorite: ", error);
    }
  }

  removeFavorite();
});

bot.launch();

module.exports = router;