const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const getFavs = require('./src/database/operations/getAllFavorites');
const getChat = require('./src/database/operations/getChat');
const getTickerPrice = require('./src/routes/getTickerPrice');
const getTickerInfo = require('./src/routes/getTickerInfo');

const { Telegraf } = require('telegraf');
const msg_env = require('./src/config/envTelegram');

const bot = new Telegraf(msg_env.Credentials.token);

const app = express();

app.use(cors());
app.use(express.json());

const database_init = require('./src/database/mongodb');

database_init();

app.use("/chatterbot", require("./src/server"));

const port = 3030;

app.listen(port, () => {
    console.log("Listen on port: " + port);

    schedule.scheduleJob('0 17 * * *', async () => {
        console.log("Rodou serviço");
       
        try {
            const resultOpGetFavorites = await getFavs();
    
            console.log("Favoritos do serviço: ", resultOpGetFavorites);

            resultOpGetFavorites.map(async function (favorite) {
                const resultOpGetChat = await getChat(favorite.userName, 'job');

                console.log("Chats do serviço: ", resultOpGetChat);

                const resultTicker = await getTickerPrice(favorite.code);
                
                let tickerValue = '...';
                
                if (resultTicker.status == 200) {
                    tickerValue = resultTicker.price;
                }

                const resultGraham = await getTickerInfo(favorite.code);
                
                let tickerGraham = '...'

                let havePj = false;
                if (resultGraham.status == 200) {
                    if (resultGraham.info.graham != NaN && resultGraham.info.graham != "NaN") {
                        havePj = true;
                        tickerGraham = resultGraham.info.graham;
                    }
                }

                // console.log("enviar para " + favorite.userName + ' informações sobre' + favorite.code);

                if (havePj) {
                    bot.telegram.sendMessage(resultOpGetChat[0].chatId, favorite.name + ' com preço atual de R$' + tickerValue + ' e seu preço justo é de R$' + tickerGraham);
                } else {
                    bot.telegram.sendMessage(resultOpGetChat[0].chatId, favorite.name + ' com preço atual de R$' + tickerValue + ', mas seu preço justo não é calculável no momento devido aos dados da empresa');
                }
            });
    
        } catch (error) {
            console.log("Error at schedule: ", error);
        }
    });
});