import LogsSchema from "./logs.schema";
import Web3 from "web3";
const marketPlace = require("../../bin/ABI/marketplace.abi.json");

class Logs {
  public web3: Web3 | any;
  public mainContractOb: any;
  public tokenContractOb: any;
  public infura: any;
  public blockNumber: any;
  public contractAddress: any;
  public contractAddressToken: any;
  public defaultAddress: any;
  
  private eventsArr: any[] = [
    "MintTokens"
  ]

  constructor() { }

  public connectWeb3() {
    this.infura = process.env.INFURA_API!;
    this.blockNumber = process.env.BLOCK_NUMBER!;
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.contractAddressToken = process.env.TOKEN_CONTRACT_ADDRESS;
    this.defaultAddress = process.env.DEFAULT_ADDRESS!;
    
    this.web3 = new Web3(this.infura);
    this.mainContractOb = new this.web3.eth.Contract(marketPlace, this.contractAddress);
  }

  // recurresive call function
  public async getCronLogs(eventName: string, blockNumber: string): Promise<any> {
    try {
      const event = await this.mainContractOb.getPastEvents(eventName, {
        fromBlock: blockNumber,
      });
      console.log("Event.length=========", eventName, event.length );
      if (event.length > 0) {
        // let registers: any[] = [], subscribed: any[] = [], defferentialBonus: any[] = [], earlyBirds: any[] = [], leaderShips: any[] = [], levelBonusSent: any = [], userWithdrawed: any[] = [], rewardsAdded: any[] = [], points: any[] = [], scholarshipFund: any[] = [];
     
        let r = await event.map(async (d: any) => {
          let objData: any = {};
          const returnValues: any = d.returnValues;
          objData.event = eventName;
          objData.blockNumber = d.blockNumber;
          objData.transactionHash = d.transactionHash;

          switch(eventName) {

            case "MintTokens":
              objData.user = returnValues.user;
              objData.tokenId = returnValues.tokenId;
              objData.tokenAmount = returnValues.tokenAmount;
              objData.tokenUri = returnValues.tokenUri;
              objData.timestamp = returnValues.timeStamp; 
              break;

          }

          return objData;
        });

        r = await Promise.all(r);
        return r;
      }  
    } catch (error) {
      console.log(error);
    }
  }

 
  private async addData(d: string, data: any): Promise<any> {
      return await LogsSchema[d].insertMany(data);
  }

  private async getData(d: string): Promise<any> {
      return LogsSchema[d].findOne().sort({ blockNumber: -1 });
  }

  private async callingDelete(d: string) {
    let query: any = [];
    switch (d) {

      case "MintTokens":
        query = [
          {
            $group: {
              _id: "$transactionHash",
              dups: { $addToSet: "$_id" },
              count: { $sum: 1 },
            },
          },
          { $match: { count: { $gt: 1 } } },
        ];
        break;

    }

    if (query.length > 0) {
      LogsSchema[d]
        .aggregate(query)
        .then((result: any) => {
          if (result.length > 0) {
            result.forEach(async (doc: any) => {
              doc.dups.shift();
              await LogsSchema[d].deleteMany({ _id: { $in: doc.dups } });
            });
          }
        })
        .catch(console.log);
    }
  }

 
  public async addNewUserLogRedis() {
    try {
      console.log("\n \n --run log direct from the app-- \n \n");
      this.eventsArr.map(async (d) => {
        // return;
        const logs: any = await this.getData(d);
        const blockNumber = (logs && Object.keys(logs).length > 0) ? logs.blockNumber : parseInt(this.blockNumber);

        let event = await this.getCronLogs(d, blockNumber);
        if (logs && logs.length > 0) {
          event.slice(1);
        } 

        if (event && event.length > 0) {
          await this.addData(d, event);
          await this.callingDelete(d);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Logs();
