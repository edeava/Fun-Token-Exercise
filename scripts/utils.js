const { Web3 } = require("web3");
const {_NODE_ADDRESS, _KEYS, _TOKENS, _SWEEPER} = require("./config");
const { deploy, getContract, performTransaction } = require("./deploy");

var web3 = null

function initWeb3(){
    masterKey = _KEYS[0];
    childrenKeys = _KEYS.splice(1 - _KEYS.length);
    web3 = new Web3(_NODE_ADDRESS);
    masterAccount = web3.eth.accounts.privateKeyToAccount(masterKey);
    web3.eth.wallet.add(masterAccount);
}

function sleep(s) {
    if (s > 0) {
        console.log(`Waiting for ${s} seconds`);
        return new Promise(resolve => setTimeout(resolve, s*1000));
    }
}

async function distributeETH(amount){
    value = web3.utils.toWei(amount, "ether");
    
    for(k in childrenKeys){
        childAccount = web3.eth.accounts.privateKeyToAccount(childrenKeys[k]);

        await web3.eth.sendTransaction({
            from: masterAccount.address,
            to: childAccount.address,
            value: value
        });
    }

}

async function distributeTokens(amount){
    tokenAmount = web3.utils.toWei(amount, "ether");
    
    for(k in childrenKeys){
        childAccount = web3.eth.accounts.privateKeyToAccount(childrenKeys[k]);
        for(t in _TOKENS){
            tokenContract = await getContract(web3, "Token", _TOKENS[t]);
            await performTransaction(web3, tokenContract, "transfer", [childAccount.address, tokenAmount], masterAccount.address, masterAccount.privateKey);
        }

    }

    console.log("Tokens distributed to children!")
}

async function deploySweeperContract(){
    contract = await deploy(web3, masterAccount, "Sweeper", []);
}

async function deployTokens(symbol1, symbol2){
    totalSupply = web3.utils.toWei(1000000, "ether");
    
    token1 = await deploy(web3, masterAccount, "Token", [totalSupply, masterAccount.address, symbol1, symbol1]);
    await sleep(5);
    token2 = await deploy(web3, masterAccount, "Token", [totalSupply, masterAccount.address, symbol2, symbol2]);
}

async function sweep(){
    sweeperContract = await getContract(web3, "Sweeper", _SWEEPER);

    for(k in childrenKeys){
        childAccount = web3.eth.accounts.privateKeyToAccount(childrenKeys[k]);
        tokenAmounts = []
        for(t in _TOKENS){
            tokenContract = await getContract(web3, "Token", _TOKENS[t]);
            amount = await tokenContract.methods.balanceOf(childAccount.address).call();
            tokenAmounts.push(amount);
            await performTransaction(web3, tokenContract, "approve", [_SWEEPER, amount], childAccount.address, childAccount.privateKey)
        }
        await performTransaction(web3, sweeperContract, "execSweep", [masterAccount.address, _TOKENS, tokenAmounts], childAccount.address, childAccount.privateKey, true);
    }

    console.log("SWEEPED all of the funds!!!")
}

module.exports = { initWeb3, distributeETH, distributeTokens, sweep };