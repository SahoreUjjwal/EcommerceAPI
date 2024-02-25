const {dbclient} = require("../index");
const {SCHEMA}=require('../../config/index');
class CustomerRepository{
    
    async CreateCustomer({ email, password, phone, salt }) {
        try {
            await dbclient.connect();
                   
                  dbclient.query(`Insert into "${SCHEMA}".customer (email,salt,phone,password) values($1,$2,$3,$4) RETURNING *`,[email,salt,phone,password],(err,result)=>{
                    if(!err)
                    {
                        console.log("result",result.rows[0].idCustomer);
                        let id = result.rows[0].idCustomer;
                        return id;
                    }
                    else{
                        console.log(err);
                    }
                });             
        } catch (err) {
          throw err
        }
      }
      async FindCustomer({ email }) {
        try {
            await dbclient.connect();
           const result = await dbclient.query(`select * from "${SCHEMA}".customer where email = $1`,[email]);
           if(result)
           {
                return result.rows[0];
           }
        } catch (err) {
            throw err;
        }
      }
      async CreateAddress({ idCustomer, street, postalCode, city, country }) {
        try {
            await dbclient.connect();
          const profile = await dbclient.query(`select * from "${SCHEMA}".customer where "idCustomer" =$1`,[idCustomer]);
    
          if (profile) {
            const result =await dbclient.query(`INSERT INTO "${SCHEMA}".address ("customerId",street, "postalCode", city, country ) values($1,$2,$3,$4,$5) RETURNING "idAddress"`,[idCustomer,street, postalCode, city,country]);
            if(result){
                return result.rows[0].idAddress;
            }
          }
          await dbclient.end();
        } catch (err) {
          throw err;
        }
      }
}


module.exports = CustomerRepository;