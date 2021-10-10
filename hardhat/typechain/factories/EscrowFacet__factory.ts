/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { EscrowFacet, EscrowFacetInterface } from "../EscrowFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_erc20Contract",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_depositAmount",
        type: "uint256",
      },
    ],
    name: "Erc20Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_erc20Contract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_transferAmount",
        type: "uint256",
      },
    ],
    name: "TransferEscrow",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "_erc20Contracts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
    ],
    name: "batchDepositERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
    ],
    name: "batchDepositTKTR",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_erc20Contract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "depositERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_erc20Contract",
        type: "address",
      },
    ],
    name: "escrowBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_erc20Contract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_transferAmount",
        type: "uint256",
      },
    ],
    name: "transferEscrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506115b2806100206000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063b0343d0511610050578063b0343d0514610094578063b0facab3146100a7578063db87db52146100ba57610067565b8063467ab5cf1461006c578063ab0fcabf14610081575b600080fd5b61007f61007a3660046112d1565b6100df565b005b61007f61008f366004611433565b610311565b61007f6100a2366004611367565b610945565b61007f6100b5366004611476565b610b65565b6100cd6100c8366004611408565b610d81565b60405190815260200160405180910390f35b848114610173576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f457363726f7746616365743a20546f6b656e49447320616e642056616c75657360448201527f206c656e677468206d757374206d61746368000000000000000000000000000060648201526084015b60405180910390fd5b848314610202576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f457363726f7746616365743a20546f6b656e49447320616e642045524332304360448201527f6f6e747261637473206c656e677468206d757374206d61746368000000000000606482015260840161016a565b60005b85811015610308576000878783818110610248577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b905060200201359050600086868481811061028c577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90506020020160208101906102a191906112b0565b905060008585858181106102de577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9050602002013590506102f2838383610b65565b505050808061030090611547565b915050610205565b50505050505050565b6000848152600d60205260409020600b0154849073ffffffffffffffffffffffffffffffffffffffff16610343610ee1565b73ffffffffffffffffffffffffffffffffffffffff16146103e6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603b60248201527f4c696241707053746f726167653a204f6e6c7920746f6b656e6174786f72206f60448201527f776e65722063616e2063616c6c20746869732066756e6374696f6e0000000000606482015260840161016a565b6000858152600d60205260409020600b015485907a010000000000000000000000000000000000000000000000000000900460ff16156104a8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f4c696241707053746f726167653a204f6e6c792063616c6c61626c65206f6e2060448201527f756e6c6f636b656420746f6b656e6174786f7273000000000000000000000000606482015260840161016a565b6000868152600d60205260409020600c81015460099091015473ffffffffffffffffffffffffffffffffffffffff918216911681610567576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f457363726f7746616365743a20446f6573206e6f74206861766520616e20657360448201527f63726f7700000000000000000000000000000000000000000000000000000000606482015260840161016a565b8673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610649576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604e60248201527f457363726f7746616365743a205472616e7366657272696e672045524332302060448201527f746f6b656e2043414e4e4f542062652073616d6520617320636f6c6c6174657260648201527f616c20455243323020746f6b656e000000000000000000000000000000000000608482015260a40161016a565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8381166004830152600091908916906370a082319060240160206040518083038186803b1580156106b457600080fd5b505afa1580156106c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ec91906113f0565b9050858110156107a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604360248201527f457363726f7746616365743a2043616e6e6f74207472616e73666572206d6f7260448201527f65207468616e2063757272656e7420455243323020657363726f772062616c6160648201527f6e63650000000000000000000000000000000000000000000000000000000000608482015260a40161016a565b6040805173ffffffffffffffffffffffffffffffffffffffff858116825260208201899052808a1692908b16918c917f3add497713cabddc9b3f3d9963688a629915a706016b0b38c08a7e675b8da7ae910160405180910390a46040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff84811660048301523060248301528791908a169063dd62ed3e9060440160206040518083038186803b15801561086e57600080fd5b505afa158015610882573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108a691906113f0565b101561092e576040517f7158f17000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8981166004830152841690637158f17090602401600060405180830381600087803b15801561091557600080fd5b505af1158015610929573d6000803e3d6000fd5b505050505b61093a88848989610f4b565b505050505050505050565b8281146109d4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f457363726f7746616365743a20546f6b656e49447320616e642056616c75657360448201527f206c656e677468206d757374206d617463680000000000000000000000000000606482015260840161016a565b73385eeac5cb85a38a9a07a70c73e0a3271cfb54a760005b84811015610b5d576000868683818110610a2f577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9050602002013590506000858584818110610a73577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000858152600d60209081526040909120600c01549102929092013592505073ffffffffffffffffffffffffffffffffffffffff1680610b34576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f457363726f7746616365743a20446f6573206e6f74206861766520616e20657360448201527f63726f7700000000000000000000000000000000000000000000000000000000606482015260840161016a565b610b4785610b40610ee1565b8385610f4b565b5050508080610b5590611547565b9150506109ec565b505050505050565b6000838152600d60205260409020600c81015460099091015473ffffffffffffffffffffffffffffffffffffffff918216911681610c24576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f457363726f7746616365743a20446f6573206e6f74206861766520616e20657360448201527f63726f7700000000000000000000000000000000000000000000000000000000606482015260840161016a565b8373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610d06576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604c60248201527f457363726f7746616365743a204465706f736974696e6720455243323020746f60448201527f6b656e2043414e4e4f542062652073616d6520617320636f6c6c61746572616c60648201527f20455243323020746f6b656e0000000000000000000000000000000000000000608482015260a40161016a565b610d0e610ee1565b6040805173ffffffffffffffffffffffffffffffffffffffff8581168252602082018790529283169287169188917f6cd2b0bc62ff8328a951d28fac4af370c453c726630896bceb87466dcf6ed583910160405180910390a4610d7a84610d73610ee1565b8486610f4b565b5050505050565b6000828152600d60205260408120600c015473ffffffffffffffffffffffffffffffffffffffff1680610e35576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f457363726f7746616365743a20446f6573206e6f74206861766520616e20657360448201527f63726f7700000000000000000000000000000000000000000000000000000000606482015260840161016a565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8281166004830152600091908516906370a082319060240160206040518083038186803b158015610ea057600080fd5b505afa158015610eb4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ed891906113f0565b95945050505050565b600033301415610f4557600080368080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050505036015173ffffffffffffffffffffffffffffffffffffffff169150610f489050565b50335b90565b833b80610fda576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f4c696245524332303a20455243323020746f6b656e206164647265737320686160448201527f73206e6f20636f64650000000000000000000000000000000000000000000000606482015260840161016a565b6040805173ffffffffffffffffffffffffffffffffffffffff86811660248301528581166044830152606480830186905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd00000000000000000000000000000000000000000000000000000000179052915160009283929089169161107991906114aa565b6000604051808303816000865af19150503d80600081146110b6576040519150601f19603f3d011682016040523d82523d6000602084013e6110bb565b606091505b5091509150610308828281156111775780511561117257808060200190518101906110e691906113d0565b611172576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603160248201527f4c696245524332303a207472616e73666572206f72207472616e73666572467260448201527f6f6d2072657475726e65642066616c7365000000000000000000000000000000606482015260840161016a565b61123a565b8051156111b257806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161016a91906114c6565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f4c696245524332303a207472616e73666572206f72207472616e73666572467260448201527f6f6d207265766572746564000000000000000000000000000000000000000000606482015260840161016a565b5050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461126257600080fd5b919050565b60008083601f840112611278578182fd5b50813567ffffffffffffffff81111561128f578182fd5b60208301915083602080830285010111156112a957600080fd5b9250929050565b6000602082840312156112c1578081fd5b6112ca8261123e565b9392505050565b600080600080600080606087890312156112e9578182fd5b863567ffffffffffffffff80821115611300578384fd5b61130c8a838b01611267565b90985096506020890135915080821115611324578384fd5b6113308a838b01611267565b90965094506040890135915080821115611348578384fd5b5061135589828a01611267565b979a9699509497509295939492505050565b6000806000806040858703121561137c578384fd5b843567ffffffffffffffff80821115611393578586fd5b61139f88838901611267565b909650945060208701359150808211156113b7578384fd5b506113c487828801611267565b95989497509550505050565b6000602082840312156113e1578081fd5b815180151581146112ca578182fd5b600060208284031215611401578081fd5b5051919050565b6000806040838503121561141a578182fd5b8235915061142a6020840161123e565b90509250929050565b60008060008060808587031215611448578384fd5b843593506114586020860161123e565b92506114666040860161123e565b9396929550929360600135925050565b60008060006060848603121561148a578283fd5b8335925061149a6020850161123e565b9150604084013590509250925092565b600082516114bc818460208701611517565b9190910192915050565b60006020825282518060208401526114e5816040850160208701611517565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b60005b8381101561153257818101518382015260200161151a565b83811115611541576000848401525b50505050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561159e577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b506001019056fea164736f6c6343000802000a";

export class EscrowFacet__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EscrowFacet> {
    return super.deploy(overrides || {}) as Promise<EscrowFacet>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): EscrowFacet {
    return super.attach(address) as EscrowFacet;
  }
  connect(signer: Signer): EscrowFacet__factory {
    return super.connect(signer) as EscrowFacet__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EscrowFacetInterface {
    return new utils.Interface(_abi) as EscrowFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EscrowFacet {
    return new Contract(address, _abi, signerOrProvider) as EscrowFacet;
  }
}