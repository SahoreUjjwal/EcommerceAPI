const CustomerRepository = require("../repository/customer-repository")
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature} = require('../utils');

class CustomerService{
    constructor(){
        this.repository = new CustomerRepository;
    }

    async SignUp(userInputs){

        const { email, password, phone } = userInputs;
        
        try{
            // create salt
            let salt = await GenerateSalt();
            
            let userPassword = await GeneratePassword(password, salt);
            
            const existingCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone, salt});
            
            const token = await GenerateSignature({ email: email, id: existingCustomer});

            return FormateData({id: existingCustomer, token });

        }catch(err){
            throw err;
        }

    }

}   

module.exports = CustomerService;