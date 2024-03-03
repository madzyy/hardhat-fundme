const { network } = require("hardhat")
const { namedAccounts } = require("../hardhat.config")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({getNamedAccounts, deployments}) => {
    // const {getNamedAccounts, deployments} =hre
    const {deploy, log } = deployments
    const {deployer} = await getNamedAccounts()
    // const chainId = network.config.chainId
    const chainId = network.config.chainId

    // for local testing pricefeeds we use mocks

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address

    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
     
    // deploying
    const args = [ethUsdPriceFeedAddress] 
    log("deploying fund me")
    const fundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        args: args,
        logs: true,
        // waitConfirmations: network.config.blockConfirmations
    })
    log(`deployed to ${ (await deployments.get('FundMe')).address}`)

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, args)
    }
    log("--------------------------------------------------------------")
} 

module.exports.tags = ["all", "fundme"]