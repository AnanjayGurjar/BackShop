const BigPromise = require("../middlewares/bigPromise");

exports.testProduct = BigPromise(async (req, res) => {
  res.status(200).json({
    success: true,
    greeting: "test for product api",
  });
});
