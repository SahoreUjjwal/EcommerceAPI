const CustomerRepository = require("../repository/customer-repository")
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature,ValidatePassword} = require('../utils');

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
    async SignIn(userInputs){

        const { email, password } = userInputs;
        
        try {
            
            const existingCustomer = await this.repository.FindCustomer({ email});
           
            if(existingCustomer){
                
                const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
                console.log("pass",validPassword);
                if(validPassword){
                    const token = await GenerateSignature({ email: existingCustomer.email, idCustomer: existingCustomer.idCustomer});
                    return FormateData({idCustomer: existingCustomer.idCustomer, token });
                } 
            }
            return FormateData(null);
        } catch (err) {
            throw err;
        }

       
    }
    async AddNewAddress(idCustomer,userInputs){
        
        const { street, postalCode, city,country} = userInputs;
        
        try {
           
            const addressResult = await this.repository.CreateAddress({ idCustomer, street, postalCode, city,country})
           
            return FormateData({id:addressResult,message:"address added"});
            
        } catch (err) {
            throw err
        }

    }

}   

module.exports = CustomerService;