// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./OwnableLite.sol";
import "./IERC20.sol";

contract FeeDistribution is OwnableLite {
    IERC20 public immutable asset;
    address public platformWallet;
    uint16 public platformFeeBps = 2_000;

    mapping(address => uint256) public creatorAccrued;
    uint256 public platformAccrued;

    event PlatformWalletUpdated(address indexed platformWallet);
    event PlatformFeeUpdated(uint16 platformFeeBps);
    event FeeCollected(uint256 indexed basketId, address indexed creator, uint256 creatorAmount, uint256 platformAmount);
    event FeeReleased(address indexed recipient, uint256 amount);

    constructor(address asset_, address platformWallet_) {
        require(asset_ != address(0) && platformWallet_ != address(0), "ZERO_ADDRESS");
        asset = IERC20(asset_);
        platformWallet = platformWallet_;
    }

    function setPlatformWallet(address platformWallet_) external onlyOwner {
        require(platformWallet_ != address(0), "ZERO_ADDRESS");
        platformWallet = platformWallet_;
        emit PlatformWalletUpdated(platformWallet_);
    }

    function setPlatformFeeBps(uint16 platformFeeBps_) external onlyOwner {
        require(platformFeeBps_ <= 5_000, "FEE_TOO_HIGH");
        platformFeeBps = platformFeeBps_;
        emit PlatformFeeUpdated(platformFeeBps_);
    }

    function collectFee(uint256 basketId, address creator, uint256 amount) external {
        require(creator != address(0), "ZERO_CREATOR");
        require(amount > 0, "ZERO_AMOUNT");
        require(asset.transferFrom(msg.sender, address(this), amount), "TRANSFER_FAILED");

        uint256 platformAmount = (amount * platformFeeBps) / 10_000;
        uint256 creatorAmount = amount - platformAmount;
        creatorAccrued[creator] += creatorAmount;
        platformAccrued += platformAmount;
        emit FeeCollected(basketId, creator, creatorAmount, platformAmount);
    }

    function releaseCreatorFees() external {
        uint256 amount = creatorAccrued[msg.sender];
        require(amount > 0, "NO_FEES");
        creatorAccrued[msg.sender] = 0;
        require(asset.transfer(msg.sender, amount), "TRANSFER_FAILED");
        emit FeeReleased(msg.sender, amount);
    }

    function releasePlatformFees() external {
        require(msg.sender == platformWallet || msg.sender == owner, "NOT_AUTHORIZED");
        uint256 amount = platformAccrued;
        require(amount > 0, "NO_FEES");
        platformAccrued = 0;
        require(asset.transfer(platformWallet, amount), "TRANSFER_FAILED");
        emit FeeReleased(platformWallet, amount);
    }
}
