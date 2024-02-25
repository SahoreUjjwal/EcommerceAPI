const dbclient = require("../connection");
const {SCHEMA}  = require("../../config/index");
//Dealing with data base operations
class ProductRepository {
    async CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier
      }) {
        try {
           
          await dbclient.connect();
          const result = await dbclient.query(`INSERT INTO "${SCHEMA}".product (name,"desc",type,unit,price,available,suplier) values($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[name,
            desc,
            type,
            unit,
            price,
            available,
            suplier]);
            dbclient.end();
          return result.rows[0].idProduct;
        } catch (err) {
            console.log(err);
          throw err;
        }
      }
    
      async Products() {
        try {
          await dbclient.connect();
          const response = await dbclient.query(`SELECT * FROM "${SCHEMA}".PRODUCT`);
          await dbclient.end();
          return response.rows;
        } catch (err) {
          throw err;
        }
      }
    
      async FindById(id) {
        try {
          await dbclient.connect();
          const response = await dbclient.query(`SELECT * FROM "${SCHEMA}".PRODUCT WHERE "idProduct" =$1`,[id]);
          await dbclient.end();
          return response.rows[0];
        } catch (err) {
            console.log(err);
          throw err;
        }
      }
    
      async FindByCategory(category) {
        try {
          await dbclient.connect();
          const products = await dbclient.query(`SELECT * FROM "${SCHEMA}".PRODUCT WHERE type = $1`,[category]);
          await dbclient.end();
          return products.rows;
        } catch (err) {
            console.log(err);
          throw err;
        }
      }
}

module.exports = ProductRepository;
