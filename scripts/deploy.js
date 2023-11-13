const fs = require("fs");
const path = require("path");
const { Web3 } = require("web3");
const { utils } = require("ethers");
const {_NODE_ADDRESS} = require("./config");
const { BN } = require("bn.js");

function getContract(web3, contractName, contractAddress) {
    const contractPath = `./bin/contracts/${contractName}.json`;
    const contractJSON = JSON.parse(fs.readFileSync(contractPath, "utf-8"));
    const contractAbi = contractJSON["abi"];
    return new web3.eth.Contract(contractAbi, contractAddress);
}

async function makeTransactionObject(web3, from, to, stateChangeData, amount = 0, sendMaxValue = false, gasEstimate) {
    maxFeePerGas = new BN(await web3.eth.getGasPrice());
    priorityPercentage = new BN(5)

    if(sendMaxValue){
        ethBalance = new BN(await web3.eth.getBalance(from))
        amount = ethBalance.sub(maxFeePerGas.add(maxFeePerGas.div(priorityPercentage).mul(new BN(gasEstimate))))
    }

    return {
        from: from,
        to: to,
        maxPriorityFeePerGas: maxFeePerGas.div(priorityPercentage).toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        data: stateChangeData,
        value: amount.toString(),
    };
}

async function sendTransaction(web3, txObject, privateKey) {
    try {
        const signed = await web3.eth.accounts.signTransaction(txObject, privateKey);
        let tx = await web3.eth.sendSignedTransaction(signed.rawTransaction);
        return tx.transactionHash;
    } catch(err) {
        console.log(err);
    }
}

async function performTransaction(web3, contract, functionName, args, fromAddress, privateKey, sendMaxValue = false) {
    const stateChange = contract.methods[functionName](...args);
    const gasEstimate = await stateChange.estimateGas({from: fromAddress})
    const data = stateChange.encodeABI();
    const txObject = await makeTransactionObject(web3, fromAddress, contract._address, data, 0, sendMaxValue, gasEstimate);
    
    const txHash = await sendTransaction(web3, txObject, privateKey);
    console.log(`performing ${functionName} ${txHash} `);
    
    return txHash;
}

const deploy = async (web3, account, contractName, contractArgs) => {
    const path = "./bin/contracts/" + contractName + ".json";
    const contractJSON = JSON.parse(fs.readFileSync(path, "utf8"));
    const bytecode = contractJSON["bytecode"];
    const abi = contractJSON["abi"];

    const contract = new web3.eth.Contract(abi);
    const options = {
        data: bytecode, arguments: contractArgs
    };
    const transaction = contract.deploy(options);
    
    transaction.send({
        from: account.address,
        gas: await transaction.estimateGas()
    })
    .on('error', function(error){ console.error(error) })
    .on('receipt', function(receipt){
        console.log(receipt.contractAddress) //new contract address
    })
};

module.exports = { deploy, getContract, performTransaction };