import Web3 from "web3";

class Web3Helper {
    private INFURA_API = process.env.INFURA_API!;
    private web3Object: any;
    private contractObject: any;
    private currentContractAddress: string = '';

    constructor() {
        this.INFURA_API = process.env.INFURA_API!;
        this.web3Object = this.getWeb3Object();
    }
    /**
     * create web3Object
     * @returns Web3
     */
    public async getWeb3Object(): Promise<Web3> {
        if (this.web3Object) {
            return this.web3Object;
        }
        try {
            this.web3Object = new Web3('https://rinkeby.infura.io/v3/c2a613915ac3440fa2cd778ff5ade299');
            return this.web3Object;
        } catch (error: any) {
            return error;
        }
    }
    /**
     * get contract object
     * @param  {string} contractAddress
     * @param  {any} contractABI
     * @returns Contract
     */
    public async getContractObject(contractAddress: string, contractABI: any): Promise<any> {
        if (this.contractObject && this.currentContractAddress && this.currentContractAddress.toLowerCase() === contractAddress.toLowerCase()) {
            return this.contractObject;
        }
        const web3Object = await this.getWeb3Object();
        this.contractObject = new web3Object.eth.Contract(contractABI, contractAddress);
        return this.contractObject;
    }
    /**
     * get token Contract
     * @param  {string} tokenAddress
     * @returns Promise
     */
    // public async getTrokenContractObject(tokenAddress: string): Promise<any> {
    //     if (this.contractObject && this.tokenAddress && this.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()) {
    //         return this.contractObject;
    //     }

    //     this.contractObject = new this.web3Object.eth.Contract(MAIN_CONTRACT_LIST.token.abi, tokenAddress);
    // }

    public async getTransactionStatus(txHash: string): Promise<any> {
     try {
        const web3Object = await this.getWeb3Object();
        const res = await web3Object.eth.getTransactionReceipt(txHash);
        return res;
     } catch (error) {
         console.log(error);
         throw error;
     }
    }
}
export default new Web3Helper();