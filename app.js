const express = require("express");
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const divisionMiddlewares = require("./middlewares/division-middlewares");
const division = require("./helpers/division");

const port = process.env.PORT || 3000;
// const port = process.env.PORT || 8080;

let app = express();

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials')
}));

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
    res.render('home', {
        title: "Non-Restoring Division Calculator"
    });
});

app.get("/divide", divisionMiddlewares.checkOperands, divisionMiddlewares.convertStringToArray, (req, res) => {
    try{
        let result = division.nonRestoringDivision(req.query.dividend, req.query.divisor);
        res.status(200).send(result);
    }catch(err){
        res.status(500).send({message: "Internal Server Error."});
    }
});

app.listen(port, () => console.log("Listening at port " + port));