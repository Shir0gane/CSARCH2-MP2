const express = require("express");

const port = process.env.PORT || 3000;

let app = express();

app.listen(port, () => console.log("Listening at port " + port));