const ProductService = require("../service/product-service");


module.exports = (app) => {
    
    const service = new ProductService();

    app.post('/product/create', async(req,res,next) => {
        
        try {
            const { name, desc, type, unit,price, available, suplier } = req.body; 
            // validation
            console.log(req.body);
            const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier });
            return res.json({record:data,message:"Product Created"});
            
        } catch (err) {
            return res.status(500).json({message:"Unable to create product",Error:err}) ;   
        }
        
    });

    app.get('/category/:type', async(req,res,next) => {
        
        const type = req.params.type;
        console.log(type);
        try {
            const { data } = await service.GetProductsByCategory(type)
            return res.status(200).json(data);

        } catch (err) {
            return res.status(500).json({message:"Unable to find products",Error:err}) ;   
        }

    });

    app.get('/:id', async(req,res,next) => {
        
        const productId = req.params.id;
        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({message:"Unable to get product",Error:err}) ; 
        }
    });

    app.get('/', async (req,res,next) => {
        try {
            const { data} = await service.GetProducts();        
            return res.status(200).json(data);
        } catch (error) {
           throw error;
        }  
    });
    
}