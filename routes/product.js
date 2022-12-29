const express = require("express");
const {
  addProduct,
  getFilteredProducts,
  getOneProduct,
} = require("../controllers/productController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

//user routes
router.route("/products").get(getFilteredProducts);
router.route("/product/:id").get(getOneProduct);

//admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;
