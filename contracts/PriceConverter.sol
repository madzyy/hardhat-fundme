//SPDX-License-Identifier: UNLICENCED

pragma solidity 0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter{
      function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256){
        //since we are interacting with another smart contract we need:
        // --> ABI and Address of the contract

        //change to the correct address of the chainlink price feeds for ETHUSD
        (,int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns(uint256){
        uint256 ethPriceInUsd = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPriceInUsd * ethAmount) / 1e18;
        return ethAmountInUsd;

        
    }
}