const dotenv = require("dotenv");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const fileUpload = require('express-fileupload');  //for upload file in cloudnary
// INIT
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;

// Connections
require("./db/conn");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//MiddleWares

app.use(cookieParser());
app.use(express.json());
app.use(cors());

//We link the router file to make router easy
app.use(require("./router/application"));
app.use(require("./router/auth"));
app.use(require("./router/job"));
app.use(require("./router/message"));

//listening port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
