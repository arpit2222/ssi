// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./OwnableLite.sol";

contract BasketRegistry is OwnableLite {
    struct Basket {
        address creator;
        string metadataURI;
        bytes32 compositionHash;
        uint16 managementFeeBps;
        uint16 performanceFeeBps;
        uint64 createdAt;
        uint64 updatedAt;
        uint32 followers;
        bool active;
    }

    uint256 public nextBasketId = 1;
    mapping(uint256 => Basket) public baskets;
    mapping(address => uint256[]) private creatorBaskets;
    mapping(address => bool) public operators;

    event BasketCreated(uint256 indexed basketId, address indexed creator, string metadataURI, bytes32 compositionHash);
    event BasketUpdated(uint256 indexed basketId, string metadataURI, bytes32 compositionHash, bool active);
    event FollowerCountUpdated(uint256 indexed basketId, uint32 followers);
    event OperatorUpdated(address indexed operator, bool enabled);

    modifier onlyCreatorOrOperator(uint256 basketId) {
        require(baskets[basketId].creator == msg.sender || operators[msg.sender], "NOT_AUTHORIZED");
        _;
    }

    function setOperator(address operator, bool enabled) external onlyOwner {
        operators[operator] = enabled;
        emit OperatorUpdated(operator, enabled);
    }

    function createBasket(
        string calldata metadataURI,
        bytes32 compositionHash,
        uint16 managementFeeBps,
        uint16 performanceFeeBps
    ) external returns (uint256 basketId) {
        require(bytes(metadataURI).length > 0, "EMPTY_METADATA");
        require(managementFeeBps <= 1_000, "MGMT_FEE_TOO_HIGH");
        require(performanceFeeBps <= 5_000, "PERF_FEE_TOO_HIGH");

        basketId = nextBasketId++;
        baskets[basketId] = Basket({
            creator: msg.sender,
            metadataURI: metadataURI,
            compositionHash: compositionHash,
            managementFeeBps: managementFeeBps,
            performanceFeeBps: performanceFeeBps,
            createdAt: uint64(block.timestamp),
            updatedAt: uint64(block.timestamp),
            followers: 0,
            active: true
        });
        creatorBaskets[msg.sender].push(basketId);
        emit BasketCreated(basketId, msg.sender, metadataURI, compositionHash);
    }

    function updateBasket(uint256 basketId, string calldata metadataURI, bytes32 compositionHash, bool active)
        external
        onlyCreatorOrOperator(basketId)
    {
        Basket storage basket = baskets[basketId];
        require(basket.creator != address(0), "UNKNOWN_BASKET");
        basket.metadataURI = metadataURI;
        basket.compositionHash = compositionHash;
        basket.active = active;
        basket.updatedAt = uint64(block.timestamp);
        emit BasketUpdated(basketId, metadataURI, compositionHash, active);
    }

    function setFollowers(uint256 basketId, uint32 followers) external {
        Basket storage basket = baskets[basketId];
        require(basket.creator != address(0), "UNKNOWN_BASKET");
        require(msg.sender == basket.creator || operators[msg.sender], "NOT_AUTHORIZED");
        basket.followers = followers;
        emit FollowerCountUpdated(basketId, followers);
    }

    function getCreatorBaskets(address creator) external view returns (uint256[] memory) {
        return creatorBaskets[creator];
    }
}
