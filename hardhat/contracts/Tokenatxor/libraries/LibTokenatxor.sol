// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {IERC20} from '../../shared/interfaces/IERC20.sol';
import {LibAppStorage, TokenatxorCollateralTypeInfo, AppStorage, Tokenatxor, ItemType, NUMERIC_TRAITS_NUM, EQUIPPED_SLOTS, PRODUCTION_TOKENATXORS_NUM} from './LibAppStorage.sol';
import {LibERC20} from '../../shared/libraries/LibERC20.sol';
import {LibMeta} from '../../shared/libraries/LibMeta.sol';
import {IERC721} from '../../shared/interfaces/IERC721.sol';
import {LibERC721} from '../../shared/libraries/LibERC721.sol';
import {LibItems, ItemTypeIO} from '../libraries/LibItems.sol';

struct TokenatxorCollateralTypeIO {
    address collateralType;
    TokenatxorCollateralTypeInfo collateralTypeInfo;
}

struct TokenatxorInfo {
    uint256 tokenId;
    string name;
    address owner;
    uint256 randomNumber;
    uint256 status;
    int16[NUMERIC_TRAITS_NUM] numericTraits;
    int16[NUMERIC_TRAITS_NUM] modifiedNumericTraits;
    uint16[EQUIPPED_SLOTS] equippedEquippables;
    address collateral;
    address escrow;
    uint256 stakedAmount;
    uint256 minimumStake;
    uint wisdom; // Default value is 50
    uint256 lastInteracted;
    uint256 experience; // How much XP this NFT has accrued. Begins at 0.
    uint256 toNextPowerLevel;
    uint256 usedSkillPoints; // or Skill points used
    uint256 powerLevel;
    uint256 productionId;
    uint256 baseRarityScore;
    uint256 modifiedRarityScore;
    bool locked;
    ItemTypeIO[] items;
}

struct ProductionTokenatxorTraitsIO {
    uint256 randomNumber;
    int16[NUMERIC_TRAITS_NUM] numericTraits;
    address collateralType;
    uint256 minimumStake;
}

struct InternalProductionTokenatxorTraitsIO {
    uint256 randomNumber;
    int16[NUMERIC_TRAITS_NUM] numericTraits;
    address collateralType;
    uint256 minimumStake;
}

library LibTokenatxor {
     uint8 constant STATUS_CLOSED_PRODUCTION = 0;
     uint8 constant STATUS_VRF_PENDING = 1;
     uint8 constant STATUS_OPEN_PRODUCTION = 2;
     uint8 constant STATUS_TOKENATXOR = 3;

    event TokenatxorInteract(uint256 indexed _tokenId, uint256 wisdom);

    function toNumericTraits(uint256 _randomNumber, int16[NUMERIC_TRAITS_NUM] memory _modifiers, uint256 _productionId)
        internal
        pure
        returns (int16[NUMERIC_TRAITS_NUM] memory numericTraits_)
    {
        if (_productionId == 1) {
            for (uint256 i; i < NUMERIC_TRAITS_NUM; i++) {
                uint256 value = uint8(uint256(_randomNumber >> (i * 8)));
                if (value > 99) {
                    value /= 2;
                    if (value > 99) {
                        value = uint256(keccak256(abi.encodePacked(_randomNumber, i))) % 100;
                    }
                }
                numericTraits_[i] = int16(int256(value)) + _modifiers[i];
            }
        } else {
            for (uint256 i; i < NUMERIC_TRAITS_NUM; i++) {
                uint256 value = uint8(uint256(_randomNumber >> (i * 8)));
                if (value > 99) {
                    value = value - 100;
                    if (value > 99) {
                        value = uint256(keccak256(abi.encodePacked(_randomNumber, i))) % 100;
                    }
                }
                numericTraits_[i] = int16(int256(value)) + _modifiers[i];
            }
        }
    }

    function rarityMultiplier(int16[NUMERIC_TRAITS_NUM] memory _numericTraits)
        internal
        pure
        returns (uint256 multiplier) 
    {
        uint256 rarityScore = LibTokenatxor.baseRarityScore(_numericTraits);
        if (rarityScore < 300) return 10;
        else if (rarityScore >= 300 && rarityScore < 450) return 10;
        else if (rarityScore >= 450 && rarityScore <= 525) return 25;
        else if (rarityScore >= 526 && rarityScore <= 580) return 100;
        else if (rarityScore >= 581) return 1000;
    }

    function singleProductionTokenatxorTraits(
        uint256 _productionId,
        uint256 _randomNumber,
        uint256 _option
    ) 
        internal
        view
        returns (InternalProductionTokenatxorTraitsIO memory singleProductionTokenatxorTraits_) 
    {
        AppStorage storage s = LibAppStorage.diamondStorage();
        uint256 randomNumberN = uint256(keccak256(abi.encodePacked(_randomNumber, _option)));
        singleProductionTokenatxorTraits_.randomNumber = randomNumberN;

        address collateralType = s.productionCollateralTypes[_productionId][randomNumberN % s.productionCollateralTypes[_productionId].length];
        singleProductionTokenatxorTraits_.numericTraits = toNumericTraits(randomNumberN, s.collateralTypeInfo[collateralType].modifiers, _productionId);
        singleProductionTokenatxorTraits_.collateralType = collateralType;

        TokenatxorCollateralTypeInfo memory collateralInfo = s.collateralTypeInfo[collateralType];
        uint256 conversionRate = collateralInfo.conversionRate;

        //Get rarity multiplier
        uint256 multiplier = rarityMultiplier(singleProductionTokenatxorTraits_.numericTraits);

        //First we get the base price of our collateral in terms of DAI
        uint256 collateralDAIPrice = ((10**IERC20(collateralType).decimals()) / conversionRate);

        //Then multiply by the rarity multiplier
        singleProductionTokenatxorTraits_.minimumStake = collateralDAIPrice * multiplier;
    }

    function productionTokenatxorTraits(uint256 _tokenId)
        internal
        view
        returns (ProductionTokenatxorTraitsIO[PRODUCTION_TOKENATXORS_NUM] memory productionTokenatxorTraits_)
    {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.tokenatxors[_tokenId].status == LibTokenatxor.STATUS_OPEN_PRODUCTION, "TokenatxorFacet: Production not open");

        uint256 randomNumber = s.tokenIdToRandomNumber[_tokenId];

        uint256 productionId = s.tokenatxors[_tokenId].productionId;

        for (uint256 i; i < productionTokenatxorTraits_.length; i++) {
            InternalProductionTokenatxorTraitsIO memory single = singleProductionTokenatxorTraits(productionId, randomNumber, i);
            productionTokenatxorTraits_[i].randomNumber = single.randomNumber;
            productionTokenatxorTraits_[i].collateralType = single.collateralType;
            productionTokenatxorTraits_[i].minimumStake = single.minimumStake;
            productionTokenatxorTraits_[i].numericTraits = single.numericTraits;
        }
    }

    function getTokenatxor(uint256 _tokenId) internal view returns (TokenatxorInfo memory tokenatxorInfo_) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        tokenatxorInfo_.tokenId = _tokenId;
        tokenatxorInfo_.owner = s.tokenatxors[_tokenId].owner;
        tokenatxorInfo_.randomNumber = s.tokenatxors[_tokenId].randomNumber;
        tokenatxorInfo_.status = s.tokenatxors[_tokenId].status;
        tokenatxorInfo_.productionId = s.tokenatxors[_tokenId].productionId;
        if (tokenatxorInfo_.status == STATUS_TOKENATXOR) {
            tokenatxorInfo_.name = s.tokenatxors[_tokenId].name;
            tokenatxorInfo_.equippedEquippables = s.tokenatxors[_tokenId].equippedEquippables;
            tokenatxorInfo_.collateral = s.tokenatxors[_tokenId].collateralType;
            tokenatxorInfo_.escrow = s.tokenatxors[_tokenId].escrow;
            tokenatxorInfo_.stakedAmount = IERC20(tokenatxorInfo_.collateral).balanceOf(tokenatxorInfo_.escrow);
            tokenatxorInfo_.minimumStake = s.tokenatxors[_tokenId].minimumStake;
            tokenatxorInfo_.wisdom = wisdom(_tokenId);
            tokenatxorInfo_.lastInteracted = s.tokenatxors[_tokenId].lastInteracted;
            tokenatxorInfo_.experience = s.tokenatxors[_tokenId].experience;
            tokenatxorInfo_.toNextPowerLevel = xpUntilNextPowerLevel(s.tokenatxors[_tokenId].experience);
            tokenatxorInfo_.powerLevel = tokenatxorPowerLevel(s.tokenatxors[_tokenId].experience);
            tokenatxorInfo_.usedSkillPoints = s.tokenatxors[_tokenId].usedSkillPoints;
            tokenatxorInfo_.numericTraits = s.tokenatxors[_tokenId].numericTraits;
            tokenatxorInfo_.baseRarityScore = baseRarityScore(tokenatxorInfo_.numericTraits);
            (tokenatxorInfo_.modifiedNumericTraits, tokenatxorInfo_.modifiedRarityScore) = modifiedTraitsAndRarityScore(_tokenId);
            tokenatxorInfo_.locked = s.tokenatxors[_tokenId].locked;
            tokenatxorInfo_.items = LibItems.itemBalancesOfTokenWithTypes(address(this), _tokenId);
        }
    }

    //Only valid for claimed tokenatxors
    function modifiedTraitsAndRarityScore(uint256 _tokenId)
        internal
        view
        returns (int16[NUMERIC_TRAITS_NUM] memory numericTraits_, uint256 rarityScore_)
    {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.tokenatxors[_tokenId].status == STATUS_TOKENATXOR, "TokenatxorFacet: Must be claimed");
        Tokenatxor storage tokenatxor = s.tokenatxors[_tokenId];
        numericTraits_ = getNumericTraits(_tokenId);
        uint256 equippableBonus;
        for (uint256 slot; slot < EQUIPPED_SLOTS; slot++) {
            uint256 equippableId = tokenatxor.equippedEquippables[slot];
            if (equippableId == 0) {
                continue;
            }
            ItemType storage itemType = s.itemTypes[equippableId];
            //Add on trait modifiers
            for (uint256 j; j < NUMERIC_TRAITS_NUM; j++) {
                numericTraits_[j] += itemType.traitModifiers[j];
            }
            equippableBonus += itemType.rarityScoreModifier;
        }
        uint256 baseRarity = baseRarityScore(numericTraits_);
        rarityScore_ = baseRarity + equippableBonus;
    }

    function getNumericTraits(uint256 _tokenId) internal view returns (int16[NUMERIC_TRAITS_NUM] memory numericTraits_) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        //Check if trait boosts from consumables are still valid
        int256 boostDecay = int256((block.timestamp - s.tokenatxors[_tokenId].lastTemporaryBoost) / 24 hours);
        for (uint256 i; i < NUMERIC_TRAITS_NUM; i++) {
            int256 number = s.tokenatxors[_tokenId].numericTraits[i];
            int256 boost = s.tokenatxors[_tokenId].temporaryTraitBoosts[i];

            if (boost > 0 && boost > boostDecay) {
                number += boost - boostDecay;
            } else if ((boost * -1) > boostDecay) {
                number += boost + boostDecay;
            }
            numericTraits_[i] = int16(number);
        }
    }

    function wisdom(uint256 _tokenId) internal view returns (uint256 score_) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        Tokenatxor storage tokenatxor = s.tokenatxors[_tokenId];
        uint256 lastInteracted = tokenatxor.lastInteracted;
        uint256 interactionCount = tokenatxor.interactionCount;
        uint256 interval = block.timestamp - lastInteracted;

        uint256 daysSinceInteraction = interval / 24 hours;

        if (interactionCount > daysSinceInteraction) {
            score_ = interactionCount - daysSinceInteraction;
        }
    }

    function xpUntilNextPowerLevel(uint256 _experience) internal pure returns (uint256 requiredXp_) {
        uint256 currentPowerLevel = tokenatxorPowerLevel(_experience);
        requiredXp_ = ((currentPowerLevel**2) * 50) - _experience;
    }

    function tokenatxorPowerLevel(uint256 _experience) internal pure returns (uint256 powerLevel_) {
        if (_experience > 490050) {
            return 99;
        }

        powerLevel_ = (sqrt(2 * _experience) / 10);
        return powerLevel_ + 1;
    }

    function interact(uint256 _tokenId) internal returns (bool) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        uint256 lastInteracted = s.tokenatxors[_tokenId].lastInteracted;
        // if interacted less than 12 hours ago
        if (block.timestamp < lastInteracted + 12 hours) {
            return false;
        }

        uint256 interactionCount = s.tokenatxors[_tokenId].interactionCount;
        uint256 interval = block.timestamp - lastInteracted;
        uint256 daysSinceInteraction = interval / 1 days;
        uint256 l_wisdom;
        if (interactionCount > daysSinceInteraction) {
            l_wisdom = interactionCount - daysSinceInteraction;
        }

        uint256 hateBonus;

        if (l_wisdom < 40) {
            hateBonus = 2;
        }
        l_wisdom += 1 + hateBonus;
        s.tokenatxors[_tokenId].interactionCount = l_wisdom;

        s.tokenatxors[_tokenId].lastInteracted = uint40(block.timestamp);
        emit TokenatxorInteract(_tokenId, l_wisdom);
        return true;
    }

    //Calculates the base rarity score, including collateral modifier
    function baseRarityScore(int16[NUMERIC_TRAITS_NUM] memory _numericTraits) internal pure returns (uint256 _rarityScore) {
        for (uint256 i; i < NUMERIC_TRAITS_NUM; i++) {
            int256 number = _numericTraits[i];
            if (number >= 50) {
                _rarityScore += uint256(number) + 1;
            } else {
                _rarityScore += uint256(int256(100) - number);
            }
        }
    }

    // Need to ensure there is no overflow of _tktr
    function purchase(address _from, uint256 _tktr) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();
        //33% to burn address
        uint256 burnShare = (_tktr * 33) / 100;

        //17% to artists wallet
        uint256 companyShare = (_tktr * 17) / 100;

        //40% to rarity farming rewards
        uint256 rarityFarmShare = (_tktr * 2) / 5;

        //10% to DAO
        uint256 daoShare = (_tktr - burnShare - companyShare - rarityFarmShare);

        // Using 0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF as burn address.
        // TKTR token contract does not allow transferring to address(0) address: https://etherscan.io/address/0x3F382DbD960E3a9bbCeaE22651E88158d2791550#code
        address tktrContract = s.tktrContract;
        LibERC20.transferFrom(tktrContract, _from, address(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF), burnShare);
        LibERC20.transferFrom(tktrContract, _from, s.artists, companyShare);
        LibERC20.transferFrom(tktrContract, _from, s.rarityFarming, rarityFarmShare);
        LibERC20.transferFrom(tktrContract, _from, s.dao, daoShare);
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function validateAndLowerName(string memory _name) internal pure returns (string memory) {
        bytes memory name = abi.encodePacked(_name);
        uint256 len = name.length;
        require(len != 0, "LibTokenatxor: name can't be 0 chars");
        require(len < 26, "LibTokenatxor: name can't be greater than 25 characters");
        uint256 char = uint256(uint8(name[0]));
        require(char != 32, "LibTokenatxor: first char of name can't be a space");
        char = uint256(uint8(name[len - 1]));
        require(char != 32, "LibTokenatxor: last char of name can't be a space");
        for (uint256 i; i < len; i++) {
            char = uint256(uint8(name[i]));
            require(char > 31 && char < 127, "LibTokenatxor: invalid character in Tokenatxor name.");
            if (char < 91 && char > 64) {
                name[i] = bytes1(uint8(char + 32));
            }
        }
        return string(name);
    }

    function transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();
        // remove
        uint256 index = s.ownerTokenIdIndexes[_from][_tokenId];
        uint256 lastIndex = s.ownerTokenIds[_from].length - 1;
        if (index != lastIndex) {
            uint32 lastTokenId = s.ownerTokenIds[_from][lastIndex];
            s.ownerTokenIds[_from][index] = lastTokenId;
            s.ownerTokenIdIndexes[_from][lastTokenId] = index;
        }
        s.ownerTokenIds[_from].pop();
        delete s.ownerTokenIdIndexes[_from][_tokenId];
        if (s.approved[_tokenId] != address(0)) {
            delete s.approved[_tokenId];
            emit LibERC721.Approval(_from, address(0), _tokenId);
        }
        // add
        s.tokenatxors[_tokenId].owner = _to;
        s.ownerTokenIdIndexes[_to][_tokenId] = s.ownerTokenIds[_to].length;
        s.ownerTokenIds[_to].push(uint32(_tokenId));
        emit LibERC721.Transfer(_from, _to, _tokenId);
    }
}