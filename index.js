const express = require('express');
const shortenUrl = require('./modal/db.js')
const bodyParser = require('body-parser')
const cors = require('cors')
const rateLimit = require("express-rate-limit");

// Initialize Express app
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Init middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(limiter);
app.use(cors(corsOptions))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World')
})

// @Route       GET
// Param:       shorturl    To get the shorturl id from url
// Desc:        If shorturl i present it will redirect else it will give Invalid Base Url Response

app.get('/:shorturl', async (req, res) => {
    let short = req.params.shorturl
    let shortUrl = `http://localhost:5000/${short}`
    let url = await shortenUrl.checkUrl(shortUrl)
    if (url === "404") {
        res.status(404).json("Invalid Base Url")
    } else {
        res.redirect(url)
    }
    
})

// @Route       POST
// Desc:        If longurl is not there in db, it will generate short url and it will validate the given url first

app.post('/generate/url', async (req, res) => {
    let { inputurl } = req.body;
    let shortUrl = await shortenUrl.generateUrl(inputurl);
    
    res.send(JSON.stringify(shortUrl))
})

app.listen(5000, ()=> {
    console.log(`Server is running at 5000`)
})