const express = require("express");
const {
  createOrder,
  getOneOrder,
  getOrdersOfUser,
  adminGetAllOrders,
  adminDeleteOrder,
  adminUpdateOrder,
} = require("../controllers/orderController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorders").get(isLoggedIn, getOrdersOfUser); //if the route would have been 'order/myorders' it will be redirected to the route above it

//admin routes
router
  .route("/admin/orders")
  .get(isLoggedIn, customRole("admin"), adminGetAllOrders);
router
  .route("/admin/order/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOrder);
router
  .route("/admin/order/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;
