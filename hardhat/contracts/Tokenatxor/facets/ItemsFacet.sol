// SPDX-License-Identifier: MIT
pragma solidity >=0.8.1;

import {LibItems, ItemTypeIO} from "../libraries/LibItems.sol";
import {LibAppStorage, Modifiers, ItemType, Tokenatxor, ItemType, EquippableSet, NUMERIC_TRAITS_NUM, EQUIPPED_SLOTS, PRODUCTION_TOKENATXORS_NUM} from "../libraries/LibAppStorage.sol";
import {LibTokenatxor} from "../libraries/LibTokenatxor.sol";
import {LibStrings} from "../../shared/libraries/LibStrings.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {LibERC1155Marketplace} from "../libraries/LibERC1155Marketplace.sol";
import {LibERC1155} from "../../shared/libraries/LibERC1155.sol";

contract ItemsFacet is Modifiers {

    event TransferToParent(address indexed _toContract, uint256 indexed _toTokenId, uint256 indexed _tokenTypeId, uint256 _value);
    event EquipEquippables(uint256 indexed _tokenId, uint16[EQUIPPED_SLOTS] _oldEquippables, uint16[EQUIPPED_SLOTS] _newEquippables);
    event UseConsumables(uint256 indexed _tokenId, uint256[] _itemIds, uint256[] _quantities);

    /***********************************|
   |             Read Functions         |
   |__________________________________*/

    struct ItemIdIO {
        uint256 itemId;
        uint256 balance;
    }

    /// @notice Returns balance for each item that exists for an account
    /// @param _account Address of the account to query
    /// @return bals_ An array of structs,each struct containing details about each item owned
    function itemBalances(address _account) external view returns (ItemIdIO[] memory bals_) {
        uint256 count = s.ownerItems[_account].length;
        bals_ = new ItemIdIO[](count);
        for (uint256 i; i < count; i++) {
            uint256 itemId = s.ownerItems[_account][i];
            bals_[i].balance = s.ownerItemBalances[_account][itemId];
            bals_[i].itemId = itemId;
        }
    }

    /// @notice Returns balance for each item(and their types) that exists for an account
    /// @param _owner Address of the account to query
    /// @return output_ An array of structs containing details about each item owned(including the item types)
    function itemBalancesWithTypes(address _owner) external view returns (ItemTypeIO[] memory output_) {
        uint256 count = s.ownerItems[_owner].length;
        output_ = new ItemTypeIO[](count);
        for (uint256 i; i < count; i++) {
            uint256 itemId = s.ownerItems[_owner][i];
            output_[i].balance = s.ownerItemBalances[_owner][itemId];
            output_[i].itemId = itemId;
            output_[i].itemType = s.itemTypes[itemId];
        }
    }

    
    /// @notice Get the balance of an account's tokens.
    /// @param _owner  The address of the token holder
    /// @param _id     ID of the token
    /// @return bal_    The _owner's balance of the token type requested
    function balanceOf(address _owner, uint256 _id) external view returns (uint256 bal_) {
        bal_ = s.ownerItemBalances[_owner][_id];
    }

    /// @notice Get the balance of a non-fungible parent token
    /// @param _tokenContract The contract tracking the parent token
    /// @param _tokenId The ID of the parent token
    /// @param _id     ID of the token
    /// @return value The balance of the token
    function balanceOfToken(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _id
    ) external view returns (uint256 value) {
        value = s.nftItemBalances[_tokenContract][_tokenId][_id];
    }

    /// @notice Returns the balances for all ERC1155 items for a ERC721 token
    /// @dev Only valid for claimed tokenatxors
    /// @param _tokenContract Contract address for the token to query
    /// @param _tokenId Identifier of the token to query
    /// @return bals_ An array of structs containing details about each item owned
    function itemBalancesOfToken(address _tokenContract, uint256 _tokenId) external view returns (ItemIdIO[] memory bals_) {
        uint256 count = s.nftItems[_tokenContract][_tokenId].length;
        bals_ = new ItemIdIO[](count);
        for (uint256 i; i < count; i++) {
            uint256 itemId = s.nftItems[_tokenContract][_tokenId][i];
            bals_[i].itemId = itemId;
            bals_[i].balance = s.nftItemBalances[_tokenContract][_tokenId][itemId];
        }
    }

    /// @notice Returns the balances for all ERC1155 items for a ERC721 token
    /// @dev Only valid for claimed tokenatxors
    /// @param _tokenContract Contract address for the token to query
    /// @param _tokenId Identifier of the token to query
    /// @return itemBalancesOfTokenWithTypes_ An array of structs containing details about each item owned(including the types)
    function itemBalancesOfTokenWithTypes(address _tokenContract, uint256 _tokenId)
        external
        view
        returns (ItemTypeIO[] memory itemBalancesOfTokenWithTypes_)
    {
        itemBalancesOfTokenWithTypes_ = LibItems.itemBalancesOfTokenWithTypes(_tokenContract, _tokenId);
    }


    /// @notice Get the balance of multiple account/token pairs
    /// @param _owners The addresses of the token holders
    /// @param _ids    ID of the tokens
    /// @return bals   The _owner's balance of the token types requested (i.e. balance for each (owner, id) pair)
    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory bals) {
        require(_owners.length == _ids.length, "ItemsFacet: _owners length not same as _ids length");
        bals = new uint256[](_owners.length);
        for (uint256 i; i < _owners.length; i++) {
            uint256 id = _ids[i];
            address owner = _owners[i];
            bals[i] = s.ownerItemBalances[owner][id];
        }
    }

    /// @notice Query the current equippables equipped for an NFT
    /// @dev only valid for claimed tokenatxors
    /// @param _tokenId Identifier of the NFT to query
    /// @return equippableIds_ An array containing the Identifiers of the equippable items currently equipped for the NFT
    function equippedEquippables(uint256 _tokenId) external view returns (uint16[EQUIPPED_SLOTS] memory equippableIds_) {
        equippableIds_ = s.tokenatxors[_tokenId].equippedEquippables;
    }

    /// @notice Query all available equippable sets
    /// @dev Called by off chain software so not too concerned about gas costs
    /// @return equippableSets_ Am array of structs, each struct containing details about a equippable set
    function getEquippableSets() external view returns (EquippableSet[] memory equippableSets_) {
        equippableSets_ = s.equippableSets;
    }

    /// @notice Query a particular equippable set
    /// @param _index Index of the set to query
    /// @return equippableSet_ A struct containing details about a equippable set with index `_index`
    function getEquippableSet(uint256 _index) public view returns (EquippableSet memory equippableSet_) {
        uint256 length = s.equippableSets.length;
        require(_index < length, "ItemsFacet: Equippable set does not exist");
        equippableSet_ = s.equippableSets[_index];
    }

    /// @notice Query how many equippable sets are available
    /// @return The total number of equippable sets available
    function totalEquippableSets() external view returns (uint256) {
        return s.equippableSets.length;
    }

    /// @notice Query the equippable set identiiers that a equippable belongs to
    /// @param _equippableIds An array containing the equippable identifiers to query
    /// @return equippableSetIds_ An array containing the equippable set identifiers for each `_equippableIds`
    function findEquippableSets(uint256[] calldata _equippableIds) external view returns (uint256[] memory equippableSetIds_) {
        unchecked {
            uint256 length = s.equippableSets.length;
            equippableSetIds_ = new uint256[](length);
            uint256 count;
            for (uint256 i; i < length; i++) {
                uint16[] memory setEquippableIds = s.equippableSets[i].equippableIds;
                bool foundSet = true;
                for (uint256 j; j < setEquippableIds.length; j++) {
                    uint256 setEquippableId = setEquippableIds[j];
                    bool foundEquippableId = false;
                    for (uint256 k; k < _equippableIds.length; k++) {
                        if (_equippableIds[k] == setEquippableId) {
                            foundEquippableId = true;
                            break;
                        }
                    }
                    if (foundEquippableId == false) {
                        foundSet = false;
                        break;
                    }
                }
                if (foundSet) {
                    equippableSetIds_[count] = i;
                    count++;
                }
            }
            assembly {
                mstore(equippableSetIds_, count)
            }
        }
    }

    /// @notice Query the item type of a particular item
    /// @param _itemId Item to query
    /// @return itemType_ A struct containing details about the item type of an item with identifier _itemId
    function getItemType(uint256 _itemId) public view returns (ItemType memory itemType_) {
        require(_itemId < s.itemTypes.length, "ItemsFacet: Item type doesn't exist");
        itemType_ = s.itemTypes[_itemId];
    }

    /// @notice Query the item type of multiple items
    /// @param _itemIds An array containing the identifiers of items to query
    /// @return itemTypes_ An array of structs,each struct containing details about the item type of the corresponding item
    function getItemTypes(uint256[] calldata _itemIds) external view returns (ItemType[] memory itemTypes_) {
        if (_itemIds.length == 0) {
            itemTypes_ = s.itemTypes;
        } else {
            itemTypes_ = new ItemType[](_itemIds.length);
            for (uint256 i; i < _itemIds.length; i++) {
                itemTypes_[i] = s.itemTypes[_itemIds[i]];
            }
        }
    }

    
    /// @notice Get the URI for a voucher type
    /// @return URI for token type
    function uri(uint256 _id) external view returns (string memory) {
        require(_id < s.itemTypes.length, "ItemsFacet: Item _id not found");
        return LibStrings.strWithUint(s.itemsBaseUri, _id);
    }


    /// @notice Set the base url for all voucher types
    /// @param _value The new base url        
    function setBaseURI(string memory _value) external onlyDaoOrOwner {
        // require(LibMeta.msgSender() == s.contractOwner, "ItemsFacet: Must be contract owner");
        s.itemsBaseUri = _value;
        for (uint256 i; i < s.itemTypes.length; i++) {
            emit LibERC1155.URI(LibStrings.strWithUint(_value, i), i);
        }
    }

    /***********************************|
   |             Write Functions        |
   |__________________________________*/

    /// @notice Allow the owner of a claimed tokenatxor to equip/unequip equippables to his tokenatxor
    /// @dev Only valid for claimed tokenatxors
    /// @dev A zero value will unequip that slot and a non-zero value will equip that slot with the equippable whose identifier is provided
    /// @dev A equippable cannot be equipped in the wrong slot
    /// @param _tokenId The identifier of the tokenatxor to make changes to
    /// @param _equippablesToEquip An array containing the identifiers of the equippables to equip
    function equippedEquippables(uint256 _tokenId, uint16[EQUIPPED_SLOTS] calldata _equippablesToEquip) external onlyTokenatxorOwner(_tokenId) {
        Tokenatxor storage tokenatxor = s.tokenatxors[_tokenId];
        require(tokenatxor.status == LibTokenatxor.STATUS_TOKENATXOR, "LibTokenatxor: Only valid for TR");
        emit EquipEquippables(_tokenId, tokenatxor.equippedEquippables, _equippablesToEquip);

        address sender = LibMeta.msgSender();
        uint256 tokenatxorLevel = LibTokenatxor.tokenatxorPowerLevel(tokenatxor.experience);

        for (uint256 slot; slot < EQUIPPED_SLOTS; slot++) {
            uint256 toEquipId = _equippablesToEquip[slot];
            uint256 existingEquippedEquippableId = tokenatxor.equippedEquippables[slot];

            /// If the new equippable value is equal to the current equipped equippable in that slot
            /// do nothing
            if (toEquipId == existingEquippedEquippableId) {
                continue;
            }

            /// Equips new equippable (or sets to 0)
            tokenatxor.equippedEquippables[slot] = uint16(toEquipId);

            ///  If a equippable was equipped in this slot and can be transferred, transfer back to owner.
            if (existingEquippedEquippableId != 0 && s.itemTypes[existingEquippedEquippableId].canBeTransferred) {
                /// remove equippable from Tokenatxor and transfer item to owner
                LibItems.removeFromParent(address(this), _tokenId, existingEquippedEquippableId, 1);
                LibItems.addToOwner(sender, existingEquippedEquippableId, 1);
                emit LibERC1155.TransferSingle(sender, address(this), sender, existingEquippedEquippableId, 1);
                emit LibERC1155.TransferFromParent(address(this), _tokenId, existingEquippedEquippableId, 1);
            }

            // If a equippable is being equipped
            if (toEquipId != 0) {
                ItemType storage itemType = s.itemTypes[toEquipId];
                require(tokenatxorLevel >= itemType.minLevel, "ItemsFacet: TR level lower than minLevel");
                require(itemType.category == LibItems.ITEM_CATEGORY_EQUIPPABLE, "ItemsFacet: Only equippables can be equippped");
                require(itemType.slotPositions[slot] == true, "ItemsFacet: Equippable can't be equipped in slot");
                {
                    bool canBeEquipped;
                    uint8[] memory allowedCollaterals = itemType.allowedCollaterals;
                    if (allowedCollaterals.length > 0) {
                        uint256 collateralIndex = s.collateralTypeIndexes[tokenatxor.collateralType];

                        for (uint256 i; i < allowedCollaterals.length; i++) {
                            if (collateralIndex == allowedCollaterals[i]) {
                                canBeEquipped = true;
                                break;
                            }
                        }
                        require(canBeEquipped, "ItemsFacet: Equippable can't be used for this collateral");
                    }
                }

                // Then check if this equippable is in the Tokenatxors inventory
                uint256 nftBalance = s.nftItemBalances[address(this)][_tokenId][toEquipId];
                uint256 neededBalance = 1;
                if (slot == LibItems.EQUIPPABLE_SLOT_HAND_LEFT) {
                    if (_equippablesToEquip[LibItems.EQUIPPABLE_SLOT_HAND_RIGHT] == toEquipId) {
                        neededBalance = 2;
                    }
                }

                if (slot == LibItems.EQUIPPABLE_SLOT_HAND_RIGHT) {
                    if (_equippablesToEquip[LibItems.EQUIPPABLE_SLOT_HAND_LEFT] == toEquipId) {
                        neededBalance = 2;
                    }
                }

                if (nftBalance < neededBalance) {
                    uint256 ownerBalance = s.ownerItemBalances[sender][toEquipId];
                    require(nftBalance + ownerBalance >= neededBalance, "ItemsFacet: Equippable isn't in inventory");
                    uint256 balToTransfer = neededBalance - nftBalance;

                    /// Transfer to Tokenatxor
                    LibItems.removeFromOwner(sender, toEquipId, balToTransfer);
                    LibItems.addToParent(address(this), _tokenId, toEquipId, balToTransfer);
                    emit TransferToParent(address(this), _tokenId, toEquipId, balToTransfer);
                    emit LibERC1155.TransferSingle(sender, sender, address(this), toEquipId, balToTransfer);
                    LibERC1155Marketplace.updateERC1155Listing(address(this), toEquipId, sender);
                }
            }
        }
        LibTokenatxor.interact(_tokenId);
    }

    /// @notice Allow the owner of an NFT to use multiple consumable items for his tokenatxor
    /// @dev Only valid for claimed tokenatxors
    /// @dev Consumables can be used to boost wisdom/XP of an tokenatxor
    /// @param _tokenId Identtifier of tokenatxor to use the consumables on
    /// @param _itemIds An array containing the identifiers of the items/consumables to use
    /// @param _quantities An array containing the quantity of each consumable to use
    function useConsumables(
        uint256 _tokenId,
        uint256[] calldata _itemIds,
        uint256[] calldata _quantities
    ) external onlyUnlocked(_tokenId) onlyTokenatxorOwner(_tokenId) {
        require(_itemIds.length == _quantities.length, "ItemsFacet: _itemIds length != _quantities length");
        require(s.tokenatxors[_tokenId].status == LibTokenatxor.STATUS_TOKENATXOR, "LibTokenatxor: Only valid for AG");

        address sender = LibMeta.msgSender();
        for (uint256 i; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            uint256 quantity = _quantities[i];
            ItemType memory itemType = s.itemTypes[itemId];
            require(itemType.category == LibItems.ITEM_CATEGORY_CONSUMABLE, "ItemsFacet: Item isn't consumable");

            LibItems.removeFromOwner(sender, itemId, quantity);

            /// Increase wisdom
            if (itemType.wisdomBonus > 0) {
                uint256 wisdom = (uint256(int256(itemType.wisdomBonus)) * quantity) + s.tokenatxors[_tokenId].interactionCount;
                s.tokenatxors[_tokenId].interactionCount = wisdom;
            } else if (itemType.wisdomBonus < 0) {
                uint256 wisdomBonus = LibAppStorage.abs(itemType.wisdomBonus) * quantity;
                if (s.tokenatxors[_tokenId].interactionCount > wisdomBonus) {
                    s.tokenatxors[_tokenId].interactionCount -= wisdomBonus;
                } else {
                    s.tokenatxors[_tokenId].interactionCount = 0;
                }
            }

            {
                // prevent stack too deep error with braces here
                // Boost traits and reset clock
                bool boost = false;
                for (uint256 j; j < NUMERIC_TRAITS_NUM; j++) {
                    if (itemType.traitModifiers[j] != 0) {
                        boost = true;
                        break;
                    }
                }
                if (boost) {
                    s.tokenatxors[_tokenId].lastTemporaryBoost = uint40(block.timestamp);
                    s.tokenatxors[_tokenId].temporaryTraitBoosts = itemType.traitModifiers;
                }
            }

            /// Increase experience
            if (itemType.experienceBonus > 0) {
                uint256 experience = (uint256(itemType.experienceBonus) * quantity) + s.tokenatxors[_tokenId].experience;
                s.tokenatxors[_tokenId].experience = experience;
            }

            itemType.totalQuantity -= quantity;
            LibTokenatxor.interact(_tokenId);
            LibERC1155Marketplace.updateERC1155Listing(address(this), itemId, sender);
        }
        emit UseConsumables(_tokenId, _itemIds, _quantities);
        emit LibERC1155.TransferBatch(sender, sender, address(0), _itemIds, _quantities);
    }
}
