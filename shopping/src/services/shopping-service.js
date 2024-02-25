const  ShoppingRepository  = require("../database/repository/shopping-repository");
const {FormateData} = require("../utils/index");

class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }
  async getCart({id}){
    try{
      const cartItems = await this.repository.Cart(id);
      return FormateData(cartItems);
    }catch{
      throw err;
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }


  async ManageCart(customerId,item,qty){
    try{
      const cartResult = await this.repository.AddCartItem(customerId,item,qty);
      return FormateData(cartResult);
    }catch(err){
      throw err;
    }
  }
  async SubscribeEvents(payload){
 
    const { event, data } =  payload;

    const { userId, product, qty } = data;

    switch(event){
        
        case 'ADD_TO_CART':
            this.ManageCart(userId,product, qty, false);
            break;
        case 'REMOVE_FROM_CART':
            this.ManageCart(userId,product,qty, true);
            break;
        default:
            break;
    }

}
async GetPrroductPayload(userId,order,event){
  
  if(order){
      const payload={
          event:event,
          data:{userId,order}
      }
      return FormateData(payload);
  }
  else{
      return FormateData({error:"No Order is awailable"})
  }
}

}



module.exports = ShoppingService;
