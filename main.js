const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const schedule = require('node-schedule');
const getFavs = require('./src/database/operations/getAllFavorites');

const app = express();

app.use(cors());
app.use(express.json());

const database_init = require('./src/database/mongodb');

database_init();

app.use("/chatterbot", require("./src/server"));

const port = 3030;
app.listen(port, () => {
    console.log("Listen on port: " + port);

    schedule.scheduleJob('* * * * *', async () => {
        console.log("bunda");

       
        try {
            const resultOpGetFavorites = await getFavs();
    
            console.log("resultOpGetFavorites: ", resultOpGetFavorites);
    
            // if (resultOpGetFavorites && resultOpGetFavorites.length > 0) {
            // return res.json({ 
            //     status: 200, 
            //     favorites: resultOpGetFavorites,
            //     message: "Get all favorites ok" 
            // });
            // } else {
            // return res.json({ 
            //     status: 500, 
            //     message: "Error on get all favorites" 
            // });
            // }
    
        } catch (error) {
            console.log("Error at schedule: ", error);
        }
    });
});