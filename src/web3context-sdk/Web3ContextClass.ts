/* eslint-disable */
import Web3 from "web3";
import axios from "axios";
import Big from "big.js";

import { Cache } from ".";

var myEpicGameAbi = require("." + "/abi/MyEpicGame.json");

class Web3ContextClass {
  // ** ------------------------------ **
  // ** TYPE YOUR STATE VARIABLES HERE **
  // ** ------------------------------ **

  // ** Types **
  web3: Web3;
  cache: Cache;
  getEthUsdPriceBN: () => Big;
  someAsyncFunction: () => Promise<any>;
  checkIfUserHasNFT: () => Promise<boolean>;

  // ** Class Statics **
  static Web3 = Web3;

  // ?? web3 utils should have BN ??
  // @ts-ignore
  static BN = Web3.utils.BN;

  // ** Constructor **
  constructor(web3Provider) {
    // ** -------------------------------- **
    // ** DEFINE YOUR STATE VARIABLES HERE **
    // ** -------------------------------- **

    this.web3 = new Web3(web3Provider);
    this.cache = new Cache({ allTokens: 86400, ethUsdPrice: 300 });

    var self = this;

    this.MyEpicGameContractAddress = "0x6f1008a1546400BBF825f320cb7587C2E3F1e221";
    this.MyEpicGame = new this.web3.eth.Contract(
      myEpicGameAbi.abi,
      this.MyEpicGameContractAddress
    );

    console.log("using deployed contract address:", this.MyEpicGameContractAddress)

    this.checkIfUserHasNFT = async function () {
      console.log("Default account:", this.web3.defaultAccount)
      console.log("calling method...");
      let txn = await this.MyEpicGame.methods.checkIfUserHasNFT().call();
      console.log(txn)
      if(txn.name) {
        console.log("User has character NFT");
        return {
          name: txn.name,
          imageURI: txn.imageURI,
          hp: txn.hp.toNumber(),
          maxHp: txn.maxHp.toNumber(),
          attackDamage: txn.attackDamage.toNumber(),
        };
      }
    }


    // ** --------------------- **
    // ** DEFINE FUNCTIONS HERE **
    // ** (functions are vars)  **
    // ** --------------------- **

    this.getEthUsdPriceBN = async function () {
      return await self.cache.getOrUpdate("ethUsdPrice", async function () {
        try {
          return Web3.utils.toBN(
            new Big(
              (
                await axios.get(
                  "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum"
                )
              ).data.ethereum.usd
            )
              .mul(1e18)
              .toFixed(0)
          );
        } catch (error) {
          throw new Error("Error retrieving data from Coingecko API: " + error);
        }
      });
    };

    this.someAsyncFunction = async function (cacheTimeout = 86400) {
      // ** example async function definition
    };
  }
}

export default Web3ContextClass;
