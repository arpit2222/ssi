// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./OwnableLite.sol";

interface IRegistryForRebalance {
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

contract RebalanceEngine is OwnableLite {
    IRegistryForRebalance public immutable registry;
    mapping(address => bool) public operators;
    mapping(uint256 => bytes32) public latestTargetHash;
    mapping(uint256 => uint256) public rebalanceCount;

    event OperatorUpdated(address indexed operator, bool enabled);
    event RebalanceStarted(uint256 indexed basketId, address indexed executor, bytes32 targetHash);
    event RebalanceCompleted(uint256 indexed basketId, address indexed executor, bytes32 executionHash, uint256 feeAmount);
    event RebalanceFailed(uint256 indexed basketId, address indexed executor, string reason);

    constructor(address registry_) {
        require(registry_ != address(0), "ZERO_REGISTRY");
        registry = IRegistryForRebalance(registry_);
    }

    modifier onlyCreatorOrOperator(uint256 basketId) {
        (address creator, , , , , , , , ) = registry.baskets(basketId);
        require(msg.sender == creator || operators[msg.sender] || msg.sender == owner, "NOT_AUTHORIZED");
        _;
    }

    function setOperator(address operator, bool enabled) external onlyOwner {
        operators[operator] = enabled;
        emit OperatorUpdated(operator, enabled);
    }

    function startRebalance(uint256 basketId, bytes32 targetHash) external onlyCreatorOrOperator(basketId) {
        (, , , , , , , , bool active) = registry.baskets(basketId);
        require(active, "BASKET_INACTIVE");
        latestTargetHash[basketId] = targetHash;
        emit RebalanceStarted(basketId, msg.sender, targetHash);
    }

    function completeRebalance(uint256 basketId, bytes32 executionHash, uint256 feeAmount)
        external
        onlyCreatorOrOperator(basketId)
    {
        rebalanceCount[basketId] += 1;
        emit RebalanceCompleted(basketId, msg.sender, executionHash, feeAmount);
    }

    function failRebalance(uint256 basketId, string calldata reason) external onlyCreatorOrOperator(basketId) {
        emit RebalanceFailed(basketId, msg.sender, reason);
    }
}
