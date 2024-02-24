const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CustomerService();

  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      res.status(500).json("Internal Server Error");
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.SignIn({ email, password });

      return res.json(data);
    } catch (err) {
      res.status(500).json({message:"Unable to find USER"});
    }
  });

  app.post("/address", UserAuth, async (req, res, next) => {
    try {
      const { idCustomer } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await service.AddNewAddress(idCustomer, {
        street,
        postalCode,
        city,
        country,
      });
      return res.json(data);
    } catch (err) {
      res.status(500).json({message:err})
    }
  });
};
