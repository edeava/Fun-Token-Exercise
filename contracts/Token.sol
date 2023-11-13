// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract Token is ERC20Capped {

    constructor(uint totalSupply, address assetManager, string memory name, string memory symbol) ERC20(name, symbol) ERC20Capped(totalSupply) {
        _mint(assetManager, totalSupply);
    }

}