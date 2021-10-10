// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {AppStorage, SvgLayer, Dimensions} from "../libraries/LibAppStorage.sol";
import {LibTokenatxor, ProductionTokenatxorTraitsIO, EQUIPPED_SLOTS, PRODUCTION_TOKENATXORS_NUM, NUMERIC_TRAITS_NUM} from "../libraries/LibTokenatxor.sol";
import {LibItems} from "../libraries/LibItems.sol";
import {Modifiers, ItemType} from "../libraries/LibAppStorage.sol";
import {LibSvg} from "../libraries/LibSvg.sol";
import {LibStrings} from "../../shared/libraries/LibStrings.sol";

contract SvgFacet is Modifiers {
    /***********************************|
   |             Read Functions         |
   |__________________________________*/

    /// @notice Given a tokenatxor token id, return the combined SVG of its layers and its equippables
    /// @param _tokenId the identifier of the token to query
    /// @return tr_ The final svg which contains the combined SVG of its layers and its equippables
    function getTokenatxorSvg(uint256 _tokenId) public view returns (string memory tr_) {
        require(s.tokenatxors[_tokenId].owner != address(0), "SvgFacet: _tokenId does not exist");

        bytes memory svg;
        uint8 status = s.tokenatxors[_tokenId].status;
        uint256 productionId = s.tokenatxors[_tokenId].productionId;
        if (status == LibTokenatxor.STATUS_CLOSED_PRODUCTION) {
            // sealed closed production
            svg = LibSvg.getSvg("production-closed", productionId);
        } else if (status == LibTokenatxor.STATUS_OPEN_PRODUCTION) {
            // open production
            svg = LibSvg.getSvg("production-open", productionId);
        } else if (status == LibTokenatxor.STATUS_TOKENATXOR) {
            address collateralType = s.tokenatxors[_tokenId].collateralType;
            svg = getTokenatxorSvgLayers(collateralType, s.tokenatxors[_tokenId].numericTraits, _tokenId, productionId);
        }
        tr_ = string(abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">', svg, "</svg>"));
    }

    struct SvgLayerDetails {
        string primaryColor;
        string secondaryColor;
        string cheekColor;
        bytes collateral;
        int256 trait;
        int256[18] expressionTraitRange;
        bytes expression;
        string eyeColor;
        int256[8] eyeColorTraitRanges;
        string[7] eyeColors;
    }

    function getTokenatxorSvgLayers(
        address _collateralType,
        int16[NUMERIC_TRAITS_NUM] memory _numericTraits,
        uint256 _tokenId,
        uint256 _productionId
    ) internal view returns (bytes memory svg_) {
        SvgLayerDetails memory details;
        details.primaryColor = LibSvg.bytes3ToColorString(s.collateralTypeInfo[_collateralType].primaryColor);
        details.secondaryColor = LibSvg.bytes3ToColorString(s.collateralTypeInfo[_collateralType].secondaryColor);
        details.cheekColor = LibSvg.bytes3ToColorString(s.collateralTypeInfo[_collateralType].cheekColor);

        /// tokenatxor body
        svg_ = LibSvg.getSvg("tokenatxor", LibSvg.TOKENATXOR_BODY_SVG_ID);
        details.collateral = LibSvg.getSvg("collaterals", s.collateralTypeInfo[_collateralType].svgId);

        bytes32 expressionSvgType = "expressions";
        if (_productionId != 1) {
            // Convert Produciton into string to match the uploaded category name
            bytes memory production = abi.encodePacked(LibSvg.uint2str(_productionId));
            expressionSvgType = LibSvg.bytesToBytes32(abi.encodePacked("expressionsH"), production);
        }

        details.trait = _numericTraits[4];

        if (details.trait < 0) {
            details.expression = LibSvg.getSvg(expressionSvgType, 0);
        } else if (details.trait > 97) {
            details.expression = LibSvg.getSvg(expressionSvgType, s.collateralTypeInfo[_collateralType].expressionSvgId);
        } else {
            details.expressionTraitRange = [int256(0), 1, 2, 5, 7, 10, 15, 20, 25, 42, 58, 75, 80, 85, 90, 93, 95, 98];
            for (uint256 i; i < details.expressionTraitRange.length - 1; i++) {
                if (details.trait >= details.expressionTraitRange[i] && details.trait < details.expressionTraitRange[i + 1]) {
                    details.expression = LibSvg.getSvg(expressionSvgType, i);
                    break;
                }
            }
        }

        details.trait = _numericTraits[5];
        details.eyeColorTraitRanges = [int256(0), 2, 10, 25, 75, 90, 98, 100];
        details.eyeColors = [
            "FF00FF", /// mythical_low
            "0064FF", /// rare_low
            "5D24BF", /// uncommon_low
            details.primaryColor, /// common
            "36818E", /// uncommon_high
            "EA8C27", /// rare_high
            "51FFA8" /// mythical_high
        ];
        if (details.trait < 0) {
            details.eyeColor = "FF00FF";
        } else if (details.trait > 99) {
            details.eyeColor = "51FFA8";
        } else {
            for (uint256 i; i < details.eyeColorTraitRanges.length - 1; i++) {
                if (details.trait >= details.eyeColorTraitRanges[i] && details.trait < details.eyeColorTraitRanges[i + 1]) {
                    details.eyeColor = details.eyeColors[i];
                    break;
                }
            }
        }

        /// Load in all the equipped equippables
        uint16[EQUIPPED_SLOTS] memory equippedEquippables = s.tokenatxors[_tokenId].equippedEquippables;

        /// Token ID is uint256 max: used for Production Tokenatxors to close hands
        if (_tokenId == type(uint256).max) {
            svg_ = abi.encodePacked(
                applyStyles(details, _tokenId, equippedEquippables),
                LibSvg.getSvg("tokenatxor", LibSvg.BACKGROUND_SVG_ID),
                svg_,
                details.collateral,
                details.expression
            );
        }
        /// Token ID is uint256 max - 1: used for Tokentxr previews to open hands
        else if (_tokenId == type(uint256).max - 1) {
            equippedEquippables[0] = 1;
            svg_ = abi.encodePacked(
                applyStyles(details, _tokenId, equippedEquippables),
                LibSvg.getSvg("tokenatxor", LibSvg.BACKGROUND_SVG_ID),
                svg_,
                details.collateral,
                details.expression
            );

            /// Normal token ID
        } else {
            svg_ = abi.encodePacked(applyStyles(details, _tokenId, equippedEquippables), svg_, details.collateral, details.expression);
            svg_ = addBodyAndEquippableSvgLayers(svg_, equippedEquippables);
        }
    }

    /// Apply styles based on the traits and equippables
    function applyStyles(
        SvgLayerDetails memory _details,
        uint256 _tokenId,
        uint16[EQUIPPED_SLOTS] memory equippedEquippables
    ) internal pure returns (bytes memory) {
        if (
            _tokenId != type(uint256).max &&
            (equippedEquippables[LibItems.EQUIPPABLE_SLOT_BODY] != 0 ||
                equippedEquippables[LibItems.EQUIPPABLE_SLOT_HAND_LEFT] != 0 ||
                equippedEquippables[LibItems.EQUIPPABLE_SLOT_HAND_RIGHT] != 0)
        ) {
            /// Open-hands tokenatxor
            return
                abi.encodePacked(
                    "<style>.tokentxr-primary{fill:#",
                    _details.primaryColor,
                    ";}.tokentxr-secondary{fill:#",
                    _details.secondaryColor,
                    ";}.tokentxr-cheek{fill:#",
                    _details.cheekColor,
                    ";}.tokentxr-eyeColor{fill:#",
                    _details.eyeColor,
                    ";}.tokentxr-primary-mouth{fill:#",
                    _details.primaryColor,
                    ";}.tokentxr-sleeves-up{display:none;}",
                    ".tokentxr-handsUp{display:none;}",
                    ".tokentxr-handsDownOpen{display:block;}",
                    ".tokentxr-handsDownClosed{display:none;}",
                    "</style>"
                );
        } else {
            /// Normal Tokenatxor, closed hands
            return
                abi.encodePacked(
                    "<style>.tokentxr-primary{fill:#",
                    _details.primaryColor,
                    ";}.tokentxr-secondary{fill:#",
                    _details.secondaryColor,
                    ";}.tokentxr-cheek{fill:#",
                    _details.cheekColor,
                    ";}.tokentxr-eyeColor{fill:#",
                    _details.eyeColor,
                    ";}.tokentxr-primary-mouth{fill:#",
                    _details.primaryColor,
                    ";}.tokentxr-sleeves-up{display:none;}",
                    ".tokentxr-handsUp{display:none;}",
                    ".tokentxr-handsDownOpen{display:none;}",
                    ".tokentxr-handsDownClosed{display:block}",
                    "</style>"
                );
        }
    }

    function getEquippableClass(uint256 _slotPosition) internal pure returns (string memory className_) {
        /// Equippables
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_BODY) className_ = "equippable-body";
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_FACE) className_ = "equippable-face";
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_EYES) className_ = "equippable-eyes";
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_HEAD) className_ = "equippable-head";
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_HAND_LEFT) className_ = "equippable-hand equippable-hand-left";
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_HAND_RIGHT) className_ = "equippable-hand equippable-hand-right";
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_PET) className_ = "equippable-pet";
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_BG) className_ = "equippable-bg";
    }

    function getBodyEquippable(uint256 _equippableId) internal view returns (bytes memory bodyEquippable_, bytes memory sleeves_) {
        ItemType storage equippableType = s.itemTypes[_equippableId];
        Dimensions memory dimensions = equippableType.dimensions;

        bodyEquippable_ = abi.encodePacked(
            '<g class="tokentxr-equippable equippable-body',
            /// x
            LibStrings.strWithUint('"><svg x="', dimensions.x),
            /// y
            LibStrings.strWithUint('" y="', dimensions.y),
            '">',
            LibSvg.getSvg("equippables", equippableType.svgId),
            "</svg></g>"
        );
        uint256 svgId = s.sleeves[_equippableId];
        if (svgId != 0) {
            sleeves_ = abi.encodePacked(
                /// x
                LibStrings.strWithUint('"><svg x="', dimensions.x),
                /// y
                LibStrings.strWithUint('" y="', dimensions.y),
                '">',
                LibSvg.getSvg("sleeves", svgId),
                "</svg>"
            );
        }
    }

    function getEquippable(uint256 _equippableId, uint256 _slotPosition) internal view returns (bytes memory svg_) {
        ItemType storage equippableType = s.itemTypes[_equippableId];
        Dimensions memory dimensions = equippableType.dimensions;

        string memory equippableClass = getEquippableClass(_slotPosition);

        svg_ = abi.encodePacked(
            '<g class="tokentxr-equippable ',
            equippableClass,
            /// x
            LibStrings.strWithUint('"><svg x="', dimensions.x),
            /// y
            LibStrings.strWithUint('" y="', dimensions.y),
            '">'
        );
        if (_slotPosition == LibItems.EQUIPPABLE_SLOT_HAND_RIGHT) {
            svg_ = abi.encodePacked(
                svg_,
                LibStrings.strWithUint('<g transform="scale(-1, 1) translate(-', 64 - (dimensions.x * 2)),
                ', 0)">',
                LibSvg.getSvg("equippables", equippableType.svgId),
                "</g></svg></g>"
            );
        } else {
            svg_ = abi.encodePacked(svg_, LibSvg.getSvg("equippables", equippableType.svgId), "</svg></g>");
        }
    }

    struct TokenatxorLayers {
        bytes background;
        bytes bodyEquippable;
        bytes hands;
        bytes face;
        bytes eyes;
        bytes head;
        bytes sleeves;
        bytes handLeft;
        bytes handRight;
        bytes pet;
    }

    /// @notice Allow the preview of an tokenatxor given the production id,a set of traits, equippables and collateral type
    /// @param _productionId Production id to use in preview /
    /// @param _collateralType The type of collateral to use
    /// @param _numericTraits The numeric traits to use for the aavegotchi
    /// @param equippedEquippables The set of wearables to wear for the aavegotchi
    /// @return tr_ The final svg string being generated based on the given test parameters
    function previewTokenatxor(
        uint256 _productionId,
        address _collateralType,
        int16[NUMERIC_TRAITS_NUM] memory _numericTraits,
        uint16[EQUIPPED_SLOTS] memory equippedEquippables
    ) external view returns (string memory tr_) {
        // Get base body layers
        bytes memory svg_ = getTokenatxorSvgLayers(_collateralType, _numericTraits, type(uint256).max - 1, _productionId);

        /// Add on body equippables
        svg_ = abi.encodePacked(addBodyAndEquippableSvgLayers(svg_, equippedEquippables));

        /// Encode
        tr_ = string(abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">', svg_, "</svg>"));
    }

    function addBodyAndEquippableSvgLayers(bytes memory _body, uint16[EQUIPPED_SLOTS] memory equippedEquippables)
        internal
        view
        returns (bytes memory svg_)
    {
        TokenatxorLayers memory layers;

        // If background is equipped
        uint256 equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_BG];
        if (equippableId != 0) {
            layers.background = getEquippable(equippableId, LibItems.EQUIPPABLE_SLOT_BG);
        } else {
            layers.background = LibSvg.getSvg("tokenatxor", 4);
        }

        equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_BODY];
        if (equippableId != 0) {
            (layers.bodyEquippable, layers.sleeves) = getBodyEquippable(equippableId);
        }

        /// get hands
        layers.hands = abi.encodePacked(svg_, LibSvg.getSvg("tokenatxor", LibSvg.HANDS_SVG_ID));

        equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_FACE];
        if (equippableId != 0) {
            layers.face = getEquippable(equippableId, LibItems.EQUIPPABLE_SLOT_FACE);
        }

        equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_EYES];
        if (equippableId != 0) {
            layers.eyes = getEquippable(equippableId, LibItems.EQUIPPABLE_SLOT_EYES);
        }

        equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_HEAD];
        if (equippableId != 0) {
            layers.head = getEquippable(equippableId, LibItems.EQUIPPABLE_SLOT_HEAD);
        }

        equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_HAND_LEFT];
        if (equippableId != 0) {
            layers.handLeft = getEquippable(equippableId, LibItems.EQUIPPABLE_SLOT_HAND_LEFT);
        }

        equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_HAND_RIGHT];
        if (equippableId != 0) {
            layers.handRight = getEquippable(equippableId, LibItems.EQUIPPABLE_SLOT_HAND_RIGHT);
        }

        equippableId = equippedEquippables[LibItems.EQUIPPABLE_SLOT_PET];
        if (equippableId != 0) {
            layers.pet = getEquippable(equippableId, LibItems.EQUIPPABLE_SLOT_PET);
        }

        /// 1. Background equippable
        /// 2. Body
        /// 3. Body equippable
        /// 4. Hands
        /// 5. Face
        /// 6. Eyes
        /// 7. Head
        /// 8. Sleeves of body equippable
        /// 9. Left hand equippable
        /// 10. Right hand equippable
        /// 11. Pet equippable
        svg_ = abi.encodePacked(layers.background, _body, layers.bodyEquippable);
        svg_ = abi.encodePacked(
            svg_,
            layers.hands,
            layers.face,
            layers.eyes,
            layers.head,
            layers.sleeves,
            layers.handLeft,
            layers.handRight,
            layers.pet
        );
    }

    /// @notice Query the svg data for all tokenatxors with the productions as bg (10 in total)
    /// @dev This is only valid for opened and unclaimed productions
    /// @param _tokenId the identifier of the NFT(opened productions)
    /// @return svg_ An array containing the svg strings for each of the tokenatxors inside the production //10 in total
    function productionlTokenatxorsSvg(uint256 _tokenId) external view returns (string[PRODUCTION_TOKENATXORS_NUM] memory svg_) {
        require(s.tokenatxors[_tokenId].status == LibTokenatxor.STATUS_OPEN_PRODUCTION, "TokenatxorFacet: Production not open");

        uint256 productionId = s.tokenatxors[_tokenId].productionId;
        ProductionTokenatxorTraitsIO[PRODUCTION_TOKENATXORS_NUM] memory l_productionTokenatxorTraits = LibTokenatxor.productionTokenatxorTraits(_tokenId);
        for (uint256 i; i < svg_.length; i++) {
            address collateralType = l_productionTokenatxorTraits[i].collateralType;
            svg_[i] = string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
                    getTokenatxorSvgLayers(collateralType, l_productionTokenatxorTraits[i].numericTraits, type(uint256).max, productionId),
                    // get hands
                    LibSvg.getSvg("aavegotchi", 3),
                    "</svg>"
                )
            );
        }
    }

    /// @notice Query the svg data for a particular item
    /// @dev Will throw if that item does not exist
    /// @param _svgType the type of svg
    /// @param _itemId The identifier of the item to query
    /// @return svg_ The svg string for the item
    function getSvg(bytes32 _svgType, uint256 _itemId) external view returns (string memory svg_) {
        svg_ = string(LibSvg.getSvg(_svgType, _itemId));
    }

    /// @notice Query the svg data for a multiple items of the same type
    /// @dev Will throw if one of the items does not exist
    /// @param _svgType The type of svg
    /// @param _itemIds The identifiers of the items to query
    /// @return svgs_ An array containing the svg strings for each item queried
    function getSvgs(bytes32 _svgType, uint256[] calldata _itemIds) external view returns (string[] memory svgs_) {
        uint256 length = _itemIds.length;
        svgs_ = new string[](length);
        for (uint256 i; i < length; i++) {
            svgs_[i] = string(LibSvg.getSvg(_svgType, _itemIds[i]));
        }
    }

    /// @notice Query the svg data for a particular item (with dimensions)
    /// @dev Will throw if that item does not exist
    /// @param _itemId The identifier of the item to query
    /// @return tr_ The svg string for the item
    function getItemSvg(uint256 _itemId) external view returns (string memory tr_) {
        require(_itemId < s.itemTypes.length, "ItemsFacet: _id not found for item");
        bytes memory svg;
        svg = LibSvg.getSvg("equippables", _itemId);
        // uint256 dimensions = s.itemTypes[_itemId].dimensions;
        Dimensions storage dimensions = s.itemTypes[_itemId].dimensions;
        tr_ = string(
            abi.encodePacked(
                /// width
                LibStrings.strWithUint('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ', dimensions.width),
                /// height
                LibStrings.strWithUint(" ", dimensions.height),
                '">',
                svg,
                "</svg>"
            )
        );
    }

    /***********************************|
   |             Write Functions        |
   |__________________________________*/

    /// @notice Allow an item manager to store a new  svg
    /// @param _svg the new svg string
    /// @param _typesAndSizes An array of structs, each struct containing the types and sizes data for `_svg`
    function storeSvg(string calldata _svg, LibSvg.SvgTypeAndSizes[] calldata _typesAndSizes) external onlyItemManager {
        LibSvg.storeSvg(_svg, _typesAndSizes);
    }

    /// @notice Allow an item manager to update an existing svg
    /// @param _svg the new svg string
    /// @param _typesAndIdsAndSizes An array of structs, each struct containing the types,identifier and sizes data for `_svg`
    function updateSvg(string calldata _svg, LibSvg.SvgTypeAndIdsAndSizes[] calldata _typesAndIdsAndSizes) external onlyItemManager {
        LibSvg.updateSvg(_svg, _typesAndIdsAndSizes);
    }

    /// @notice Allow  an item manager to delete the svg layers of an svg
    /// @param _svgType The type of svg
    /// @param _numLayers The number of layers to delete (from the last one)
    function deleteLastSvgLayers(bytes32 _svgType, uint256 _numLayers) external onlyItemManager {
        for (uint256 i; i < _numLayers; i++) {
            s.svgLayers[_svgType].pop();
        }
    }

    struct Sleeve {
        uint256 sleeveId;
        uint256 equippableId;
    }

    /// @notice Allow  an item manager to set the sleeves of multiple items at once
    /// @dev each sleeve in `_sleeves` already contains the `_itemId` to apply to
    /// @param _sleeves An array of structs,each struct containing details about the new sleeves of each item `
    function setSleeves(Sleeve[] calldata _sleeves) external onlyItemManager {
        for (uint256 i; i < _sleeves.length; i++) {
            s.sleeves[_sleeves[i].equippableId] = _sleeves[i].sleeveId;
        }
    }

    /// @notice Allow  an item manager to set the dimensions of multiple items at once
    /// @param _itemIds The identifiers of the items whose dimensions are to be set
    /// @param _dimensions An array of structs,each struct containing details about the new dimensions of each item in `_itemIds`
    function setItemsDimensions(uint256[] calldata _itemIds, Dimensions[] calldata _dimensions) external onlyItemManager {
        require(_itemIds.length == _dimensions.length, "SvgFacet: _itemIds not same length as _dimensions");
        for (uint256 i; i < _itemIds.length; i++) {
            s.itemTypes[_itemIds[i]].dimensions = _dimensions[i];
        }
    }
}