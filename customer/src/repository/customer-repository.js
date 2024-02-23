const {dbclient} = require("../database/index");
const {SCHEMA}=require('../config/index');
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

}

module.exports = CustomerRepository;