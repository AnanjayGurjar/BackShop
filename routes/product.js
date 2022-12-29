const express = require("express");
const {} = require("../controllers/productController");
const router = express.Router();

router.route("/testproduct").get();

module.exports = router;
