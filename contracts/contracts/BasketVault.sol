// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./OwnableLite.sol";
import "./IERC20.sol";

interface IRegistryForVault {
    function baskets(uint256 basketId)
        external
        view
        returns (
            address creator,
            string memory metadataURI,
            bytes32 compositionHash,
            uint16 managementFeeBps,
            uint16 performanceFeeBps,
            uint64 createdAt,
            uint64 updatedAt,
            uint32 followers,
            bool active
        );
}

contract BasketVault is OwnableLite {
    IERC20 public immutable asset;
    IRegistryForVault public immutable registry;
    mapping(uint256 => uint256) public totalShares;
    mapping(uint256 => uint256) public totalAssets;
    mapping(uint256 => mapping(address => uint256)) public sharesOf;

    event Deposit(uint256 indexed basketId, address indexed investor, uint256 assets, uint256 shares);
    event Withdraw(uint256 indexed basketId, address indexed investor, uint256 assets, uint256 shares);

    constructor(address asset_, address registry_) {
        require(asset_ != address(0) && registry_ != address(0), "ZERO_ADDRESS");
        asset = IERC20(asset_);
        registry = IRegistryForVault(registry_);
    }

    function deposit(uint256 basketId, uint256 amount) external returns (uint256 shares) {
        require(amount > 0, "ZERO_AMOUNT");
        (, , , , , , , , bool active) = registry.baskets(basketId);
        require(active, "BASKET_INACTIVE");

        uint256 supply = totalShares[basketId];
        uint256 assetsBefore = totalAssets[basketId];
        shares = supply == 0 || assetsBefore == 0 ? amount : (amount * supply) / assetsBefore;
        require(shares > 0, "ZERO_SHARES");
        require(asset.transferFrom(msg.sender, address(this), amount), "TRANSFER_FAILED");

        sharesOf[basketId][msg.sender] += shares;
        totalShares[basketId] = supply + shares;
        totalAssets[basketId] = assetsBefore + amount;
        emit Deposit(basketId, msg.sender, amount, shares);
    }

    function withdraw(uint256 basketId, uint256 shares) external returns (uint256 amount) {
        require(shares > 0, "ZERO_SHARES");
        uint256 userShares = sharesOf[basketId][msg.sender];
        require(userShares >= shares, "INSUFFICIENT_SHARES");

        amount = (shares * totalAssets[basketId]) / totalShares[basketId];
        sharesOf[basketId][msg.sender] = userShares - shares;
        totalShares[basketId] -= shares;
        totalAssets[basketId] -= amount;
        require(asset.transfer(msg.sender, amount), "TRANSFER_FAILED");
        emit Withdraw(basketId, msg.sender, amount, shares);
    }

    function recordPnL(uint256 basketId, int256 delta) external onlyOwner {
        if (delta >= 0) {
            totalAssets[basketId] += uint256(delta);
        } else {
            totalAssets[basketId] -= uint256(-delta);
        }
    }
}
