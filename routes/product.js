const express = require("express");
const {
  adminAddProduct,
  getFilteredProducts,
  getOneProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} = require("../controllers/productController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

//user routes
router.route("/products").get(getFilteredProducts);
router.route("/product/:id").get(getOneProduct);

//admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), adminAddProduct);

router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateProduct)
  .delete(isLoggedIn, customRole("admin"), adminDeleteProduct);

module.exports = router;
