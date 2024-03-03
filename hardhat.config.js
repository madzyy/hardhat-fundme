require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.19",
  solidity:{
    compilers:[
      {version: "0.6.6"},
      {version: "0.8.19"}
    ]
  },
  defaultNetwork: "hardhat",
  networks:{
    // hardhat:{
    //   chainId: 31337
    // },
    // rinkeby:{
    //   url: "",
    //   accounts:[],
    //   chainId: 42,
    //   blockconfirmations: 6
    // },
    hardhat:{
      chainId: 31337
    }
  },
  namedAccounts:{
    deployer:{
      default: 0
    }
  }
};
