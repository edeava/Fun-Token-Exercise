# Fun-Token-Exercise

## Full stack Blockchain engineer technical assessment

### Introduction
Using a language of your choice provide a solution to the following problem which will be
discussed as part of the technical follow up interview.

### Exercise
Given a list of deposit addresses and a list of erc20 token addresses sweep all native and erc20
tokens in the list from the deposit addresses to a single address.
Extra bonus points for optimizing gas fees whilst mitigating risk.
Assume the following:
- All addresses in the list are derived from a master keypair (BIP32).
- Code has access to the master keypair.

### Deliverable:
- Push your solution to a private git repository and grant access to us when you’re happy
with it.
- Include a README.md listing prerequisites and simple instructions on how to build and
run the application.
- Feel free to include further documentation if you have time and feel it necessary (but this
is not a requirement).

### Tips:
- This is a fairly open assignment in terms of how you structure the solution. You will be
judged on the overall quality of the code, particularly in terms of:
- Clean, succinct, self-documenting code
- Package and class structure
- Adherence to OOP best practices and patterns
- Keep your solution simple.
- Feel free to use external libraries where needed
- Use libraries and frameworks that you are familiar with - it is not recommended that you
use this exercise as an opportunity to try out some new technology you've never used
before.

# Runinng the code

## Prerequisites
```
- Node.js
- npm
```

### Steps to reproduce
```
- npm install
- node ./scripts/sweeper.js
```

### Rationale
Considering BIP32 master keys cannot sign for child addresses, the problem is equivalent to addresses willingly sweeping their funds to master address.
Gas optimisation is done in terms of batching transactions per address through Sweeper.sol smart contract. 
More gas optimisation can be done, but it is not significant compared to simple batching. 
Sweeper.sol recieves list of tokens, their amounts, and native token amount through tx value which is all then sent to master address (recipient). 
The amounts of tokens and native coin are specified off chain as those calculations are redundant to be on chain and cost money. 
Token.sol is a simple example ERC20 token.

### Files
- config.js

>Simple config file, contains node address, private keys for master and child addresses, token addresses and sweeper contract address.


- deploy.js

>Contains helper functions for contract deployments and transaction executions.


- utils.js

>Contains functions for sweeper and token contract deployments, distribution functions for ETH and Tokens in order to setup the sweeping exercise. 
>Also contains sweep() function which does the sweeping process using child addresses. 
>In sweep() function, the token amounts are taken as a balanceOf() child address and native coin amount by taking the closest value to the maximum amount which ensures the completion >of a execSweep() smart contract method in terms of gas allowance.


- sweeper.js

>Simple file with the flow through the excercise which ensures multiple re-runs of it.
