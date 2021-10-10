// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {LibTokenatxor, TokenatxorInfo, NUMERIC_TRAITS_NUM, TokenatxorCollateralTypeInfo, ProductionTokenatxorTraitsIO, InternalProductionTokenatxorTraitsIO, PRODUCTION_TOKENATXORS_NUM} from "../libraries/LibTokenatxor.sol";
import {LibAppStorage} from "../libraries/LibAppStorage.sol";
import {IERC20} from "../../shared/interfaces/IERC20.sol";
import {LibStrings} from "../../shared/libraries/LibStrings.sol";
import {Modifiers, Production, Tokenatxor} from "../libraries/LibAppStorage.sol";
import {LibERC20} from "../../shared/libraries/LibERC20.sol";
import {CollateralEscrow} from "../CollateralEscrow.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {LibERC721Marketplace} from "../libraries/LibERC721Marketplace.sol";

contract TokenatxorGameFacet is Modifiers {
    /// @dev This emits when the approved address for an NFT is changed or
    ///  reaffirmed. The zero address indicates there is no approved address.
    ///  When a Transfer event emits, this also indicates that the approved
    ///  address for that NFT (if any) is reset to none.
    /// @dev This emits when an operator is enabled or disabled for an owner.
    ///  The operator can manage all NFTs of the owner.
    event ClaimTokenatxor(uint256 indexed _tokenId);
    event SetTokenatxorName(uint256 indexed _tokenId, string _oldName, string _newName);
    event SetBatchId(uint256 indexed _batchId, uint256[] tokenIds);
    event SpendSkillpoints(uint256 indexed _tokenId, int16[4] _values);
    event LockTokenatxor(uint256 indexed _tokenId, uint256 _time);
    event UnLockTokenatxor(uint256 indexed _tokenId, uint256 _time);

    /// @notice Check if a string `_name` has not been assigned to another NFT
    /// @param _name Name to check
    /// @return available_ True if the name has not been taken, False otherwise
    function tokenatxorNameAvailable(string calldata _name) external view returns (bool available_) {
        available_ = s.tokenatxorNamesUsed[LibTokenatxor.validateAndLowerName(_name)];
    }

    /// @notice Check the latest Production identifier and details
    /// @return productionId_ The latest haunt identifier
    /// @return production_ A struct containing the details about the latest production
    function currentProduction() external view returns (uint256 productionId_, Production memory production_) {
        productionId_ = s.currentProductionId;
        production_ = s.productions[productionId_];
    }

    struct RevenueSharesIO {
        address burnAddress;
        address daoAddress;
        address rarityFarming;
        address artists;
    }

    /// @notice Check all addresses relating to revenue deposits including the burn address
    /// @return RevenueSharesIO A struct containing all addresses relating to revenue deposits
    function revenueShares() external view returns (RevenueSharesIO memory) {
        return RevenueSharesIO(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF, s.daoTreasury, s.rarityFarming, s.artists);
    }

    function productionTokenatxorTraits(uint256 _tokenId)
        external
        view
        returns (ProductionTokenatxorTraitsIO[PRODUCTION_TOKENATXORS_NUM] memory productionTokenatxorTraits_)
    {
        productionTokenatxorTraits_ = LibTokenatxor.productionTokenatxorTraits(_tokenId);
    }

    /// @notice Query the $TKTR token address
    /// @return contract_ the deployed address of the $TKTR token contract
    function tktrAddress() external view returns (address contract_) {
        contract_ = s.tktrContract;
    }

    /// @notice Query the numeric traits of an NFT
    /// @dev Only valid for claimed Tokenatxors
    /// @param _tokenId The identifier of the NFT to query
    /// @return numericTraits_ A six-element array containing integers,each representing the traits of the NFT with identifier `_tokenId`
    function getNumericTraits(uint256 _tokenId) external view returns (int16[NUMERIC_TRAITS_NUM] memory numericTraits_) {
        numericTraits_ = LibTokenatxor.getNumericTraits(_tokenId);
    }

    /// @notice Query the available skill points that can be used for an NFT
    /// @dev Will throw if the amount of skill points available is greater than or equal to the amount of skill points which have been used
    /// @param _tokenId The identifier of the NFT to query
    /// @return   An unsigned integer which represents the available skill points of an NFT with identifier `_tokenId`
    function availableSkillPoints(uint256 _tokenId) public view returns (uint256) {
        uint256 level = LibTokenatxor.tokenatxorPowerLevel(s.tokenatxors[_tokenId].experience);
        uint256 skillPoints = (level / 3);
        uint256 usedSkillPoints = s.tokenatxors[_tokenId].usedSkillPoints;
        require(skillPoints >= usedSkillPoints, "TokenatxorGameFacet: Used skill points is greater than skill points");
        return skillPoints - usedSkillPoints;
    }


    /// @notice Calculate level given the XP(experience points)
    /// @dev Only valid for claimed Tokenatxors
    /// @param _experience the current XP gathered by an NFT
    /// @return level_ The level of an NFT with experience `_experience`
    function tokenatxorPowerLevel(uint256 _experience) external pure returns (uint256 level_) {
        level_ = LibTokenatxor.tokenatxorPowerLevel(_experience);
    }

    /// @notice Calculate the XP needed for an NFT to advance to the next level
    /// @dev Only valid for claimed Tokenatxors
    /// @param _experience The current XP points gathered by an NFT
    /// @return requiredXp_ The XP required for the NFT to move to the next level
    function xpUntilNextPowerLevel(uint256 _experience) external pure returns (uint256 requiredXp_) {
        requiredXp_ = LibTokenatxor.xpUntilNextPowerLevel(_experience);
    }

    /// @notice Compute the rarity multiplier of an NFT
    /// @dev Only valid for claimed Tokenatxors
    /// @param _numericTraits An array of six integers each representing a numeric trait of an NFT
    /// return multiplier_The rarity multiplier of an NFT with numeric traits `_numericTraits`
    function rarityMultiplier(int16[NUMERIC_TRAITS_NUM] memory _numericTraits) external pure returns (uint256 multiplier_) {
        multiplier_ = LibTokenatxor.rarityMultiplier(_numericTraits);
    }

    /// @notice Calculates the base rarity score, including collateral modifier
    /// @dev Only valid for claimed Tokenatxors
    /// @param _numericTraits An array of six integers each representing a numeric trait of an NFT
    /// @return rarityScore_ The base rarity score of an NFT with numeric traits `_numericTraits`
    function baseRarityScore(int16[NUMERIC_TRAITS_NUM] memory _numericTraits) external pure returns (uint256 rarityScore_) {
        rarityScore_ = LibTokenatxor.baseRarityScore(_numericTraits);
    }

    /// @notice Check the modified traits and rarity score of an NFT(as a result of equipped wearables)
    /// @dev Only valid for claimed Tokenatxors
    /// @param _tokenId Identifier of the NFT to query
    /// @return numericTraits_ An array of six integers each representing a numeric trait(modified) of an NFT with identifier `_tokenId`
    /// @return rarityScore_ The modified rarity score of an NFT with identifier `_tokenId`
    //Only valid for claimed Tokenatxors
    function modifiedTraitsAndRarityScore(uint256 _tokenId)
        external
        view
        returns (int16[NUMERIC_TRAITS_NUM] memory numericTraits_, uint256 rarityScore_)
    {
        (numericTraits_, rarityScore_) = LibTokenatxor.modifiedTraitsAndRarityScore(_tokenId);
    }

    /// @notice Check the wisdom of an NFT
    /// @dev Only valid for claimed Tokenatxors
    /// @dev Default wisdom value is 50
    /// @param _tokenId Identifier of the NFT to query
    /// @return score_ The wisdom of an NFT with identifier `_tokenId`
    function wisdom(uint256 _tokenId) external view returns (uint256 score_) {
        score_ = LibTokenatxor.wisdom(_tokenId);
    }

    struct TokenIdsWithWisdom {
        uint256 tokenId;
        uint256 wisdom;
        uint256 lastInteracted;
    }

    /// @notice Query the tokenId, wisdom and lastInteracted values of a set of NFTs belonging to an address
    /// @dev Will throw if `_count` is greater than the number of NFTs owned by `_owner`
    /// @param _owner Address to query
    /// @param _count Number of NFTs to check
    /// @param _skip Number of NFTs to skip while querying
    /// @param all If true, query all NFTs owned by `_owner`; if false, query `_count` NFTs owned by `_owner`
    /// @return tokenIdsWithWisdom_ An array of structs where each struct contains the `tokenId`,`wisdom`and `lastInteracted` of each NFT
    function tokenIdsWithWisdom(
        address _owner,
        uint256 _count,
        uint256 _skip,
        bool all
    ) external view returns (TokenIdsWithWisdom[] memory tokenIdsWithWisdom_) {
        uint32[] memory tokenIds = s.ownerTokenIds[_owner];
        uint256 length = all ? tokenIds.length : _count;
        tokenIdsWithWisdom_ = new TokenIdsWithWisdom[](length);

        if (!all) {
            require(_skip + _count <= tokenIds.length, "gameFacet: Owner does not have up to that amount of tokens");
        }

        for (uint256 i; i < length; i++) {
            uint256 offset = i + _skip;
            uint32 tokenId = tokenIds[offset];
            if (s.tokenatxors[tokenId].status == 3) {
                tokenIdsWithWisdom_[i].tokenId = tokenId;
                tokenIdsWithWisdom_[i].wisdom = LibTokenatxor.wisdom(tokenId);
                tokenIdsWithWisdom_[i].lastInteracted = s.tokenatxors[tokenId].lastInteracted;
            }
        }
    }

    /// @notice Allows the owner of an NFT(Production) to claim an Tokenatxor provided it has been unlocked
    /// @dev Will throw if the Production(with identifier `_tokenid`) has not been opened(Unlocked) yet
    /// @dev If the NFT(Production) with identifier `_tokenId` is listed for sale on the baazaar while it is being unlocked, that listing is cancelled
    /// @param _tokenId The identifier of NFT to claim an Tokenatxor from
    /// @param _option The index of the tokenatxor to claim(1-10)
    /// @param _stakeAmount Minimum amount of collateral tokens needed to be sent to the new tokenatxor escrow contract
    function claimTokenatxor(
        uint256 _tokenId,
        uint256 _option,
        uint256 _stakeAmount
    ) external onlyUnlocked(_tokenId) onlyTokenatxorOwner(_tokenId) {
        Tokenatxor storage tokenatxor = s.tokenatxors[_tokenId];
        require(tokenatxor.status == LibTokenatxor.STATUS_OPEN_PRODUCTION, "TokenatxorGameFacet: Portal not open");
        require(_option < PRODUCTION_TOKENATXORS_NUM, "TokenatxorGameFacet: Only 10 tokenatxor options available");
        uint256 randomNumber = s.tokenIdToRandomNumber[_tokenId];
        uint256 productionId = s.tokenatxors[_tokenId].productionId;

        InternalProductionTokenatxorTraitsIO memory option = LibTokenatxor.singleProductionTokenatxorTraits(productionId, randomNumber, _option);
        tokenatxor.randomNumber = option.randomNumber;
        tokenatxor.numericTraits = option.numericTraits;
        tokenatxor.collateralType = option.collateralType;
        tokenatxor.minimumStake = option.minimumStake;
        tokenatxor.lastInteracted = uint40(block.timestamp - 12 hours);
        tokenatxor.interactionCount = 50;
        tokenatxor.claimTime = uint40(block.timestamp);

        require(_stakeAmount >= option.minimumStake, "TokenatxorGameFacet: _stakeAmount less than minimum stake");

        tokenatxor.status = LibTokenatxor.STATUS_TOKENATXOR;
        emit ClaimTokenatxor(_tokenId);

        address escrow = address(new CollateralEscrow(option.collateralType));
        tokenatxor.escrow = escrow;
        address owner = LibMeta.msgSender();
        LibERC20.transferFrom(option.collateralType, owner, escrow, _stakeAmount);
        LibERC721Marketplace.cancelERC721Listing(address(this), _tokenId, owner);
    }


    /// @notice Allows the owner of a NFT to set a name for it
    /// @dev only valid for claimed tokenatxors
    /// @dev Will throw if the name has been used for another claimed tokenatxor
    /// @param _tokenId the identifier if the NFT to name
    /// @param _name Preferred name to give the claimed tokenatxor
    function setTokenatxorName(uint256 _tokenId, string calldata _name) external onlyUnlocked(_tokenId) onlyTokenatxorOwner(_tokenId) {
        require(s.tokenatxors[_tokenId].status == LibTokenatxor.STATUS_TOKENATXOR, "TokenatxorGameFacet: Must claim tokenatxor before setting name");
        string memory lowerName = LibTokenatxor.validateAndLowerName(_name);
        string memory existingName = s.tokenatxors[_tokenId].name;
        if (bytes(existingName).length > 0) {
            delete s.tokenatxorNamesUsed[LibTokenatxor.validateAndLowerName(existingName)];
        }
        require(!s.tokenatxorNamesUsed[lowerName], "TokenatxorGameFacet: Tokenatxor name used already");
        s.tokenatxorNamesUsed[lowerName] = true;
        s.tokenatxors[_tokenId].name = _name;
        emit SetTokenatxorName(_tokenId, existingName, _name);
    }

    /// @notice Allow the owner of an NFT to interact with them, thereby increasing their wisdom(petting)
    /// @dev only valid for claimed tokenatxors
    /// @dev Wisdom will only increase if the lastInteracted minus the current time is greater than or equal to 12 hours
    /// @param _tokenIds An array containing the token identifiers of the claimed tokenatxors that are to be interacted with
    function interact(uint256[] calldata _tokenIds) external {
        address sender = LibMeta.msgSender();
        for (uint256 i; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            address owner = s.tokenatxors[tokenId].owner;

            /// If the owner is the bridge, anyone can pet the tokentxrs inside
            if (owner != address(this)) {
                require(
                    sender == owner || s.operators[owner][sender] || s.approved[tokenId] == sender || s.petOperators[owner][sender],
                    "TokenatxorGameFacet: Not owner of token or approved"
                );
            }

            require(s.tokenatxors[tokenId].status == LibTokenatxor.STATUS_TOKENATXOR, "LibTokenatxor: Only valid for Tokenatxor");
            LibTokenatxor.interact(tokenId);
        }
    }

    /// @notice Allow the owner of an NFT to spend skill points for it (basically to boost the numeric traits of that NFT)
    /// @dev only valid for claimed tokenatxors
    /// @param _tokenId The identifier of the NFT to spend the skill points on
    /// @param _values An array of four integers that represent the values of the skill points
    function spendSkillPoints(uint256 _tokenId, int16[4] calldata _values) external onlyUnlocked(_tokenId) onlyTokenatxorOwner(_tokenId) {
        // To test: Prevent underflow (is this ok?), see require below
        uint256 totalUsed;
        for (uint256 index; index < _values.length; index++) {
            totalUsed += LibAppStorage.abs(_values[index]);

            s.tokenatxors[_tokenId].numericTraits[index] += _values[index];
        }
        /// handles underflow
        require(availableSkillPoints(_tokenId) >= totalUsed, "TokenatxorGameFacet: Not enough skill points");
        /// Increment used skill points
        s.tokenatxors[_tokenId].usedSkillPoints += totalUsed;
        emit SpendSkillpoints(_tokenId, _values);
    }
}