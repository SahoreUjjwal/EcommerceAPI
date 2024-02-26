
const ShoppingService = require("../services/shopping-service");

const UserAuth = require('./middlewares/auth');

module.exports = (app) => {
    
    const service = new ShoppingService();
    app.post('/order',UserAuth, async (req,res,next) => {

        const { idCustomer } = req.user;
      
        try {
            const  data  = await service.PlaceOrder({idCustomer});
            return res.status(200).json(data);
  
        } catch (err) {
            return res.status(500).json({message:"Unable to place order"});
        }
    });

    app.get('/orders',UserAuth, async (req,res,next) => {

        const { idCustomer } = req.user;

        try {
            const { data } = await service.GetOrders(idCustomer);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });
       
    
    app.get('/cart', UserAuth, async (req,res,next) => {

        const { idCustomer } = req.user;
        try {
            const { data } = await service.getCart(idCustomer);
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({message:err});
        }
    });

    
    app.post('/addcart',UserAuth, async (req,res,next) => {
        
        const { idCustomer } = req.user;
        console.log("hello");
        try {     
                   const response = await service.ManageCart(idCustomer,req.body.product,req.body.qty);
                    if(response){
                        return res.status(200).json({message:"Added to cart"});
                    }
        } catch (err) {
           return err;
        }
    });
    
    app.delete('/cart/:id',UserAuth, async (req,res,next) => {

        const { idCustomer } = req.user;
        const productId = req.params.id;
        try {
            const {data} = await service.DeleteItem(idCustomer,productId);

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({message:"Unable to delete"})
        }
    });
}