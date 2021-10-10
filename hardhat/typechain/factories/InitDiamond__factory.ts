/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { InitDiamond, InitDiamondInterface } from "../InitDiamond";

const _abi = [
  {
    inputs: [],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610157806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063e1c7392a14610030575b600080fd5b6101487fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f6020527f699d9daa71b280d05a152715774afa0a81a312594b2d731d6b0b2552b7d6f69f805460017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091821681179092557ff97e938d8af42f52387bb74b8b526fda8f184cc2aa534340a8d75a88fbecc77580548216831790557f65d510a5d8f7ef134ec444f7f34ee808c8eeb5177cdfd16be0c40fe1ab43369580548216831790557f7f5828d0000000000000000000000000000000000000000000000000000000006000527f5622121b47b8cd0120c4efe45dd5483242f54a3d49bd7679be565d47694918c380549091169091179055565b00fea164736f6c6343000802000a";

export class InitDiamond__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<InitDiamond> {
    return super.deploy(overrides || {}) as Promise<InitDiamond>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): InitDiamond {
    return super.attach(address) as InitDiamond;
  }
  connect(signer: Signer): InitDiamond__factory {
    return super.connect(signer) as InitDiamond__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InitDiamondInterface {
    return new utils.Interface(_abi) as InitDiamondInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InitDiamond {
    return new Contract(address, _abi, signerOrProvider) as InitDiamond;
  }
}
