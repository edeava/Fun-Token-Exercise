const { Web3 } = require("web3");
const {distributeETH, distributeTokens, sweep, initWeb3} = require("./utils")

async function excercise(){
    
    initWeb3();

    await distributeETH(0.2);
    
    await distributeTokens(1000);
    
    await sweep();
}

excercise()