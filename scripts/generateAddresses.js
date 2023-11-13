const { Web3 } = require("web3");
const {_NODE_ADDRESS} = require("./config")

const web3 = new Web3(_NODE_ADDRESS)

async function generate(numOfAddresses){
    for (let i = 0; i < numOfAddresses; i++) {
        const addr = web3.eth.accounts.create();
        console.log(addr)
    }
}

generate(5)

// Used to generate addresses for the exercise