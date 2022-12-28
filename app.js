const express = require("express");

//dotenv is not required here, but sometimes in wierd situtations the entire app doesn't work only because this line is missing hence to be safe we can use it
//but it should always work if dotenv is configured in your index.js
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

/**for swagger documentation, not used in the current project **/
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//temp check
app.set("view engine", "ejs");

//cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//morgan middleware need to come up before defining any of the routes
app.use(morgan("tiny"));

//import all routes here
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");

//router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);

app.get("/signuptest", (req, res) => {
  res.render("signuptest");
});

//export app.js
module.exports = app;
