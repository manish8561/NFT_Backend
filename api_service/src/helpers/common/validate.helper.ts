import Validator from "validator";

class Validate {

    constructor() { }

     /**
    * @function _validations
    * @param obj 
    * @returns 
    */
      public async _validations(obj: any): Promise<any> {
        let _errors: any = {};

        for (const key in obj) {
            if (key === "networkId") obj[key] = String(obj[key]);

            if (((obj[key]) && (obj[key] !== undefined))) {
                if (Validator.isEmpty(obj[key], { ignore_whitespace: false })) {
                    _errors[key ] = `${key} is required.`;
                }
            }

            if ((obj[key] == "")) {
                _errors[key] = `${key} is required.`;
            }

            if ((obj[key] === undefined) || (obj[key] === null)) {
                _errors[key] = `${key} is required.`;
            }

            if (key === "walletAddress" && obj[key] !== undefined) {
                if (!Validator.isEthereumAddress(obj[key])) {
                    _errors[key] = `Enter a valid ${key}.`;
                }
            }

            if (key === "_id") {
                if (!Validator.isMongoId(obj[key])) {
                    _errors[key] = `Enter a valid ${key}.`;
                }
            }

            if ((key === "email") && (obj[key] !== undefined)) {
                if (!Validator.isEmail(obj[key])) {
                    _errors[key] = `Enter a valid ${key}.`;
                }
            }

            if((key === "startDate") && (obj[key] !== undefined)) {
                if(!Validator.isDate(obj[key])) {
                    _errors[key] = `Enter a valid ${key}.`;
                }
            }

            if((key === "endDate") && (obj[key] !== undefined)) {
                if(!Validator.isDate(obj[key])) {
                    _errors[key] = `Enter a valid ${key}.`;
                }
            }
        }
        
        return _errors;
    }

}

export default new Validate();