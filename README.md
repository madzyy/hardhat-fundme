# Hardhat Fund Me

This is the backend of the hardhat project from Patrick Collins Web3 javascript course.

You can first run
```shell
npx hardhat compile
```
to compile the contracts in the 'contracts' folder of the project and get the artifacts, cache and all the others.

Mocks were used for the price feeds of the local network and you can deploy the mocks by typing
```shell
npx hardhat deploy --tags mocks
```

You can deploy to the local network just by typing
```shell
npx hardhat deploy --tags --all
```
or just

```shell
npx hardhat deploy
```

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
