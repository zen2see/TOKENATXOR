/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  DiamondCutFacet,
  DiamondCutFacetInterface,
} from "../DiamondCutFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        indexed: false,
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "DiamondCut",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "diamondCut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506120e6806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80631f931c1c14610030575b600080fd5b61004361003e366004611b34565b610045565b005b61004d61009e565b61009761005a8587611e73565b8484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061018892505050565b5050505050565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c13205473ffffffffffffffffffffffffffffffffffffffff166100de610579565b73ffffffffffffffffffffffffffffffffffffffff1614610186576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f4c69624469616d6f6e643a204d75737420626520636f6e7472616374206f776e60448201527f657200000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b565b60005b835181101561052e5760008482815181106101cf577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160200151905060006002811115610217577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816002811115610250577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156102ed576102e8858381518110610292577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151600001518684815181106102d7577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151604001516105e3565b61051b565b6001816002811115610328577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156103c0576102e885838151811061036a577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151600001518684815181106103af577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160400151610a6d565b60028160028111156103fb577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415610493576102e885838151811061043d577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160000151868481518110610482577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160400151610f11565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f4c69624469616d6f6e644375743a20496e636f7272656374204661636574437560448201527f74416374696f6e00000000000000000000000000000000000000000000000000606482015260840161017d565b508061052681611ff6565b91505061018b565b507f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb67383838360405161056293929190611c6c565b60405180910390a1610574828261112a565b505050565b6000333014156105dd57600080368080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050505036015173ffffffffffffffffffffffffffffffffffffffff1691506105e09050565b50335b90565b6000815111610674576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206660448201527f6163657420746f20637574000000000000000000000000000000000000000000606482015260840161017d565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c73ffffffffffffffffffffffffffffffffffffffff8316610738576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f4c69624469616d6f6e644375743a204164642066616365742063616e2774206260448201527f6520616464726573732830290000000000000000000000000000000000000000606482015260840161017d565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260018201602052604090205461ffff81166108295761078b846040518060600160405280602481526020016120b6602491396113e3565b60028201805473ffffffffffffffffffffffffffffffffffffffff861660008181526001808701602090815260408320820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00001661ffff90961695909517909455845490810185559381529190912090910180547fffffffffffffffffffffffff00000000000000000000000000000000000000001690911790555b60005b8351811015610097576000848281518110610870577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020908102919091018101517fffffffff00000000000000000000000000000000000000000000000000000000811660009081529186905260409091205490915073ffffffffffffffffffffffffffffffffffffffff168015610955576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603560248201527f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f60448201527f6e207468617420616c7265616479206578697374730000000000000000000000606482015260840161017d565b73ffffffffffffffffffffffffffffffffffffffff871660008181526001878101602090815260408084208054938401815584528184206008840401805463ffffffff60079095166004026101000a948502191660e089901c94909402939093179092557fffffffff0000000000000000000000000000000000000000000000000000000086168352889052902080547fffffffffffffffffffffffff0000000000000000000000000000000000000000169091177fffffffffffffffffffff0000ffffffffffffffffffffffffffffffffffffffff167401000000000000000000000000000000000000000061ffff87160217905583610a5581611fd4565b94505050508080610a6590611ff6565b91505061082c565b6000815111610afe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206660448201527f6163657420746f20637574000000000000000000000000000000000000000000606482015260840161017d565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c73ffffffffffffffffffffffffffffffffffffffff8316610bc2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f4c69624469616d6f6e644375743a204164642066616365742063616e2774206260448201527f6520616464726573732830290000000000000000000000000000000000000000606482015260840161017d565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260018201602052604090205461ffff8116610cb357610c15846040518060600160405280602481526020016120b6602491396113e3565b60028201805473ffffffffffffffffffffffffffffffffffffffff861660008181526001808701602090815260408320820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00001661ffff90961695909517909455845490810185559381529190912090910180547fffffffffffffffffffffffff00000000000000000000000000000000000000001690911790555b60005b8351811015610097576000848281518110610cfa577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020908102919091018101517fffffffff00000000000000000000000000000000000000000000000000000000811660009081529186905260409091205490915073ffffffffffffffffffffffffffffffffffffffff908116908716811415610de5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e20776974682073616d652066756e6374696f6e0000000000000000606482015260840161017d565b610def818361141e565b7fffffffff00000000000000000000000000000000000000000000000000000000821660008181526020878152604080832080547fffffffffffffffffffff0000ffffffffffffffffffffffffffffffffffffffff167401000000000000000000000000000000000000000061ffff8b160217815573ffffffffffffffffffffffffffffffffffffffff8c168085526001808c0185529285208054938401815585528385206008840401805463ffffffff60079095166004026101000a948502191660e08a901c94909402939093179092559390925287905281547fffffffffffffffffffffffff00000000000000000000000000000000000000001617905583610ef981611fd4565b94505050508080610f0990611ff6565b915050610cb6565b6000815111610fa2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206660448201527f6163657420746f20637574000000000000000000000000000000000000000000606482015260840161017d565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c73ffffffffffffffffffffffffffffffffffffffff831615611067576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603660248201527f4c69624469616d6f6e644375743a2052656d6f7665206661636574206164647260448201527f657373206d757374206265206164647265737328302900000000000000000000606482015260840161017d565b60005b82518110156111245760008382815181106110ae577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020908102919091018101517fffffffff00000000000000000000000000000000000000000000000000000000811660009081529185905260409091205490915073ffffffffffffffffffffffffffffffffffffffff1661110f818361141e565b5050808061111c90611ff6565b91505061106a565b50505050565b73ffffffffffffffffffffffffffffffffffffffff82166111d9578051156111d4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603c60248201527f4c69624469616d6f6e644375743a205f696e697420697320616464726573732860448201527f3029206275745f63616c6c64617461206973206e6f7420656d70747900000000606482015260840161017d565b6113df565b600081511161126a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603d60248201527f4c69624469616d6f6e644375743a205f63616c6c6461746120697320656d707460448201527f7920627574205f696e6974206973206e6f742061646472657373283029000000606482015260840161017d565b73ffffffffffffffffffffffffffffffffffffffff821630146112a9576112a98260405180606001604052806028815260200161208e602891396113e3565b6000808373ffffffffffffffffffffffffffffffffffffffff16836040516112d19190611c50565b600060405180830381855af49150503d806000811461130c576040519150601f19603f3d011682016040523d82523d6000602084013e611311565b606091505b509092509050816111245780511561135757806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161017d9190611dcf565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4c69624469616d6f6e644375743a205f696e69742066756e6374696f6e20726560448201527f7665727465640000000000000000000000000000000000000000000000000000606482015260840161017d565b5050565b813b8181611124576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161017d9190611dcf565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c73ffffffffffffffffffffffffffffffffffffffff83166114e2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603760248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e6360448201527f74696f6e207468617420646f65736e2774206578697374000000000000000000606482015260840161017d565b73ffffffffffffffffffffffffffffffffffffffff8316301415611588576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7560448201527f7461626c652066756e6374696f6e000000000000000000000000000000000000606482015260840161017d565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152602082815260408083205473ffffffffffffffffffffffffffffffffffffffff871684526001808601909352908320547401000000000000000000000000000000000000000090910461ffff16929161160891611e5c565b905080821461179f5773ffffffffffffffffffffffffffffffffffffffff851660009081526001840160205260408120805483908110611671577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000918252602080832060088304015473ffffffffffffffffffffffffffffffffffffffff8a168452600188019091526040909220805460079092166004026101000a90920460e01b9250829190859081106116f6577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600091825260208083206008830401805463ffffffff60079094166004026101000a938402191660e09590951c929092029390931790557fffffffff000000000000000000000000000000000000000000000000000000009290921682528490526040902080547fffffffffffffffffffff0000ffffffffffffffffffffffffffffffffffffffff167401000000000000000000000000000000000000000061ffff8516021790555b73ffffffffffffffffffffffffffffffffffffffff8516600090815260018401602052604090208054806117fc577f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b6000828152602080822060087fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90940193840401805463ffffffff600460078716026101000a0219169055919092557fffffffff00000000000000000000000000000000000000000000000000000000861682528490526040902080547fffffffffffffffffffff00000000000000000000000000000000000000000000169055806100975760028301546000906118b690600190611e5c565b73ffffffffffffffffffffffffffffffffffffffff8716600090815260018087016020526040909120015490915061ffff16808214611a1f57600085600201838154811061192d577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60009182526020909120015460028701805473ffffffffffffffffffffffffffffffffffffffff9092169250829184908110611992577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600091825260208083209190910180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff9485161790559290911681526001878101909252604090200180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00001661ffff83161790555b84600201805480611a59577f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b6000828152602080822083017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90810180547fffffffffffffffffffffffff000000000000000000000000000000000000000016905590920190925573ffffffffffffffffffffffffffffffffffffffff89168252600187810190915260409091200180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000016905550505050505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114611b2f57600080fd5b919050565b600080600080600060608688031215611b4b578081fd5b853567ffffffffffffffff80821115611b62578283fd5b818801915088601f830112611b75578283fd5b813581811115611b83578384fd5b60208a818284028601011115611b97578485fd5b8084019850819750611baa818b01611b0b565b965060408a0135935082841115611bbf578485fd5b838a0193508a601f850112611bd2578485fd5b8335915082821115611be2578485fd5b8a81838601011115611bf2578485fd5b979a96995094975050909401935090919050565b60008151808452611c1e816020860160208601611fa8565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60008251611c62818460208701611fa8565b9190910192915050565b606080825284518282018190526000919060809081850190602080820287018401818b01875b84811015611d91577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff808a8403018652815188840173ffffffffffffffffffffffffffffffffffffffff82511685528582015160038110611d19577f4e487b71000000000000000000000000000000000000000000000000000000008c52602160045260248cfd5b858701526040918201519185018a9052815190819052908501908a90898601905b80831015611d7c5783517fffffffff00000000000000000000000000000000000000000000000000000000168252928701926001929092019190870190611d3a565b50978601979450505090830190600101611c92565b505073ffffffffffffffffffffffffffffffffffffffff8a16888301528781036040890152611dc0818a611c06565b9b9a5050505050505050505050565b600060208252611de26020830184611c06565b9392505050565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715611e3057611e3061205e565b604052919050565b600067ffffffffffffffff821115611e5257611e5261205e565b5060209081020190565b600082821015611e6e57611e6e61202f565b500390565b6000611e86611e8184611e38565b611de9565b8381526020808201919084845b87811015611f9c57813587016060808236031215611eaf578788fd5b611eb881611de9565b9050611ec382611b0b565b81528482013560038110611ed5578889fd5b8186015260408281013567ffffffffffffffff811115611ef357898afd5b929092019136601f840112611f06578889fd5b8235611f14611e8182611e38565b81815287810190858901368a850288018b011115611f30578c8dfd5b8c96505b83871015611f7f5780357fffffffff0000000000000000000000000000000000000000000000000000000081168114611f6b578d8efd5b835260019690960195918901918901611f34565b509284019290925250508652509382019390820190600101611e93565b50919695505050505050565b60005b83811015611fc3578181015183820152602001611fab565b838111156111245750506000910152565b600061ffff80831681811415611fec57611fec61202f565b6001019392505050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156120285761202861202f565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfe4c69624469616d6f6e644375743a205f696e6974206164647265737320686173206e6f20636f64654c69624469616d6f6e644375743a204e657720666163657420686173206e6f20636f6465a164736f6c6343000802000a";

export class DiamondCutFacet__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DiamondCutFacet> {
    return super.deploy(overrides || {}) as Promise<DiamondCutFacet>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DiamondCutFacet {
    return super.attach(address) as DiamondCutFacet;
  }
  connect(signer: Signer): DiamondCutFacet__factory {
    return super.connect(signer) as DiamondCutFacet__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondCutFacetInterface {
    return new utils.Interface(_abi) as DiamondCutFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DiamondCutFacet {
    return new Contract(address, _abi, signerOrProvider) as DiamondCutFacet;
  }
}