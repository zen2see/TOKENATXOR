/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "Diamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Diamond__factory>;
    getContractFactory(
      name: "DiamondCutFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondCutFacet__factory>;
    getContractFactory(
      name: "DiamondLoupeFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondLoupeFacet__factory>;
    getContractFactory(
      name: "OwnershipFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnershipFacet__factory>;
    getContractFactory(
      name: "IDiamondCut",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondCut__factory>;
    getContractFactory(
      name: "IDiamondLoupe",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondLoupe__factory>;
    getContractFactory(
      name: "IERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155__factory>;
    getContractFactory(
      name: "IERC1155TokenReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155TokenReceiver__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IERC173",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC173__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC20EIP",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20EIP__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Enumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Enumerable__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721TokenReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721TokenReceiver__factory>;
    getContractFactory(
      name: "IERC721TokenReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721TokenReceiver__factory>;
    getContractFactory(
      name: "LibDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibDiamond__factory>;
    getContractFactory(
      name: "LibERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibERC1155__factory>;
    getContractFactory(
      name: "LibERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibERC721__factory>;
    getContractFactory(
      name: "TKTRFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TKTRFacet__factory>;
    getContractFactory(
      name: "InitDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.InitDiamond__factory>;
    getContractFactory(
      name: "IGHSTDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IGHSTDiamond__factory>;
    getContractFactory(
      name: "CollateralEscrow",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CollateralEscrow__factory>;
    getContractFactory(
      name: "BridgeFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BridgeFacet__factory>;
    getContractFactory(
      name: "CollateralFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CollateralFacet__factory>;
    getContractFactory(
      name: "DAOFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DAOFacet__factory>;
    getContractFactory(
      name: "ERC1155MarketplaceFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155MarketplaceFacet__factory>;
    getContractFactory(
      name: "ERC721MarketplaceFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721MarketplaceFacet__factory>;
    getContractFactory(
      name: "EscrowFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EscrowFacet__factory>;
    getContractFactory(
      name: "ItemsFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ItemsFacet__factory>;
    getContractFactory(
      name: "ItemsTransferFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ItemsTransferFacet__factory>;
    getContractFactory(
      name: "MetaTransactionsFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MetaTransactionsFacet__factory>;
    getContractFactory(
      name: "ShopFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ShopFacet__factory>;
    getContractFactory(
      name: "SvgFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SvgFacet__factory>;
    getContractFactory(
      name: "SvgViewsFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SvgViewsFacet__factory>;
    getContractFactory(
      name: "TokenatxorFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenatxorFacet__factory>;
    getContractFactory(
      name: "TokenatxorGameFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenatxorGameFacet__factory>;
    getContractFactory(
      name: "VoucherMigrationFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VoucherMigrationFacet__factory>;
    getContractFactory(
      name: "VrfFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VrfFacet__factory>;
    getContractFactory(
      name: "InitDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.InitDiamond__factory>;
    getContractFactory(
      name: "ILink",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILink__factory>;
    getContractFactory(
      name: "LibERC1155Marketplace",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibERC1155Marketplace__factory>;
    getContractFactory(
      name: "LibERC721Marketplace",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibERC721Marketplace__factory>;
    getContractFactory(
      name: "LibSvg",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibSvg__factory>;
    getContractFactory(
      name: "LibTokenatxor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibTokenatxor__factory>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
  }
}
