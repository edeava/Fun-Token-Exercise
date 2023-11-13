pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Sweeper {

    constructor(){}

    function sweepTokens(address recipient, address[] calldata tokens, uint[] calldata amounts) internal {

        uint tokensLenght = tokens.length;
        for(uint i; i < tokensLenght; i++){
            ERC20 token = ERC20(tokens[i]);
            token.transferFrom(msg.sender, address(this), amounts[i]);
            token.transfer(recipient, amounts[i]);
        }
    }

    function sweepETH(address payable recipient) internal {
        recipient.transfer(msg.value);
    }

    function execSweep(address payable recipient, address[] calldata tokens, uint[] calldata amounts) payable external {
        require(tokens.length == amounts.length, "Token and Amount arrays must be the same size!!");
        sweepTokens(recipient, tokens, amounts);

        sweepETH(recipient);
    }
    
}