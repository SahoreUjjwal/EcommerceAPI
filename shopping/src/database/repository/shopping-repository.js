const { v4: uuidv4 } = require('uuid');
const {dbclient} = require("../index");
const {SCHEMA} = require("../../config/index")
class ShoppingRepository {

    // async Orders(customerId){
    //     try{
    //         const orders = await dbclient.query(`SELECT * from "${SCHEMA}".""`);        
    //         return orders;
    //     }catch(err){
    //         throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
    //     }
    // }
 
    async Cart(customerId){
        try{
            await dbclient.connect(); 
            const cartItems = await dbclient.query(`SELECT * from "${SCHEMA}."cartItems where "idCustomer" = $1"`,[customerId]);
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
         
            const cartItems = await dbclient.query(`select c."idCart", p."idProduct",p."name",p."price",c."quantity" from "${SCHEMA}"."cartItems" AS c INNER JOIN "${SCHEMA}"."product" AS p on c."idProduct" = p."idProduct" where c."idCustomer" = $1`,[customerId]);
            //const cartItems = await dbclient.query(`select * from "${SCHEMA}"."cartItems" AS c INNER JOIN "${SCHEMA}".product AS p on c."idProduct" = p."idProduct" where c."idCustomer" = $1`,[customerId]);
            
            let isExists =false;
            let tempQuant= 0;
            let cartId;
            if(cartItems && cartItems.rows.length>0)
                {
                  cartItems.rows.map((item)=>{
                    if(item.idProduct == product.idProduct){
                        //console.log(item);
                        isExists = true;
                        cartId=item.idCart;
                        tempQuant = item.quantity+qty;
                    }
                    console.log(cartId);
                })}
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
            
        } catch (err) {
            console.log(err);
          throw err;
        }
      }
      async RemoveCartItem(customerId, product, qty) {
        try {
            await dbclient.connect();
           
            const cartItems = await dbclient.query(`select c."idCart", p."idProduct",p."name",p."price",c."quantity" from "${SCHEMA}"."cartItems" AS c INNER JOIN "${SCHEMA}"."product" AS p on c."idProduct" = p."idProduct" where c."idCustomer" = $1`,[customerId]);

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
                        tempQuant = item.quantity-qty;
                    }
                    console.log(cartId);
                })
                if(isExists)
                {
                    if(tempQuant ==0)
                    {
                        const response= await dbclient.query(`DELETE FROM "${SCHEMA}"."cartItems"  where "idCart" = $1`,[cartId]);
                        dbclient.end();
                        return response;
                    }
                   const response= await dbclient.query(`UPDATE "${SCHEMA}"."cartItems" set "quantity" =$1 where "idCart" = $2`,[tempQuant,cartId]);
                   console.log("updated",response);
                    if(response)
                    {
                        dbclient.end();
                        return response;
                    }
                }
                else{
                    dbclient.end();
                    return {message:"Item does not exist"};
                }
            }
        } catch (err) {
          throw err;
        }
      }
      async DeleteCartItem(customerId, idProduct) {
        try {
            await dbclient.connect();
           
            const cartItems = await dbclient.query(`select * from "${SCHEMA}"."cartItems" where "idProduct" = $1 and "idCustomer" = $2`,[idProduct,customerId]);
            if(cartItems.rows>0)
            {
                const result = await dbclient.query(`DELETE from "${SCHEMA}"."cartItems" where "idProduct" = $1 and "idCustomer" = $2`,[idProduct,customerId]);
                if(result)
                {
                    return result;
                }
            }
            else{
                throw new Error("Item  does not exist");
            } 
        } catch (err) {
          throw err;
        }
      }

    async CreateNewOrder(customerId){
        try{
            await dbclient.connect();
            const response = await dbclient.query(`SELECT p."idProduct",p."price",c."quantity" FROM "${SCHEMA}"."cartItems" AS c INNER JOIN "${SCHEMA}"."product" AS p ON c."idProduct" = p."idProduct" where "idCustomer" = $1`,[customerId.idCustomer]);
            if(response.rows.length>0){
                let orderRef = uuidv4();
                let total =0;
                let orderdate =new Date();
                orderdate = orderdate.toISOString();
                response.rows.forEach((item)=>{
                    total +=item.quantity*item.price;
                })
                const responseCreateOrder = await dbclient.query(`INSERT INTO "${SCHEMA}"."order"(
                    "UUID", total, "idCustomer", "orderDate", status)
                    VALUES ( $1, $2, $3, $4,$5) RETURNING "UUID"`,[orderRef,total,customerId.idCustomer,orderdate,1]);
                if(responseCreateOrder){
                    response.rows.map(async (item)=>{
                        await dbclient.query(`INSERT INTO "${SCHEMA}"."orderItem"(
                            "UUID", "idProduct", "orderPrice", quantity)
                            VALUES ( $1, $2, $3, $4) RETURNING "id"`,[orderRef,item.idProduct,total,item.quantity])
                    })
                    await dbclient.query(`DELETE from "${SCHEMA}"."cartItems" where "idCustomer" = $1`,[customerId.idCustomer]);
                    dbclient.end();
                    return {ref:orderRef,message:"Order Placed"};
                }
            }
            else{
                dbclient.end();
                return {message:"Cart is empty"};
            }
           
        }catch(err){
            console.log(err);
            throw err;
         }
    }
}

module.exports = ShoppingRepository;