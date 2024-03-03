// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error FundMe__NotOwner();


/**
 * @title A contract for crowd funding
 * @author Tapiwa Madzanise
 * @notice Just for learnig purpose
 * @dev implements ETH price feeds as prices on main and test net and MockV3Aggregator.sol for local network
 */
contract FundMe{
    // Type Declarations
    using PriceConverter for uint256;

    // state variables
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    address public immutable i_owner;
    AggregatorV3Interface public priceFeed;


    // events and modifiers
    modifier onlyOwner{
        // require(msg.sender == i_owner, "sender is not the owner");
        
        // _;

        if(msg.sender != i_owner){
            revert FundMe__NotOwner();
        }

        _;

        // the _; tells the code to run last since its below
    }

    // constructor
    constructor(address priceFeedAddress){ 
        priceFeed = AggregatorV3Interface(priceFeedAddress);
        i_owner = msg.sender;
        
    }

    // receive and fallback
    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }


    /**
     * @notice This function funds this contract
     * @dev This function accepts etherium which must be greater than a certain usd price and checks the price using etherium price feeds or mocks for a local network then adds the funder's address to the funders array and then to the funders mapping to know how much etherium they sent
     */
    function fund() public payable{
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "Didn't send enough");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;

    }

    function withdraw() public onlyOwner{
        
        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        //reset the array to 0 objects
        funders = new address[](0);

        //actually withdrawing
        // you can use transfer method
        // payable(msg.sender).transfer(address(this).balance);

        // // you can use the send method which returns a bool if an error occurs
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "sending failed");}

        //you can use call which returns a boolean and a bytes object for data returned
        (bool success, ) = payable(i_owner).call{value: address(this).balance}("");
        require(success);
    }
    
    


    // if someone sends ETH without calling the fund function
    
}
































