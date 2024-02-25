const { dbclient } = require("../database");
const ShoppingService = require("../services/shopping-service");

const UserAuth = require('./middlewares/auth');

module.exports = (app) => {
    
    const service = new ShoppingService();


    app.post('/order',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;


        try {
            const { data } = await service.PlaceOrder({_id, txnNumber});
            const payload = await service.GetPrroductPayload(_id,data,'CREATE_ORDER');
            PublishCustomerEvents(payload);

            return res.status(200).json(data);
            
        } catch (err) {
            next(err)
        }

    });

    app.get('/orders',UserAuth, async (req,res,next) => {

        const { id } = req.user;

        try {
            const { data } = await service.GetOrders(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });
       
    
    app.get('/cart', UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        try {
            const { data } = await service.getCart(_id);
            return res.status(200).json(data.cart);
        } catch (err) {
            next(err);
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

        const { _id } = req.user;
        const productId = req.params.id;
        try {
            const {data} = await service.GetPrroductPayload(_id,{productId },'REMOVE_FROM_CART');
            PublishCustomerEvents(data);
            PublishShoppingEvents(data);
            const response ={
                product:data.data.product,
                unit:data.data.qty
               }
            return res.status(200).json(response);
        } catch (err) {
            next(err)
        }
    });
}