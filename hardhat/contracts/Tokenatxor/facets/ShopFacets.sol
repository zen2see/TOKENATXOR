// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Modifiers, AppStorage, ItemType, Production} from "../libraries/LibAppStorage.sol";
import {LibTokenatxor} from "../libraries/LibTokenatxor.sol";
import {IERC20} from "../../shared/interfaces/IERC20.sol";
import {LibERC721} from "../../shared/libraries/LibERC721.sol";
import {LibERC1155} from "../../shared/libraries/LibERC1155.sol";
import {LibItems} from "../libraries/LibItems.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {LibERC1155Marketplace} from "../libraries/LibERC1155Marketplace.sol";

contract ShopFacet is Modifiers {
    event MintProductions(
        address indexed _from,
        address indexed _to,
        // uint256 indexed _batchId,
        uint256 _tokenId,
        uint256 _numTokenatxorsToPurchase,
        uint256 _productionId
    );

    event BuyProductions(
        address indexed _from,
        address indexed _to,
        // uint256 indexed _batchId,
        uint256 _tokenId,
        uint256 _numProductionsToPurchase,
        uint256 _totalPrice
    );

    event PurchaseItemsWithTktr(address indexed _buyer, address indexed _to, uint256[] _itemIds, uint256[] _quantities, uint256 _totalPrice);
    event PurchaseTransferItemsWithTktr(address indexed _buyer, address indexed _to, uint256[] _itemIds, uint256[] _quantities, uint256 _totalPrice);

    event PurchaseItemsWithVouchers(address indexed _buyer, address indexed _to, uint256[] _itemIds, uint256[] _quantities);

    /// @notice Allow an address to purchase a production
    /// @dev Only productions from produce 1 can be purchased via the contract
    /// @param _to Address to send the production once purchased
    /// @param _tktr The amount of TKTR the buyer is willing to pay //calculation will be done to know how much production he recieves based on the produce's production price
    function buyPortals(address _to, uint256 _tktr) external {
        uint256 currentProductionId = s.currentProductionId;
        require(currentProductionId == 1, "ShopFacet: Can only purchase from Produce 1");
        Production storage production = s.productions[currentProductionId];
        uint256 price = production.productionPrice;
        require(_tktr >= price, "Not enough TKTR to buy productions");
        uint256[3] memory tiers;
        tiers[0] = price * 5;
        tiers[1] = tiers[0] + (price * 2 * 10);
        tiers[2] = tiers[1] + (price * 3 * 10);
        require(_tktr <= tiers[2], "Can't buy more than 25");
        address sender = LibMeta.msgSender();
        uint256 numToPurchase;
        uint256 totalPrice;
        if (_tktr <= tiers[0]) {
            numToPurchase = _tktr / price;
            totalPrice = numToPurchase * price;
        } else {
            if (_tktr <= tiers[1]) {
                numToPurchase = (_tktr - tiers[0]) / (price * 2);
                totalPrice = tiers[0] + (numToPurchase * (price * 2));
                numToPurchase += 5;
            } else {
                numToPurchase = (_tktr - tiers[1]) / (price * 3);
                totalPrice = tiers[1] + (numToPurchase * (price * 3));
                numToPurchase += 15;
            }
        }
        uint256 productionCount = production.totalCount + numToPurchase;
        require(productionCount <= production.productionMaxSize, "ShopFacet: Exceeded max number of aavegotchis for this haunt");
        s.productions[currentProductionId].totalCount = uint24(productionCount);
        uint32 tokenId = s.tokenIdCounter;
        emit BuyProductions(sender, _to, tokenId, numToPurchase, totalPrice);
        for (uint256 i; i < numToPurchase; i++) {
            s.tokenatxors[tokenId].owner = _to;
            s.tokenatxors[tokenId].productionId = uint16(currentProductionId);
            s.tokenIdIndexes[tokenId] = s.tokenIds.length;
            s.tokenIds.push(tokenId);
            s.ownerTokenIdIndexes[_to][tokenId] = s.ownerTokenIds[_to].length;
            s.ownerTokenIds[_to].push(tokenId);
            emit LibERC721.Transfer(address(0), _to, tokenId);
            tokenId++;
        }
        s.tokenIdCounter = tokenId;
        LibTokenatxor.purchase(sender, totalPrice);
    }

    /// @notice Allow an item manager to mint new productions
    /// @dev Will throw if the max number of productions for the current produciton has been reached
    /// @param _to The destination of the minted productions
    /// @param _amount the amunt of productions to mint
    function mintProductions(address _to, uint256 _amount) external onlyItemManager {
        uint256 currentProductionId = s.currentProductionId;
        Production storage production = s.productions[currentProductionId];
        address sender = LibMeta.msgSender();
        uint256 productionCount = production.totalCount + _amount;
        require(productionCount <= production.productionMaxSize, "ShopFacet: Exceeded max number of tokenatxors for this produciton");
        s.productions[currentProductionId].totalCount = uint24(productionCount);
        uint32 tokenId = s.tokenIdCounter;
        emit MintProductions(sender, _to, tokenId, _amount, currentProductionId);
        for (uint256 i; i < _amount; i++) {
            s.tokenatxors[tokenId].owner = _to;
            s.tokenatxors[tokenId].productionId = uint16(currentProductionId);
            s.tokenIdIndexes[tokenId] = s.tokenIds.length;
            s.tokenIds.push(tokenId);
            s.ownerTokenIdIndexes[_to][tokenId] = s.ownerTokenIds[_to].length;
            s.ownerTokenIds[_to].push(tokenId);
            emit LibERC721.Transfer(address(0), _to, tokenId);
            tokenId++;
        }
        s.tokenIdCounter = tokenId;
    }

    /// @notice Allow an address to purchase multiple items
    /// @dev Buying an item typically mints it, it will throw if an item has reached its maximum quantity
    /// @param _to Address to send the items once purchased
    /// @param _itemIds The identifiers of the items to be purchased
    /// @param _quantities The quantities of each item to be bought
    function purchaseItemsWithTktr(
        address _to,
        uint256[] calldata _itemIds,
        uint256[] calldata _quantities
    ) external {
        address sender = LibMeta.msgSender();
        require(_itemIds.length == _quantities.length, "ShopFacet: _itemIds not same length as _quantities");
        uint256 totalPrice;
        for (uint256 i; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            uint256 quantity = _quantities[i];
            ItemType storage itemType = s.itemTypes[itemId];
            require(itemType.canPurchaseWithTktr, "ShopFacet: Can't purchase item type with TKTR");
            uint256 totalQuantity = itemType.totalQuantity + quantity;
            require(totalQuantity <= itemType.maxQuantity, "ShopFacet: Total item type quantity exceeds max quantity");
            itemType.totalQuantity = totalQuantity;
            totalPrice += quantity * itemType.tktrPrice;
            LibItems.addToOwner(_to, itemId, quantity);
        }
        uint256 tktrBalance = IERC20(s.tktrContract).balanceOf(sender);
        require(tktrBalance >= totalPrice, "ShopFacet: Not enough TKTR!");
        emit PurchaseItemsWithTktr(sender, _to, _itemIds, _quantities, totalPrice);
        emit LibERC1155.TransferBatch(sender, address(0), _to, _itemIds, _quantities);
        LibTokenatxor.purchase(sender, totalPrice);
        LibERC1155.onERC1155BatchReceived(sender, address(0), _to, _itemIds, _quantities, "");
    }

    /// @notice Allow an address to purchase multiple items after they have been minted
    /// @dev Only one item per transaction can be purchased from the Diamond contract
    /// @param _to Address to send the items once purchased
    /// @param _itemIds The identifiers of the items to be purchased
    /// @param _quantities The quantities of each item to be bought
    function purchaseTransferItemsWithTktr(
        address _to,
        uint256[] calldata _itemIds,
        uint256[] calldata _quantities
    ) external {
        require(_to != address(0), "ShopFacet: Can't transfer to 0 address");
        require(_itemIds.length == _quantities.length, "ShopFacet: ids not same length as values");
        address sender = LibMeta.msgSender();
        address from = address(this);
        uint256 totalPrice;
        for (uint256 i; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            uint256 quantity = _quantities[i];
            require(quantity == 1, "ShopFacet: Can only purchase 1 of an item per transaction");
            ItemType storage itemType = s.itemTypes[itemId];
            require(itemType.canPurchaseWithTktr, "ShopFacet: Can't purchase item type with TKTR");
            totalPrice += quantity * itemType.tktrPrice;
            LibItems.removeFromOwner(from, itemId, quantity);
            LibItems.addToOwner(_to, itemId, quantity);
            LibERC1155Marketplace.updateERC1155Listing(address(this), itemId, from);
        }
        uint256 tktrBalance = IERC20(s.tktrContract).balanceOf(sender);
        require(tktrBalance >= totalPrice, "ShopFacet: Not enough TKTR!");
        emit LibERC1155.TransferBatch(sender, from, _to, _itemIds, _quantities);
        emit PurchaseTransferItemsWithTktr(sender, _to, _itemIds, _quantities, totalPrice);
        LibTokenatxor.purchase(sender, totalPrice);
        LibERC1155.onERC1155BatchReceived(sender, from, _to, _itemIds, _quantities, "");
    }
}