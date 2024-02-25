const { v4: uuidv4 } = require('uuid');
const {dbclient} = require("../index");
const {SCHEMA} = require("../../config/index")
class ShoppingRepository {

    async Orders(customerId){
        try{
            const orders = await OrderModel.find({customerId });        
            return orders;
        }catch(err){
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
        }
    }
 
    async Cart(customerId){
        try{
            await dbclient.connect(); 
            const cartItems = await dbclient.query("",[]);
            await dbclient.end();
            if(cartItems){
                return cartItems;    
            }
            throw new Error('Data not Found');
        }catch(err){
            throw err;
        }
    }

    async AddCartItem(customerId, product, qty) {
        try {
            await dbclient.connect();
            console.log("Yoohoo");
            const cartItems = await dbclient.query(`select c."idCart", p."idProduct",p."name",p."price",c."quantity" from "${SCHEMA}"."cartItems" AS c INNER JOIN "${SCHEMA}"."product" AS p on c."idProduct" = p."idProduct" where c."idCustomer" = $1`,[customerId]);
            //const cartItems = await dbclient.query(`select * from "${SCHEMA}"."cartItems" AS c INNER JOIN "${SCHEMA}".product AS p on c."idProduct" = p."idProduct" where c."idCustomer" = $1`,[customerId]);
            console.log("Yoohoo2");
            if(cartItems && cartItems.rows.length>0)
            {
                let isExists =false;
                let tempQuant= 0;
                let cartId;
                
                cartItems.rows.map((item)=>{
                    if(item.idProduct == product.idProduct){
                        //console.log(item);
                        isExists = true;
                        cartId=item.idCart;
                        tempQuant = item.quantity+qty;
                    }
                    console.log(cartId);
                })
                if(isExists)
                {
                   const response= await dbclient.query(`UPDATE "${SCHEMA}"."cartItems" set "quantity" =$1 where "idCart" = $2`,[tempQuant,cartId]);
                   console.log("updated",response);
                    if(response)
                    {
                        return response;
                    }
                }
                else{
                    const response = await dbclient.query(`INSERT INTO "${SCHEMA}"."cartItems"(
                        "idCustomer", "idProduct", "itemPrice", quantity)
                        VALUES ( $1, $2, $3, $4)`,[customerId,product.idProduct,product.price,qty]);
                        if(response){
                            return response;
                        }
                }
                dbclient.end();
            }
        } catch (err) {
            console.log(err);
          throw err;
        }
      }

    async CreateNewOrder(customerId, txnId){
        try{
            const cart = await CartModel.findOne({customerId:customerId});
            if(cart){
                let amount = 0;   
                let cartItems = cart.items;
                if(cartItems.length > 0){
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) *  parseInt(item.unit);   
                    });
                    const orderId = uuidv4();
                    const order = new OrderModel({
                        orderId,
                        customerId,
                        amount,
                        txnId,
                        status: 'received',
                        items: cartItems
                    })
                    cart.items = [];
                    const orderResult = await order.save();    
                    await cart.save();
                    return orderResult;
                }
            }
    
          return {}

        }catch(err){
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }
    }
}

module.exports = ShoppingRepository;