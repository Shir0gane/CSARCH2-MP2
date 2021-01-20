const express = require("express");
const divisionMiddlewares = require("./middlewares/division-middlewares");
const division = require("./helpers/division");

const port = process.env.PORT || 3000;

let app = express();

app.get("/divide/:dividend/:divisor", divisionMiddlewares.checkOperands, divisionMiddlewares.convertStringToArray, (req, res) => {
    try{
        let result = division.nonRestoringDivision(req.params.dividend, req.params.divisor);
        res.status(200).send(result);
    }catch(err){
        res.status(500).send({message: "Internal Server Error."});
    }
});

app.listen(port, () => console.log("Listening at port " + port));