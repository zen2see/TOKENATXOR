// SPDX-License-Identifier: MIT
pragma solidity >=0.8.1;

import {Modifiers, ItemType, EquippableSet, NUMERIC_TRAITS_NUM, EQUIPPED_SLOTS, TokenatxorCollateralTypeInfo} from "../libraries/LibAppStorage.sol";
import {TokenatxorCollateralTypeIO} from "../libraries/LibTokenatxor.sol";
import {LibERC1155} from "../../shared/libraries/LibERC1155.sol";
import {LibItems} from "../libraries/LibItems.sol";
import {LibSvg} from "../libraries/LibSvg.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {GameManager} from "../libraries/LibAppStorage.sol";

contract DAOFacet is Modifiers {
    event DaoTransferred(address indexed previousDao, address indexed newDao);
    event DaoTreasuryTransferred(address indexed previousDaoTreasury, address indexed newDaoTreasury);
    event UpdateCollateralModifiers(int16[NUMERIC_TRAITS_NUM] _oldModifiers, int16[NUMERIC_TRAITS_NUM] _newModifiers);
    event AddCollateralType(TokenatxorCollateralTypeIO _collateralType);
    event AddItemType(ItemType _itemType);
    event CreateProduction(uint256 indexed _productionId, uint256 _productionMaxSize, uint256 _productionPrice, bytes32 _bodyColor);
    event GrantExperience(uint256[] _tokenIds, uint256[] _xpValues);
    event AddEquippableSet(EquippableSet _equippableSet);
    event UpdateEquippableSet(uint256 _setId, EquippableSet _equippableSet);
    event ItemTypeMaxQuantity(uint256[] _itemIds, uint256[] _maxQuanities);
    event GameManagerAdded(address indexed gameManager_, uint256 indexed limit_, uint256 refreshTime_);
    event GameManagerRemoved(address indexed gameManager_);
    event ItemManagerAdded(address indexed newItemManager_);
    event ItemManagerRemoved(address indexed itemManager_);
    event EquippableSlotPositionsSet(uint256 _equippableId, bool[EQUIPPED_SLOTS] _slotPositions);
    event ItemModifiersSet(uint256 _equippableId, int8[6] _traitModifiers, uint8 _rarityScoreModifier);
    event RemoveExperience(uint256[] _tokenIds, uint256[] _xpValues);

    /***********************************|
   |             Read Functions         |
   |__________________________________*/

    /// @notice Query if an address is a game manager
    /// @param _manager Address to query
    /// @return True if `_manager` is a game manager,False otherwise 
    function isGameManager(address _manager) external view returns (bool) {
        return s.gameManagers[_manager].limit != 0;
    }

    /// @notice Query the balance of a game manager
    /// @param _manager Address to query
    /// @return Balance of game manager `_manager`
    function gameManagerBalance(address _manager) external view returns (uint256) {
        return s.gameManagers[_manager].balance;
    }

    /// @notice Query the refresh time of a game manager
    /// @param _manager Address to query
    /// @return Refresh time of game manager `_manager`
    function gameManagerRefreshTime(address _manager) external view returns (uint256) {
        return s.gameManagers[_manager].refreshTime;
    }

    /***********************************|
   |             Write Functions        |
   |__________________________________*/

    /// @notice Allow the Diamond owner or DAO to set a new Dao address and Treasury address
    /// @param _newDao New DAO address
    /// @param _newDaoTreasury New treasury address
    function setDao(address _newDao, address _newDaoTreasury) external onlyDaoOrOwner {
        emit DaoTransferred(s.dao, _newDao);
        emit DaoTreasuryTransferred(s.daoTreasury, _newDaoTreasury);
        s.dao = _newDao;
        s.daoTreasury = _newDaoTreasury;
    }

    /// @notice Allow an item manager to add new collateral types to a produciton
    /// @dev If a certain collateral exists already, it will be overwritten
    /// @param _productionId Identifier for production to add the collaterals to
    /// @param _collateralTypes An array of structs where each struct contains details about a particular collateral
    function addCollateralTypes(uint256 _productionId, TokenatxorCollateralTypeIO[] calldata _collateralTypes) public onlyItemManager {
        for (uint256 i; i < _collateralTypes.length; i++) {
            address newCollateralType = _collateralTypes[i].collateralType;

            // Overwrite the collateralTypeInfo if it already exists
            s.collateralTypeInfo[newCollateralType] = _collateralTypes[i].collateralTypeInfo;

            // First handle global collateralTypes array
            uint256 index = s.collateralTypeIndexes[newCollateralType];
            bool collateralExists = index > 0 || s.collateralTypes[0] == newCollateralType;

            if (!collateralExists) {
                s.collateralTypes.push(newCollateralType);
                s.collateralTypeIndexes[newCollateralType] = s.collateralTypes.length;
            }

            // Then handle producitonCollateralTypes array
            bool productionCollateralExists = false;
            for (uint256 productionIndex = 0; productionIndex < s.productionCollateralTypes[_productionId].length; productionIndex++) {
                address existingProductionCollateral = s.productionCollateralTypes[_productionId][productionIndex];

                if (existingProductionCollateral == newCollateralType) {
                    productionCollateralExists = true;
                    break;
                }
            }

            if (!productionCollateralExists) {
                s.productionCollateralTypes[_productionId].push(newCollateralType);
                emit AddCollateralType(_collateralTypes[i]);
            }
        }
    }

    /// @notice Allow the Diamond owner or DAO to add item managers
    /// @param _newItemManagers An array containing the addresses that need to be added as item managers
    function addItemManagers(address[] calldata _newItemManagers) external onlyDaoOrOwner {
        for (uint256 index = 0; index < _newItemManagers.length; index++) {
            address newItemManager = _newItemManagers[index];
            s.itemManagers[newItemManager] = true;
            emit ItemManagerAdded(newItemManager);
        }
    }

    /// @notice Allow the Diamond owner or DAO to remove item managers
    /// @dev Will throw if one of the addresses in `_itemManagers` is not an item manager
    /// @param _itemManagers An array containing the addresses that need to be removed from existing item managers
    function removeItemManagers(address[] calldata _itemManagers) external onlyDaoOrOwner {
        for (uint256 index = 0; index < _itemManagers.length; index++) {
            address itemManager = _itemManagers[index];
            require(s.itemManagers[itemManager] == true, "DAOFacet: itemManager does not exist or already removed");
            s.itemManagers[itemManager] = false;
            emit ItemManagerRemoved(itemManager);
        }
    }

    /// @notice Allow the Diamond owner or DAO to update the collateral modifiers of an existing collateral
    /// @param _collateralType The address of the existing collateral to update
    /// @param _modifiers An array containing the new numeric traits modifiers which will be applied to collateral `_collateralType`
    function updateCollateralModifiers(address _collateralType, int16[NUMERIC_TRAITS_NUM] calldata _modifiers) external onlyDaoOrOwner {
        emit UpdateCollateralModifiers(s.collateralTypeInfo[_collateralType].modifiers, _modifiers);
        s.collateralTypeInfo[_collateralType].modifiers = _modifiers;
    }

    /// @notice Allow an item manager to increase the max quantity of an item
    /// @dev Will throw if the new maxquantity is less than the existing quantity
    /// @param _itemIds An array containing the identifiers of items whose quantites are to be increased
    /// @param _maxQuantities An array containing the new max quantity of each item
    function updateItemTypeMaxQuantity(uint256[] calldata _itemIds, uint256[] calldata _maxQuantities) external onlyItemManager {
        require(_itemIds.length == _maxQuantities.length, "DAOFacet: _itemIds length not the same as _newQuantities length");
        for (uint256 i; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            uint256 maxQuantity = _maxQuantities[i];
            require(maxQuantity >= s.itemTypes[itemId].totalQuantity, "DAOFacet: maxQuantity is greater than existing quantity");
            s.itemTypes[itemId].maxQuantity = maxQuantity;
        }
        emit ItemTypeMaxQuantity(_itemIds, _maxQuantities);
    }

    /// @notice Allow the Diamond owner or DAO to create a new Production
    /// @dev Will throw if the previous production is not full yet
    /// @param _productionMaxSize The maximum number of producions in the new production
    /// @param _productionPrice The base price of producitons in the new production(in $TKTR)
    /// @param _bodyColor The universal body color applied to NFTs in the new produciton
    function createProduction(
        uint24 _productionMaxSize,
        uint96 _productionPrice,
        bytes3 _bodyColor
    ) external onlyDaoOrOwner returns (uint256 productionId_) {
        uint256 currentProductionId = s.currentProductionId;
        require(
            s.productions[currentProductionId].totalCount == s.productions[currentProductionId].productionMaxSize,
            "TokenatxorFacet: Production must be full before creating new"
        );
        productionId_ = currentProductionId + 1;
        s.currentProductionId = uint16(productionId_);
        s.productions[productionId_].productionMaxSize = _productionMaxSize;
        s.productions[productionId_].productionPrice = _productionPrice;
        s.productions[productionId_].bodyColor = _bodyColor;
        emit CreateProduction(productionId_, _productionMaxSize, _productionPrice, _bodyColor);
    }

    struct CreateProductionPayload {
        uint24 _productionMaxSize;
        uint96 _productionPrice;
        bytes3 _bodyColor;
        TokenatxorCollateralTypeIO[] _collateralTypes;
        string _collateralSvg;
        LibSvg.SvgTypeAndSizes[] _collateralTypesAndSizes;
        string _expressionSvg;
        LibSvg.SvgTypeAndSizes[] _expressionTypesAndSizes;
    }

    /// May overload the block gas limit but worth trying
    /// @notice allow an item manager to create a new Production, also uploagding the collateral types,collateral svgs,expression types and expression svgs all in one transaction
    /// @param _payload A struct containing all details needed to be uploaded for a new Production
    function createProductionWithPayload(CreateProductionPayload calldata _payload) external onlyItemManager returns (uint256 productionId_) {
        uint256 currentProductionId = s.currentProductionId;
        require(
            s.productions[currentProductionId].totalCount == s.productions[currentProductionId].productionMaxSize,
            "TokenatxorFacet: Production must be full before creating new"
        );

        productionId_ = currentProductionId + 1;

        //Upload collateralTypes
        addCollateralTypes(productionId_, _payload._collateralTypes);

        //Upload collateralSvgs
        LibSvg.storeSvg(_payload._collateralSvg, _payload._collateralTypesAndSizes);

        //Upload expressions
        LibSvg.storeSvg(_payload._expressionSvg, _payload._expressionTypesAndSizes);

        s.currentProductionId = uint16(productionId_);
        s.productions[productionId_].productionMaxSize = _payload._productionMaxSize;
        s.productions[productionId_].productionPrice = _payload._productionPrice;
        s.productions[productionId_].bodyColor = _payload._bodyColor;
        emit CreateProduction(productionId_, _payload._productionMaxSize, _payload._productionPrice, _payload._bodyColor);
    }

    /// @notice Allow an item manager to mint new ERC1155 items
    /// @dev Will throw if a particular item current supply has reached its maximum supply
    /// @param _to The address to mint the items to
    /// @param _itemIds An array containing the identifiers of the items to mint
    /// @param _quantities An array containing the number of items to mint
    function mintItems(
        address _to,
        uint256[] calldata _itemIds,
        uint256[] calldata _quantities
    ) external onlyItemManager {
        require(_itemIds.length == _quantities.length, "DAOFacet: Ids and quantities length must match");
        address sender = LibMeta.msgSender();
        uint256 itemTypesLength = s.itemTypes.length;
        for (uint256 i; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];

            require(itemTypesLength > itemId, "DAOFacet: Item type does not exist");

            uint256 quantity = _quantities[i];
            uint256 totalQuantity = s.itemTypes[itemId].totalQuantity + quantity;
            require(totalQuantity <= s.itemTypes[itemId].maxQuantity, "DAOFacet: Total item type quantity exceeds max quantity");

            LibItems.addToOwner(_to, itemId, quantity);
            s.itemTypes[itemId].totalQuantity = totalQuantity;
        }
        emit LibERC1155.TransferBatch(sender, address(0), _to, _itemIds, _quantities);
        LibERC1155.onERC1155BatchReceived(sender, address(0), _to, _itemIds, _quantities, "");
    }

    /// @notice Allow the DAO, a game manager or the tokenatxor diamond owner to grant XP(experience points) to multiple tokenatxors
    /// @dev recipients must be claimed tokenatxors
    /// @param _tokenIds The identifiers of the tokenatxors to grant XP to
    /// @param _xpValues The amount XP to grant each tokenatxor
    function grantExperience(uint256[] calldata _tokenIds, uint256[] calldata _xpValues) external onlyOwnerOrDaoOrGameManager {
        require(_tokenIds.length == _xpValues.length, "DAOFacet: IDs must match XP array length");
        GameManager storage gameManager = s.gameManagers[LibMeta.msgSender()];

        /// GameManager: If the refresh time has been reached, reset the gameManager's balance to the individual limit, and set the refreshTime to 1 day after the block timestamp.
        if (gameManager.refreshTime < block.timestamp) {
            gameManager.balance = gameManager.limit;
            gameManager.refreshTime = uint32(block.timestamp + 1 days);
        }

        for (uint256 i; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            uint256 xp = _xpValues[i];
            require(xp <= 1000, "DAOFacet: Cannot grant more than 1000 XP at a time");
            require(gameManager.balance >= xp, "DAOFacet: Game Manager's xp grant limit is reached");

            s.tokenatxors[tokenId].experience += xp;
            gameManager.balance -= xp;
        }
        emit GrantExperience(_tokenIds, _xpValues);
    }

    /// @notice Allow the DAO, a game manager or the tokenatxor diamond owner to remove XP(experience points) from multiple tokenatxors
    /// @dev recipients must be claimed tokenatxors
    /// @param _tokenIds The identifiers of the tokenatxors to grant XP to
    /// @param _xpValues The amount XP to grant each tokenatxors
    function removeExperience(uint256[] calldata _tokenIds, uint256[] calldata _xpValues) external onlyOwnerOrDaoOrGameManager {
        require(_tokenIds.length == _xpValues.length, "DAOFacet: IDs must match XP array length");

        /// todo: Create new permission to only allow certain gameManagers to access this
        for (uint256 i; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            uint256 removeXp = _xpValues[i];

            require(s.tokenatxors[tokenId].experience >= removeXp, "DAOFacet: Remove XP would underflow");

            s.tokenatxors[tokenId].experience -= removeXp;
        }
        emit RemoveExperience(_tokenIds, _xpValues);
    }

    /// @notice Allow an item manager to add item types
    /// @param _itemTypes An array of structs where each struct contains details about each item to be added
    function addItemTypes(ItemType[] memory _itemTypes) external onlyItemManager {
        insertItemTypes(_itemTypes);
    }

    /// @notice Allow an item manager to add item types and their svgs
    /// @param _itemTypes An array of structs where each struct contains details about each item to be added
    /// @param _svg The svg to be added
    /// @param _typesAndSizes An array of structs, each struct containing details about the item types and sizes
    function addItemTypesAndSvgs(
        ItemType[] memory _itemTypes,
        string calldata _svg,
        LibSvg.SvgTypeAndSizes[] calldata _typesAndSizes
    ) external onlyItemManager {
        insertItemTypes(_itemTypes);
        LibSvg.storeSvg(_svg, _typesAndSizes);
    }

    function insertItemTypes(ItemType[] memory _itemTypes) internal {
        uint256 itemTypesLength = s.itemTypes.length;
        for (uint256 i; i < _itemTypes.length; i++) {
            uint256 itemId = itemTypesLength++;
            s.erc1155Categories[address(this)][itemId] = _itemTypes[i].category;
            s.itemTypes.push(_itemTypes[i]);
            emit AddItemType(_itemTypes[i]);
            emit LibERC1155.TransferSingle(LibMeta.msgSender(), address(0), address(0), itemId, 0);
        }
    }

    /// @notice Allow an item manager to add a equippable set
    /// @param _equippableSets An array of structs, each struct containing the details about each equippableset to be added
    function addEquippableSets(EquippableSet[] memory _equippableSets) external onlyItemManager {
        for (uint256 i; i < _equippableSets.length; i++) {
            s.equippableSets.push(_equippableSets[i]);
            emit AddEquippableSet(_equippableSets[i]);
        }
    }

    /// @notice Allow an item manager to update existing equippablesets
    /// @param _setIds An array containing the identifiers of the equippablesets to be updated
    /// @param _equippableSets An array oof structs,each struct representing the updated equippableset details
    function updateEquippableSets(uint256[] calldata _setIds, EquippableSet[] calldata _equippableSets) external onlyItemManager {
        require(_setIds.length == _equippableSets.length, "_setIds not same length as _equippableSets");
        for (uint256 i; i < _setIds.length; i++) {
            s.equippableSets[_setIds[i]] = _equippableSets[i];
            emit UpdateEquippableSet(_setIds[i], _equippableSets[i]);
        }
    }

    /// @notice Allow the DAO or the tokenatxor diamond owner to add new game managers and  their corresponding limits
    /// @param _newGameManagers An array containing the addresses to be added as game managers
    /// @param _limits An array containing the corresponding limits applied to ech address in `_newGameManagers`
    function addGameManagers(address[] calldata _newGameManagers, uint256[] calldata _limits) external onlyDaoOrOwner {
        require(_newGameManagers.length == _limits.length, "DAOFacet: New Game Managers and Limits should have same length");
        for (uint256 index = 0; index < _newGameManagers.length; index++) {
            GameManager storage gameManager = s.gameManagers[_newGameManagers[index]];
            gameManager.limit = _limits[index];
            gameManager.balance = _limits[index];
            gameManager.refreshTime = uint256(block.timestamp + 1 days);
            emit GameManagerAdded(_newGameManagers[index], _limits[index], uint256(block.timestamp + 1 days));
        }
    }

    /// @notice Allow the DAO or the tokenatxor diamond owner to remove existing  game managers
    /// @dev It also resets the limit of each removed game manager to 0
    /// @param _gameManagers An array containing the addresses to be removed from existing game managers
    function removeGameManagers(address[] calldata _gameManagers) external onlyDaoOrOwner {
        for (uint256 index = 0; index < _gameManagers.length; index++) {
            GameManager storage gameManager = s.gameManagers[_gameManagers[index]];
            require(gameManager.limit != 0, "DAOFacet: GameManager does not exist or already removed");
            gameManager.limit = 0;
            emit GameManagerRemoved(_gameManagers[index]);
        }
    }

    /// @notice Allow the DAO or the tokenatxor diamond owner to set the equippable slot position for a particular equippable
    /// @param _equippableId The identifier of the equippable to change its slot position
    /// @param _slotPositions An array of booleans pointing out where `_equippableId` is now assigned to. True if assigned to a slot, False if otherwise
    function setEquippableSlotPositions(uint256 _equippableId, bool[EQUIPPED_SLOTS] calldata _slotPositions) external onlyItemManager {
        require(_equippableId < s.itemTypes.length, "Error");
        s.itemTypes[_equippableId].slotPositions = _slotPositions;
        emit EquippableSlotPositionsSet(_equippableId, _slotPositions);
    }

    /// @notice Allow an item manager to set the trait and rarity modifiers of an item/equippable
    /// @dev Only valid for existing equippables
    /// @param _equippableId The identifier of the wearable to set
    /// @param _traitModifiers An array containing the new trait modifiers to be applied to a wearable with identifier `_equippableId`
    /// @param _rarityScoreModifier The new rarityScore modifier of a equippable with identifier `_equippableId`
    function setItemTraitModifiersAndRarityModifier(
        uint256 _equippableId,
        int8[6] calldata _traitModifiers,
        uint8 _rarityScoreModifier
    ) external onlyItemManager {
        require(_equippableId < s.itemTypes.length, "Error");
        s.itemTypes[_equippableId].traitModifiers = _traitModifiers;
        s.itemTypes[_equippableId].rarityScoreModifier = _rarityScoreModifier;
        emit ItemModifiersSet(_equippableId, _traitModifiers, _rarityScoreModifier);
    }
}
