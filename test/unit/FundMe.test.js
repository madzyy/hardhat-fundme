const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, provider, transactionResponse} = require("hardhat")

describe("FundMe", () => {
    let fundMe                                         
    let deployer
    let mockV3Aggregator
    // const provider = getDefaultProvider("http://127.0.0.1:8545/")
    
    const sendValue = ethers.parseEther("1")
    beforeEach(async () => {
        // const {deployer} = await getNamedAccounts()
        deployerr = (await getNamedAccounts()).deployer
        deployer = await ethers.provider.getSigner()


        await deployments.fixture(["all"])
        fundMe = await ethers.getContractAt("FundMe", (await deployments.get("FundMe")).address, deployer)
        mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", (await deployments.get("MockV3Aggregator")).address, deployer)
    })

    describe("constructor", () => {
        it("sets the aggregator prices correctly", async () =>{
            const response = await fundMe.priceFeed()
            assert.equal(response, await mockV3Aggregator.getAddress())
        })
    })

    describe("fund", async () => {
        it("fails when you don't send enough eth", async () =>{
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough"
            )
        })

        it("updates the amount funded data structure", async () => {
            await fundMe.fund({value: sendValue})
            const response= await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("adds funder to array of funders", async () => {
            await fundMe.fund({value: sendValue})
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployerr)
        })
    })

    describe("withdraw", async () =>{
        beforeEach(async () => {
            await fundMe.fund({value: sendValue})
        })

        it("Withdraw ETH from a single funder", async () => {
            const startingFundMeBalance = await ethers.provider.getBalance(fundMe)
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            // const receipt = await ethers.transactionReceipt.getTransaction()
            // const {gasUsed} = transactionReceipt
            const {gasUsed, gasPrice} = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(fundMe)

            const endingDeployerBalance = await ethers.provider.getBalance(deployer)


            assert.equal(endingFundMeBalance, 0)
            assert.equal((startingFundMeBalance+startingDeployerBalance).toString(), (endingDeployerBalance+gasCost).toString())
        })

        it("allows us to withdraw with multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for(let i=1; 1<6; i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
            
                await fundMeConnectedContract.fund({value: sendValue})
            }
            const startingFundMeBalance = await ethers.provider.getBalance(fundMe)
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            // const receipt = await ethers.transactionReceipt.getTransaction()
            // const {gasUsed} = transactionReceipt
            const {gasUsed, gasPrice} = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(fundMe)

            const endingDeployerBalance = await ethers.provider.getBalance(deployer)


            assert.equal(endingFundMeBalance, 0)
            assert.equal((startingFundMeBalance+startingDeployerBalance).toString(), (endingDeployerBalance+gasCost).toString())
            await expect(fundMe.funders(0)).to.be.reverted

            for (i=1; i<6; i++){
                assert.equal(await fundMe.addressToAmountFunded(accounts[i].address), 0)
            }
    })
    })

})
