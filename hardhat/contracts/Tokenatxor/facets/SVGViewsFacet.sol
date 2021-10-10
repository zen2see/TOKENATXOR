// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {SvgFacet} from "./SvgFacet.sol";
import {AppStorage, SvgLayer, Dimensions} from "../libraries/LibAppStorage.sol";
import {LibTokenatxor, ProductionTokenatxorTraitsIO, EQUIPPED_SLOTS, PRODUCTION_TOKENATXORS_NUM, NUMERIC_TRAITS_NUM} from "../libraries/LibTokenatxor.sol";
import {LibItems} from "../libraries/LibItems.sol";
import {Modifiers, ItemType} from "../libraries/LibAppStorage.sol";
import {LibSvg} from "../libraries/LibSvg.sol";
import {LibStrings} from "../../shared/libraries/LibStrings.sol";

contract SvgViewsFacet is Modifiers {
    /// @notice Get the sideview svgs of an tokenatxor
    /// @dev Only valid for claimed tokenatxor
    /// @param _tokenId The identifier of the tokenatxor to query
    /// @return tr_ An array of svgs, each one representing a certain perspective i.e front,left,right,back views respectively
    function getTokenatxorSideSvgs(uint256 _tokenId) public view returns (string[] memory tr_) {
        // 0 == front view
        // 1 == leftSide view
        // 2 == rightSide view
        // 3 == backSide view
        uint256 productionId = s.tokenatxors[_tokenId].productionId;
        tr_ = new string[](4);
        require(s.tokenatxors[_tokenId].status == LibTokenatxor.STATUS_TOKENATXOR, "SvgFacet: Tokenatxor not claimed");
        tr_[0] = SvgFacet(address(this)).getTokenatxorSvg(_tokenId);

        address collateralType = s.tokenatxors[_tokenId].collateralType;
        int16[NUMERIC_TRAITS_NUM] memory _numericTraits = s.tokenatxors[_tokenId].numericTraits;
        uint16[EQUIPPED_SLOTS] memory equippedEquippables = s.tokenatxors[_tokenId].equippedEquippables;

        bytes memory viewBox = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">';

        tr_[1] = string(getTokenatxorSideSvgLayers("left", collateralType, _numericTraits, _tokenId, productionId, equippedEquippables));
        tr_[1] = string(abi.encodePacked(viewBox, tr_[1], "</svg>"));

        tr_[2] = string(getTokenatxorSideSvgLayers("right", collateralType, _numericTraits, _tokenId, productionId, equippedEquippables));
        tr_[2] = string(abi.encodePacked(viewBox, tr_[2], "</svg>"));

        tr_[3] = string(getTokenatxorSideSvgLayers("back", collateralType, _numericTraits, _tokenId, productionId, equippedEquippables));
        tr_[3] = string(abi.encodePacked(viewBox, tr_[3], "</svg>"));
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

    function getTokenatxorSideSvgLayers(
        bytes memory _sideView,
        address _collateralType,
        int16[NUMERIC_TRAITS_NUM] memory _numericTraits,
        uint256 _tokenId,
        uint256 _productionId,
        uint16[EQUIPPED_SLOTS] memory equippedEquippables
    ) internal view returns (bytes memory svg_) {
        SvgLayerDetails memory details;

        details.primaryColor = LibSvg.bytes3ToColorString(s.collateralTypeInfo[_collateralType].primaryColor);
        details.secondaryColor = LibSvg.bytes3ToColorString(s.collateralTypeInfo[_collateralType].secondaryColor);
        details.cheekColor = LibSvg.bytes3ToColorString(s.collateralTypeInfo[_collateralType].cheekColor);

        /// tokenatxor body
        svg_ = LibSvg.getSvg(LibSvg.bytesToBytes32("tokenatxor-", _sideView), LibSvg.TOKENATXOR_BODY_SVG_ID);
        details.collateral = LibSvg.getSvg(LibSvg.bytesToBytes32("collaterals-", _sideView), s.collateralTypeInfo[_collateralType].svgId);

        bytes memory expressionSvgType = "expressions-";
        if (_productionId != 1) {
            // Convert Produciton into string to match the uploaded category name
            bytes memory production = abi.encodePacked(LibSvg.uint2str(_productionId));
            expressionSvgType = abi.encodePacked("expressionssH", production, "-");
        }

        details.trait = _numericTraits[4];

        if (details.trait < 0) {
            details.expression = LibSvg.getSvg(LibSvg.bytesToBytes32(expressionSvgType, _sideView), 0);
        } else if (details.trait > 97) {
            details.expression = LibSvg.getSvg(LibSvg.bytesToBytes32(expressionSvgType, _sideView), s.collateralTypeInfo[_collateralType].expressionSvgId);
        } else {
            details.expressionTraitRange = [int256(0), 1, 2, 5, 7, 10, 15, 20, 25, 42, 58, 75, 80, 85, 90, 93, 95, 98];
            for (uint256 i; i < details.expressionTraitRange.length - 1; i++) {
                if (details.trait >= details.expressionTraitRange[i] && details.trait < details.expressionTraitRange[i + 1]) {
                    details.expression = LibSvg.getSvg(LibSvg.bytesToBytes32(expressionSvgType, _sideView), i);
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

        bytes32 back = LibSvg.bytesToBytes32("equippables-", "back");
        bytes32 side = LibSvg.bytesToBytes32("equippables-", _sideView);

        // If tokenId is MAX_INT, we're rendering a Production Tokenatxor, so no equippables.
        if (_tokenId == type(uint256).max) {
            if (side == back) {
                svg_ = abi.encodePacked(
                    applySideStyles(details, _tokenId, equippedEquippables),
                    LibSvg.getSvg(LibSvg.bytesToBytes32("tokenatxor-", _sideView), LibSvg.BACKGROUND_SVG_ID),
                    svg_
                );
            } else {
                svg_ = abi.encodePacked(
                    applySideStyles(details, _tokenId, equippedEquippables),
                    LibSvg.getSvg(LibSvg.bytesToBytes32("tokenatxor-", _sideView), LibSvg.BACKGROUND_SVG_ID),
                    svg_,
                    details.collateral,
                    details.expression
                );
            }
        } else {
            if (back != side) {
                svg_ = abi.encodePacked(applySideStyles(details, _tokenId, equippedEquippables), svg_, details.collateral, details.expression);
                svg_ = addBodyAndEquippableSideSvgLayers(_sideView, svg_, equippedEquippables);
            } else {
                svg_ = abi.encodePacked(applySideStyles(details, _tokenId, equippedEquippables), svg_);
                svg_ = addBodyAndEquippableSideSvgLayers(_sideView, svg_, equippedEquippables);
            }
        }
    }

    function applySideStyles(
        SvgLayerDetails memory _details,
        uint256 _tokenId,
        uint16[EQUIPPED_SLOTS] memory equippedEquippables
    ) internal pure returns (bytes memory) {
        bytes memory styles = abi.encodePacked(
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
            ".tokentxr-handsUp{display:none;}"
        );

        if (
            _tokenId != type(uint256).max &&
            (equippedEquippables[LibItems.EQUIPPABLE_SLOT_BODY] != 0 ||
                equippedEquippables[LibItems.EQUIPPABLE_SLOT_HAND_LEFT] != 0 ||
                equippedEquippables[LibItems.EQUIPPABLE_SLOT_HAND_RIGHT] != 0)
        ) {
            /// Open-hands tokenatxor
            return abi.encodePacked(styles, ".tokentxr-handsDownOpen{display:block;}", ".tokentxr-handsDownClosed{display:none;}", "</style>");
        } else {
            /// Normal Tokenatxor, closed hands
            return abi.encodePacked(styles, ".tokentxr-handsDownOpen{display:none;}", ".tokentxr-handsDownClosed{display:block}", "</style>");
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

    /// @notice Allow the sideview preview of an tokenatxor given the production id,a set of traits, equippables and collateral type
    /// @param _productionId Production id to use in preview
    /// @param _collateralType The type of collateral to use
    /// @param _numericTraits The numeric traits to use for the tokenatxor
    /// @param equippedEquippables The set of equippables to wear for the tokenatxor
    /// @return tr_ The final sideview svg strings being generated based on the given test parameters
    function previewSideTokenatxor(
        uint256 _productionId,
        address _collateralType,
        int16[NUMERIC_TRAITS_NUM] memory _numericTraits,
        uint16[EQUIPPED_SLOTS] memory equippedEquippables
    ) external view returns (string[] memory tr_) {
        tr_ = new string[](4);

        /// Front
        tr_[0] = SvgFacet(address(this)).previewTokenatxor(_productionId, _collateralType, _numericTraits, equippedEquippables);

        bytes memory viewBox = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">';

        // Left
        bytes memory svg_ = getTokenatxorSideSvgLayers("left", _collateralType, _numericTraits, type(uint256).max - 1, _productionId, equippedEquippables);
        svg_ = abi.encodePacked(addBodyAndEquippableSideSvgLayers("left", svg_, equippedEquippables));
        tr_[1] = string(abi.encodePacked(viewBox, svg_, "</svg>"));

        /// Right
        svg_ = getTokenatxorSideSvgLayers("right", _collateralType, _numericTraits, type(uint256).max - 1, _productionId, equippedEquippables);
        svg_ = abi.encodePacked(addBodyAndEquippableSideSvgLayers("right", svg_, equippedEquippables));
        tr_[2] = string(abi.encodePacked(viewBox, svg_, "</svg>"));

        /// Back
        svg_ = getTokenatxorSideSvgLayers("back", _collateralType, _numericTraits, type(uint256).max - 1, _productionId, equippedEquippables);
        svg_ = abi.encodePacked(addBodyAndEquippableSideSvgLayers("back", svg_, equippedEquippables));
        tr_[3] = string(abi.encodePacked(viewBox, svg_, "</svg>"));
    }

    /// _sideView should either be left, right, front or back
    function addBodyAndEquippableSideSvgLayers(
        bytes memory _sideView,
        bytes memory _body,
        uint16[EQUIPPED_SLOTS] memory equippedEquippables
    ) internal view returns (bytes memory svg_) {
        // Equippables
        TokenatxorLayers memory layers;
        layers.hands = abi.encodePacked(svg_, LibSvg.getSvg(LibSvg.bytesToBytes32("tokenatxor-", _sideView), LibSvg.HANDS_SVG_ID));

        for (uint256 i = 0; i < equippedEquippables.length; i++) {
            uint256 equippableId = equippedEquippables[i];
            bytes memory sideview = getEquippableSideView(_sideView, equippableId, i);

            if (i == LibItems.EQUIPPABLE_SLOT_BG && equippableId != 0) {
                layers.background = sideview;
            } else {
                layers.background = LibSvg.getSvg("tokenatxor", 4);
            }

            if (i == LibItems.EQUIPPABLE_SLOT_BODY && equippableId != 0) {
                (layers.bodyEquippable, layers.sleeves) = getBodySideEquippable(_sideView, equippableId);
            } else if (i == LibItems.EQUIPPABLE_SLOT_FACE && equippableId != 0) {
                layers.face = sideview;
            } else if (i == LibItems.EQUIPPABLE_SLOT_EYES && equippableId != 0) {
                layers.eyes = sideview;
            } else if (i == LibItems.EQUIPPABLE_SLOT_HEAD && equippableId != 0) {
                layers.head = sideview;
            } else if (i == LibItems.EQUIPPABLE_SLOT_HAND_RIGHT && equippableId != 0) {
                layers.handLeft = sideview;
            } else if (i == LibItems.EQUIPPABLE_SLOT_HAND_LEFT && equippableId != 0) {
                layers.handRight = sideview;
            } else if (i == LibItems.EQUIPPABLE_SLOT_PET && equippableId != 0) {
                layers.pet = sideview;
            }
        }

        bytes32 left = LibSvg.bytesToBytes32("equippables-", "left");
        bytes32 right = LibSvg.bytesToBytes32("equippables-", "right");
        bytes32 back = LibSvg.bytesToBytes32("equippables-", "back");
        bytes32 side = LibSvg.bytesToBytes32("equippables-", _sideView);

        if (side == left) {
            svg_ = abi.encodePacked(layers.background, _body, layers.bodyEquippable);
            svg_ = abi.encodePacked(svg_, layers.face, layers.eyes, layers.head, layers.handLeft, layers.hands, layers.sleeves, layers.pet);
        } else if (side == right) {
            svg_ = abi.encodePacked(layers.background, _body, layers.bodyEquippable);
            svg_ = abi.encodePacked(svg_, layers.face, layers.eyes, layers.head, layers.handRight, layers.hands, layers.sleeves, layers.pet);
        } else if (side == back) {
            svg_ = abi.encodePacked(layers.background);
            svg_ = abi.encodePacked(svg_, layers.handRight, layers.handLeft, layers.hands);
            svg_ = abi.encodePacked(svg_, _body);
            svg_ = abi.encodePacked(svg_, layers.bodyEquippable, layers.face, layers.eyes, layers.head, layers.pet);
        }
    }

    function getSideEquippableClass(uint256 _slotPosition) internal pure returns (string memory className_) {

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

    function getEquippableSideView(
        bytes memory _sideView,
        uint256 _equippableId,
        uint256 _slotPosition
    ) internal view returns (bytes memory svg_) {
        ItemType storage equippableType = s.itemTypes[_equippableId];
        Dimensions memory dimensions = s.sideViewDimensions[_equippableId][_sideView];

        string memory equippableClass = getSideEquippableClass(_slotPosition);

        svg_ = abi.encodePacked(
            '<g class="gotchi-equippable ',
            equippableClass,
            /// x
            LibStrings.strWithUint('"><svg x="', dimensions.x),
            /// y
            LibStrings.strWithUint('" y="', dimensions.y),
            '">'
        );

        bytes32 back = LibSvg.bytesToBytes32("equippables-", "back");
        bytes32 side = LibSvg.bytesToBytes32("equippables-", _sideView);

        if (side == back && _slotPosition == LibItems.EQUIPPABLE_SLOT_HAND_RIGHT) {
            svg_ = abi.encodePacked(svg_, LibSvg.getSvg(LibSvg.bytesToBytes32("equippables-", _sideView), equippableType.svgId), "</svg></g>");
        } else if (side == back && _slotPosition == LibItems.EQUIPPABLE_SLOT_HAND_LEFT) {
            svg_ = abi.encodePacked(
                svg_,
                LibStrings.strWithUint('<g transform="scale(-1, 1) translate(-', 64 - (dimensions.x * 2)),
                ', 0)">',
                LibSvg.getSvg(LibSvg.bytesToBytes32("equippables-", _sideView), equippableType.svgId),
                "</g></svg></g>"
            );
        } else {
            svg_ = abi.encodePacked(svg_, LibSvg.getSvg(LibSvg.bytesToBytes32("equippables-", _sideView), equippableType.svgId), "</svg></g>");
        }
    }

    function getBodySideEquippable(bytes memory _sideView, uint256 _equippableId)
        internal
        view
        returns (bytes memory bodyEquippable_, bytes memory sleeves_)
    {
        ItemType storage equippableType = s.itemTypes[_equippableId];
        Dimensions memory dimensions = s.sideViewDimensions[_equippableId][_sideView];

        bodyEquippable_ = abi.encodePacked(
            '<g class="gotchi-equippable equippable-body',
            /// x
            LibStrings.strWithUint('"><svg x="', dimensions.x),
            /// y
            LibStrings.strWithUint('" y="', dimensions.y),
            '">',
            LibSvg.getSvg(LibSvg.bytesToBytes32("equippables-", _sideView), equippableType.svgId),
            "</svg></g>"
        );
        uint256 svgId = s.sleeves[_equippableId];
        if (svgId == 0 && _equippableId == 8) {
            sleeves_ = abi.encodePacked(
                /// x
                LibStrings.strWithUint('"><svg x="', dimensions.x),
                /// y
                LibStrings.strWithUint('" y="', dimensions.y),
                '">',
                LibSvg.getSvg(LibSvg.bytesToBytes32("sleeves-", _sideView), svgId),
                "</svg>"
            );
        } else if (svgId != 0) {
            sleeves_ = abi.encodePacked(
                /// x
                LibStrings.strWithUint('"><svg x="', dimensions.x),
                /// y
                LibStrings.strWithUint('" y="', dimensions.y),
                '">',
                LibSvg.getSvg(LibSvg.bytesToBytes32("sleeves-", _sideView), svgId),
                "</svg>"
            );
        }
    }

    function prepareItemSvg(Dimensions storage _dimensions, bytes memory _svg) internal view returns (string memory svg_) {
        svg_ = string(
            abi.encodePacked(
                /// width
                LibStrings.strWithUint('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ', _dimensions.width),
                /// height
                LibStrings.strWithUint(" ", _dimensions.height),
                '">',
                _svg,
                "</svg>"
            )
        );
    }

    /// @notice Query the sideview svg of an item
    /// @param _itemId Identifier of the item to query
    /// @return svg_ The sideview svg of the item`
    function getItemSvgs(uint256 _itemId) public view returns (string[] memory svg_) {
        require(_itemId < s.itemTypes.length, "ItemsFacet: _id not found for item");
        svg_ = new string[](4);
        svg_[0] = prepareItemSvg(s.itemTypes[_itemId].dimensions, LibSvg.getSvg("equippables", _itemId));
        svg_[1] = prepareItemSvg(s.sideViewDimensions[_itemId]["left"], LibSvg.getSvg("equippables-left", _itemId));
        svg_[2] = prepareItemSvg(s.sideViewDimensions[_itemId]["right"], LibSvg.getSvg("equippables-right", _itemId));
        svg_[3] = prepareItemSvg(s.sideViewDimensions[_itemId]["back"], LibSvg.getSvg("equippables-back", _itemId));
    }

    /// @notice Query the svg of multiple items
    /// @param _itemIds Identifiers of the items to query
    /// @return svgs_ The svgs of each item in `_itemIds`
    function getItemsSvgs(uint256[] calldata _itemIds) public view returns (string[][] memory svgs_) {
        svgs_ = new string[][](_itemIds.length);
        for (uint256 i; i < _itemIds.length; i++) {
            svgs_[i] = getItemSvgs(_itemIds[i]);
        }
    }

    struct SideViewDimensionsArgs {
        uint256 itemId;
        string side;
        Dimensions dimensions;
    }

    /// @notice Allow an item manager to set the sideview dimensions of an existing item
    /// @param _sideViewDimensions An array of structs, each struct onating details about the sideview dimensions like `itemId`,`side` amd `dimensions`
    function setSideViewDimensions(SideViewDimensionsArgs[] calldata _sideViewDimensions) external onlyItemManager {
        for (uint256 i; i < _sideViewDimensions.length; i++) {
            s.sideViewDimensions[_sideViewDimensions[i].itemId][bytes(_sideViewDimensions[i].side)] = _sideViewDimensions[i].dimensions;
        }
    }
}