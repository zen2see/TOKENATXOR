// import { ethers } from 'hardhat'
// const hre = require('hardhat');

// // @ts-ignore
// const { getCollaterals } = require("./collateralTypesProduction2");
// const { collateralsSvgs } = require("../svgs/collateralsH2");
// const { expressionSvgs } = require("../svgs/expressionsH2");
// const { LedgerSigner } = require("@ethersproject/hardware-wallets");

// let signer, daoFacet, collateralTypesAndSizes, expressionTypesAndSizes;

// async function main() {
//   const gasPrice = 30000000000;
//   const tokenatxorDiamondAddress = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";
//   const itemManager = "0xa370f2ADd2A9Fba8759147995d6A0641F8d7C119";

//   const testing = ["hardhat", "localhost"].includes(hre.network.name);
//   if (testing) {
//     await hre.network.provider.request({
//       method: "hardhat_impersonateAccount",
//       params: [itemManager],
//     });

//     signer = await ethers.provider.getSigner(itemManager);
//   } else if (hre.network.name === "matic") {
//     signer = new LedgerSigner(ethers.provider, "hid", "m/44'/60'/2'/0/0");
//   } else {
//     throw Error("Incorrect network selected");
//   }

//   function setupSvg(...svgData) {
//     const svgTypesAndSizes = Array();
//     const svgItems = Array();
//     for (const [svgType, svg] of svgData) {
//       svgItems.push(svg.join(""));
//       svgTypesAndSizes.push([
//         ethers.utils.formatBytes32String(svgType),
//         svg.map((value) => value.length),
//       ]);
//     }
//     return [svgItems.join(""), svgTypesAndSizes];
//   }

//   const _productionMaxSize = 15000;
//   const productionPrice = 0; //GBM
//   const _bodyColor = "0x000000"; //test color
//   const _collateralTypes = getCollaterals("matic");

//   // @ts-ignore
//   [collateralSvg, collateralTypesAndSizes] = setupSvg([
//     "collaterals",
//     collateralsSvgs,
//   ]);

//   //expressions
//   [expressionSvg, expressionTypesAndSizes] = setupSvg([
//     "expressionsH2",
//     expressionSvgs,
//   ]);

//   let totalPayload = {
//     _hauntMaxSize: _productionMaxSize,
//     _portalPrice: productionPrice,
//     _bodyColor: _bodyColor,
//     _collateralTypes: _collateralTypes,
//     _collateralSvg: collateralSvg,
//     _collateralTypesAndSizes: collateralTypesAndSizes,
//     _expressionSvg: expressionSvg,
//     _expressionTypesAndSizes: expressionTypesAndSizes,
//   };
//   daoFacet = (
//     await ethers.getContractAt("DAOFacet", tokenatxorDiamondAddress)
//   ).connect(signer);

//   const svgFacet = await ethers.getContractAt(
//     "SvgFacet",
//     tokenatxorDiamondAddress,
//     signer
//   );

//   console.log("Creating Production");
//   const tx = await daoFacet.createProductionWithPayload(totalPayload, {
//     gasPrice: gasPrice,
//   });
//   console.log("hx:", tx.hash);

//   const receipt = await tx.wait();
//   if (!receipt.status) {
//     throw Error(`Error creating production: ${tx.hash}`);
//   }
//   console.log("Production created:", tx.hash);

//   const preview = await svgFacet.previewTokenatxor(
//     "2",
//     "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
//     [0, 0, 0, 0, 99, 99],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//   );

//   console.log("preview:", preview);

//   if (testing) {
//     //can't buy productions
//     const shopFacet = await ethers.getContractAt(
//       "ShopFacet",
//       tokenatxorDiamondAddress,
//       signer
//     );

//     await shopFacet.mintProductions(itemManager, 10);

//     const tokenxtrFacet = await ethers.getContractAt(
//       "contracts/Tokenatxor/facets/TokenatxorFacet.sol:TokenatxorFacet",
//       tokenatxorDiamondAddress
//     );
//     const balanceOf = await tokenxtrFacet.balanceOf(itemManager);
//     console.log("balance:", balanceOf.toString());

//     const svg = await svgFacet.getTokenatxorSvg("10000");

//     console.log("svg:", svg);

//     const gameFacet = await ethers.getContractAt(
//       "TokenatxorGameFacet",
//       tokenatxorDiamondAddress
//     );
//     const currentProduction = await gameFacet.currentProduction();
//     console.log("current production:", currentProduction);
//   }
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
