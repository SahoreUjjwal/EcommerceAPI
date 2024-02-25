const  ProductRepository  = require("../database/repository/product_repository");
const { FormateData } = require("../utils");


// All Business logic will be here
class ProductService {

    constructor(){
        this.repository = new ProductRepository();
    }

    async CreateProduct(productInputs){
        try{
            const productResult = await this.repository.CreateProduct(productInputs)
            return FormateData(productResult);
        }catch(err){
            throw err;
        }
    }
    
    async GetProducts(){
        try{
            const products = await this.repository.Products();
            return FormateData(products);

        }catch(err){
            throw err;
        }
    }


    async GetProductDescription(productId){
        try {
            const product = await this.repository.FindById(productId);
            return FormateData(product)
        } catch (err) {
            throw err;
        }
    }

    async GetProductsByCategory(category){
        try {
            const products = await this.repository.FindByCategory(category);
            return FormateData(products)
        } catch (err) {
            throw err;
        }

    }

    async GetProductById(productId){
        try {
            return await this.repository.FindById(productId);
        } catch (err) {
            throw err;
        }
    }
     async GetPrroductPayload(userId,{productId,qty},event){
            const product = await this.repository.FindById(productId);
            if(product){
                const payload={
                    event:event,
                    data:{userId,product,qty}
                }
                return FormateData(payload);
            }
            else{
                return FormateData({error:"No Product awailable"})
            }
     }
}

module.exports = ProductService;