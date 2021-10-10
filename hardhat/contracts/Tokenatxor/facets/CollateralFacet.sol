// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Modifiers} from "../libraries/LibAppStorage.sol";
import {LibTokenatxor, TokenatxorCollateralTypeIO} from "../libraries/LibTokenatxor.sol";
import {LibItems} from "../libraries/LibItems.sol";
import {LibERC20} from "../../shared/libraries/LibERC20.sol";
import {IERC20} from "../../shared/interfaces/IERC20.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {LibERC721} from "../../shared/libraries/LibERC721.sol";

contract CollateralFacet is Modifiers {
    event IncreaseStake(uint256 indexed _tokenId, uint256 _stakeAmount);
    event DecreaseStake(uint256 indexed _tokenId, uint256 _reduceAmount);
    event ExperienceTransfer(uint256 indexed _fromTokenId, uint256 indexed _toTokenId, uint256 experience);

    /***********************************|
   |             Read Functions         |
   |__________________________________*/

    /// @notice Query addresses about all collaterals available for a particular productoin
    /// @param _productionId identifier of the production to query
    /// @return collateralTypes_ An array containing the addresses of all collaterals available for production `_productionId`
    function collaterals(uint256 _productionId) external view returns (address[] memory collateralTypes_) {
        collateralTypes_ = s.productionCollateralTypes[_productionId];
    }

    /// @notice Query all details about a collateral in a production
    /// @param _productionId The identifier of the produciton to query
    /// @param _collateralId the identifier of the collateral to query
    ///return collateralInfo_ A struct containing extensive details about a collateral of identifier `_collateralId` in production `_productionId`            
    function collateralInfo(uint256 _productionId, uint256 _collateralId) external view returns (TokenatxorCollateralTypeIO memory collateralInfo_) {
        address collateral = s.productionCollateralTypes[_productionId][_collateralId];
        collateralInfo_ = TokenatxorCollateralTypeIO(collateral, s.collateralTypeInfo[collateral]);
        return collateralInfo_;
    }

    /// @notice Query all details about all collaterals in a production
    /// @param _productionId The identifier of the production to query
    /// return collateralInfo_ An array of structs where each struct contains extensive details about each collateral that is available in production `_productionId`
    function getCollateralInfo(uint256 _productionId) external view returns (TokenatxorCollateralTypeIO[] memory collateralInfo_) {
        address[] memory collateralTypes = s.productionCollateralTypes[_productionId];

        collateralInfo_ = new TokenatxorCollateralTypeIO[](s.productionCollateralTypes[_productionId].length);

        for (uint256 i; i < collateralTypes.length; i++) {
            address collateral = collateralTypes[i];
            collateralInfo_[i].collateralType = collateral;
            collateralInfo_[i].collateralTypeInfo = s.collateralTypeInfo[collateral];
        }
    }

    /// @notice Query the address of all collaterals that are available universally throughout all productions
    /// @return An array of addresses,each address representing a collateral's contract address
    function getAllCollateralTypes() external view returns (address[] memory) {
        return s.collateralTypes;
    }

    /// @notice Query the collateral address,balance and escrow contract of an NFT
    /// @dev Only valid for claimed aavegotchis
    /// @param _tokenId the identifier of the NFT to query
    /// @return collateralType_ The contract address of the collateral   
    /// @return escrow_ The contract address of the NFT's escrow contract
    /// @return balance_ The collateral balance of the NFT 
    function collateralBalance(uint256 _tokenId)
        external
        view
        returns (
            address collateralType_,
            address escrow_,
            uint256 balance_
        )
    {
        escrow_ = s.tokenatxors[_tokenId].escrow;
        require(escrow_ != address(0), "CollateralFacet: Does not have an escrow");
        collateralType_ = s.tokenatxors[_tokenId].collateralType;
        balance_ = IERC20(collateralType_).balanceOf(escrow_);
    }

    /***********************************|
   |             Write Functions        |
   |__________________________________*/
 
    /// @notice Allow the owner of a claimed tokenatxor to increase its collateral stake
    /// @dev Only valid for claimed tokenatxors
    /// @param _tokenId The identifier of the NFT to increase
    /// @param _stakeAmount The amount of collateral tokens to increase the current collateral by
    function increaseStake(uint256 _tokenId, uint256 _stakeAmount) external onlyTokenatxorOwner(_tokenId) {
        address escrow = s.tokenatxors[_tokenId].escrow;
        require(escrow != address(0), "CollateralFacet: Does not have an escrow");
        address collateralType = s.tokenatxors[_tokenId].collateralType;
        emit IncreaseStake(_tokenId, _stakeAmount);
        LibERC20.transferFrom(collateralType, LibMeta.msgSender(), escrow, _stakeAmount);
    }

    /// @notice Allow the owner of a claimed tokenatxor to decrease its collateral stake
    /// @dev Only valid for claimed tokenatxors
    /// @dev Will throw if it is reduced less than the minimum stake 
    /// @param _tokenId The identifier of the NFT to decrease
    /// @param _reduceAmount The amount of collateral tokens to decrease the current collateral by
    function decreaseStake(uint256 _tokenId, uint256 _reduceAmount) external onlyUnlocked(_tokenId) onlyTokenatxorOwner(_tokenId) {
        address escrow = s.tokenatxors[_tokenId].escrow;
        require(escrow != address(0), "CollateralFacet: Does not have an escrow");

        address collateralType = s.tokenatxors[_tokenId].collateralType;
        uint256 currentStake = IERC20(collateralType).balanceOf(escrow);
        uint256 minimumStake = s.tokenatxors[_tokenId].minimumStake;

        require(currentStake - _reduceAmount >= minimumStake, "CollateralFacet: Cannot reduce below minimum stake");
        emit DecreaseStake(_tokenId, _reduceAmount);
        LibERC20.transferFrom(collateralType, escrow, LibMeta.msgSender(), _reduceAmount);
    }

    /// @notice Allow the owner of an tokenatxor to destroy his aavegotchi and transfer the XP points to another aavegotchi
    /// @dev Only valid for claimed tokenatxors
    /// @dev Name assigned to destroyed tokenatxor is freed up for use by another tokenatxor
    /// @param _tokenId Identifier of NFT to destroy
    /// @param _toId Identifier of another claimed tokenatxor where the XP of the sacrificed tokenatxor will be sent
    function decreaseAndDestroy(uint256 _tokenId, uint256 _toId) external onlyUnlocked(_tokenId) onlyTokenatxorOwner(_tokenId) {
        address escrow = s.tokenatxors[_tokenId].escrow;
        require(escrow != address(0), "CollateralFacet: Does not have an escrow");

        /// If the toId is different from the tokenId, then perform an experience transfer
        if (_tokenId != _toId) {
            uint256 experience = s.tokenatxors[_tokenId].experience;
            emit ExperienceTransfer(_tokenId, _toId, experience);
            s.tokenatxors[_toId].experience += experience;
        }

        /// remove
        s.tokenatxors[_tokenId].owner = address(0);
        address owner = LibMeta.msgSender();
        uint256 index = s.ownerTokenIdIndexes[owner][_tokenId];
        uint256 lastIndex = s.ownerTokenIds[owner].length - 1;
        if (index != lastIndex) {
            uint32 lastTokenId = s.ownerTokenIds[owner][lastIndex];
            s.ownerTokenIds[owner][index] = lastTokenId;
            s.ownerTokenIdIndexes[owner][lastTokenId] = index;
        }
        s.ownerTokenIds[owner].pop();
        delete s.ownerTokenIdIndexes[owner][_tokenId];

        // delete token approval if any
        if (s.approved[_tokenId] != address(0)) {
            delete s.approved[_tokenId];
            emit LibERC721.Approval(owner, address(0), _tokenId);
        }

        emit LibERC721.Transfer(owner, address(0), _tokenId);

        // transfer all collateral to LibMeta.msgSender()
        address collateralType = s.tokenatxors[_tokenId].collateralType;
        uint256 reduceAmount = IERC20(collateralType).balanceOf(escrow);
        emit DecreaseStake(_tokenId, reduceAmount);
        LibERC20.transferFrom(collateralType, escrow, owner, reduceAmount);

        // delete tokenatxor info
        string memory name = s.tokenatxors[_tokenId].name;
        if (bytes(name).length > 0) {
            delete s.tokenatxorNamesUsed[LibTokenatxor.validateAndLowerName(name)];
        }
        delete s.tokenatxors[_tokenId];
    }

    /// @notice Set the SVG id for a supported/existing collateral
    /// @param _collateralToken The contract address for the collateral token
    /// @param _svgId The identifier for the onchain svg to be mapped to the collateral
    function setCollateralExpressionSvgId(address _collateralToken, uint8 _svgId) external onlyDaoOrOwner {
        s.collateralTypeInfo[_collateralToken].expressionSvgId = _svgId;
    }
}