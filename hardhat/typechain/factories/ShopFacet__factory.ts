/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ShopFacet, ShopFacetInterface } from "../ShopFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
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
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_numProductionsToPurchase",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_totalPrice",
        type: "uint256",
      },
    ],
    name: "BuyProductions",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
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
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_numTokenatxorsToPurchase",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_productionId",
        type: "uint256",
      },
    ],
    name: "MintProductions",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_buyer",
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
        internalType: "uint256[]",
        name: "_itemIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_quantities",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_totalPrice",
        type: "uint256",
      },
    ],
    name: "PurchaseItemsWithTktr",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_buyer",
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
        internalType: "uint256[]",
        name: "_itemIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_quantities",
        type: "uint256[]",
      },
    ],
    name: "PurchaseItemsWithVouchers",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_buyer",
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
        internalType: "uint256[]",
        name: "_itemIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_quantities",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_totalPrice",
        type: "uint256",
      },
    ],
    name: "PurchaseTransferItemsWithTktr",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tktr",
        type: "uint256",
      },
    ],
    name: "buyPortals",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mintProductions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_itemIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_quantities",
        type: "uint256[]",
      },
    ],
    name: "purchaseItemsWithTktr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_itemIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_quantities",
        type: "uint256[]",
      },
    ],
    name: "purchaseTransferItemsWithTktr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612fe6806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806325db2270146100515780635c22ab75146100665780638b27e1ce14610079578063e0a769471461008c575b600080fd5b61006461005f366004612bb5565b61009f565b005b610064610074366004612c33565b6105e0565b610064610087366004612bb5565b610b55565b61006461009a366004612c33565b61112a565b60006100a9611899565b905083821461013f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f53686f7046616365743a205f6974656d496473206e6f742073616d65206c656e60448201527f677468206173205f7175616e746974696573000000000000000000000000000060648201526084015b60405180910390fd5b6000805b858110156103ab576000878783818110610186577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90506020020135905060008686848181106101ca577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9050602002013590506000806006018381548110610211577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600b0201905080600a0160059054906101000a900460ff166102bf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f53686f7046616365743a2043616e2774207075726368617365206974656d207460448201527f797065207769746820544b5452000000000000000000000000000000000000006064820152608401610136565b60008282600901546102d19190612e7c565b90508160080154811115610367576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603860248201527f53686f7046616365743a20546f74616c206974656d2074797065207175616e7460448201527f6974792065786365656473206d6178207175616e7469747900000000000000006064820152608401610136565b60098201819055600782015461037d9084612ecd565b6103879087612e7c565b95506103948c8585611903565b5050505080806103a390612f4d565b915050610143565b50601a546040517f70a0823100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff848116600483015260009216906370a082319060240160206040518083038186803b15801561041857600080fd5b505afa15801561042c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104509190612cc3565b9050818110156104bc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f53686f7046616365743a204e6f7420656e6f75676820544b54522100000000006044820152606401610136565b8773ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f3a8f84259c404e21a34eed40f477088f88ddf874847922af9b5720d0392a1f078989898988604051610521959493929190612e2f565b60405180910390a38773ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8a8a8a8a6040516105a49493929190612dfd565b60405180910390a46105b683836119e0565b6105d68360008a8a8a8a8a60405180602001604052806000815250611afe565b5050505050505050565b60006105ea611899565b73ffffffffffffffffffffffffffffffffffffffff81166000908152603b602052604090205490915060ff1615156001146106a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603960248201527f4c696241707053746f726167653a206f6e6c7920616e204974656d4d616e616760448201527f65722063616e2063616c6c20746869732066756e6374696f6e000000000000006064820152608401610136565b601654640100000000900461ffff166000818152600860205260408120906106cd611899565b60028301549091506000906106ef9087906301000000900462ffffff16612e7c565b83549091508111156107a9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604160248201527f53686f7046616365743a204578636565646564206d6178206e756d626572206f60448201527f6620746f6b656e6174786f727320666f7220746869732070726f64756369746f60648201527f6e00000000000000000000000000000000000000000000000000000000000000608482015260a401610136565b60008481526008602090815260409182902060020180547fffffffffffffffffffffffffffffffffffffffffffffffffffff000000ffffff16630100000062ffffff861602179055601654825163ffffffff9091168082529181018990529182018690529073ffffffffffffffffffffffffffffffffffffffff89811691908516907fc8367d6066dd9f619565a7debd607cdd49ad3ba1e44f57a05d686a4a63b424dd9060600160405180910390a360005b87811015610b1657886000600d0160008463ffffffff168152602001908152602001600020600b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508561ffff166000600d0160008463ffffffff168152602001908152602001600020600a0181905550600060100180549050600060110160008463ffffffff1681526020019081526020016000208190555060006010018290806001815401808255809150506001900390600052602060002090600891828204019190066004029091909190916101000a81548163ffffffff021916908363ffffffff1602179055506000600e0160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490506000600f0160008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008463ffffffff168152602001908152602001600020819055506000600e0160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208290806001815401808255809150506001900390600052602060002090600891828204019190066004029091909190916101000a81548163ffffffff021916908363ffffffff1602179055508163ffffffff168973ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a481610b0081612f86565b9250508080610b0e90612f4d565b91505061085b565b50601680547fffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000001663ffffffff9290921691909117905550505050505050565b73ffffffffffffffffffffffffffffffffffffffff8516610bf8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f53686f7046616365743a2043616e2774207472616e7366657220746f2030206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610136565b828114610c87576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f53686f7046616365743a20696473206e6f742073616d65206c656e677468206160448201527f732076616c7565730000000000000000000000000000000000000000000000006064820152608401610136565b6000610c91611899565b9050306000805b86811015610ef6576000888883818110610cdb577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9050602002013590506000878784818110610d1f577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90506020020135905080600114610db8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603960248201527f53686f7046616365743a2043616e206f6e6c792070757263686173652031206f60448201527f6620616e206974656d20706572207472616e73616374696f6e000000000000006064820152608401610136565b6000806006018381548110610df6577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600b0201905080600a0160059054906101000a900460ff16610ea4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f53686f7046616365743a2043616e2774207075726368617365206974656d207460448201527f797065207769746820544b5452000000000000000000000000000000000000006064820152608401610136565b6007810154610eb39083612ecd565b610ebd9086612e7c565b9450610eca868484611c86565b610ed58c8484611903565b610ee0308488612012565b5050508080610eee90612f4d565b915050610c98565b50601a546040517f70a0823100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff858116600483015260009216906370a082319060240160206040518083038186803b158015610f6357600080fd5b505afa158015610f77573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f9b9190612cc3565b905081811015611007576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f53686f7046616365743a204e6f7420656e6f75676820544b54522100000000006044820152606401610136565b8873ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8b8b8b8b6040516110819493929190612dfd565b60405180910390a48873ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167facaa325ae2d284fb7a570d90217e4e67a112aedd811bb0e87a516989b6d75d6d8a8a8a8a886040516110ee959493929190612e2f565b60405180910390a361110084836119e0565b61111f84848b8b8b8b8b60405180602001604052806000815250611afe565b505050505050505050565b601654640100000000900461ffff16600181146111c9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f53686f7046616365743a2043616e206f6e6c792070757263686173652066726f60448201527f6d2050726f6475636520310000000000000000000000000000000000000000006064820152608401610136565b600081815260086020526040902060018101548084101561126c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f4e6f7420656e6f75676820544b545220746f206275792070726f64756374696f60448201527f6e730000000000000000000000000000000000000000000000000000000000006064820152608401610136565b611274612b25565b61127f826005612ecd565b815261128c826002612ecd565b61129790600a612ecd565b81516112a39190612e7c565b60208201526112b3826003612ecd565b6112be90600a612ecd565b60208201516112cd9190612e7c565b6040820181905285111561133d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f43616e277420627579206d6f7265207468616e203235000000000000000000006044820152606401610136565b6000611347611899565b825190915060009081908811611374576113618589612e94565b915061136d8583612ecd565b9050611431565b602084015188116113d75761138a856002612ecd565b8451611396908a612f0a565b6113a09190612e94565b91506113ad856002612ecd565b6113b79083612ecd565b84516113c39190612e7c565b90506113d0600583612e7c565b9150611431565b6113e2856003612ecd565b60208501516113f1908a612f0a565b6113fb9190612e94565b9150611408856003612ecd565b6114129083612ecd565b60208501516114219190612e7c565b905061142e600f83612e7c565b91505b60028601546000906114509084906301000000900462ffffff16612e7c565b87549091508111156114e4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603c60248201527f53686f7046616365743a204578636565646564206d6178206e756d626572206f60448201527f662061617665676f746368697320666f722074686973206861756e74000000006064820152608401610136565b60008881526008602090815260409182902060020180547fffffffffffffffffffffffffffffffffffffffffffffffffffff000000ffffff16630100000062ffffff861602179055601654825163ffffffff9091168082529181018690529182018490529073ffffffffffffffffffffffffffffffffffffffff8c811691908716907f65c10461c25c1a92103a5a1b0eeaad66801e77e8203fda00afba12c90f67d5e89060600160405180910390a360005b84811015611851578b6000600d0160008463ffffffff168152602001908152602001600020600b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508961ffff166000600d0160008463ffffffff168152602001908152602001600020600a0181905550600060100180549050600060110160008463ffffffff1681526020019081526020016000208190555060006010018290806001815401808255809150506001900390600052602060002090600891828204019190066004029091909190916101000a81548163ffffffff021916908363ffffffff1602179055506000600e0160008d73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490506000600f0160008e73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008463ffffffff168152602001908152602001600020819055506000600e0160008d73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208290806001815401808255809150506001900390600052602060002090600891828204019190066004029091909190916101000a81548163ffffffff021916908363ffffffff1602179055508163ffffffff168c73ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a48161183b81612f86565b925050808061184990612f4d565b915050611596565b50601680547fffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000001663ffffffff831617905561188c85846119e0565b5050505050505050505050565b6000333014156118fd57600080368080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050505036015173ffffffffffffffffffffffffffffffffffffffff1691506119009050565b50335b90565b73ffffffffffffffffffffffffffffffffffffffff83166000908152600960209081526040808320858452909152812080548391908390611945908490612e7c565b909155505073ffffffffffffffffffffffffffffffffffffffff84166000908152600b8201602090815260408083208684529091529020546119da5773ffffffffffffffffffffffffffffffffffffffff84166000818152600a830160209081526040808320805460018101825581855283852061ffff8a169101559383529254600b85018252838320878452909152919020555b50505050565b60008060646119f0846021612ecd565b6119fa9190612e94565b905060006064611a0b856011612ecd565b611a159190612e94565b905060006005611a26866002612ecd565b611a309190612e94565b905060008183611a408689612f0a565b611a4a9190612f0a565b611a549190612f0a565b601a86015490915073ffffffffffffffffffffffffffffffffffffffff90811690611a839082908a90886121fe565b601f860154611aac9082908a9073ffffffffffffffffffffffffffffffffffffffff16876121fe565b6020860154611ad59082908a9073ffffffffffffffffffffffffffffffffffffffff16866121fe565b601d8601546105d69082908a9073ffffffffffffffffffffffffffffffffffffffff16856121fe565b853b801561111f576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff88169063bc197c8190611b64908c908c908b908b908b908b908b90600401612d8e565b602060405180830381600087803b158015611b7e57600080fd5b505af1158015611b92573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bb69190612c83565b7fffffffff00000000000000000000000000000000000000000000000000000000167fbc197c81000000000000000000000000000000000000000000000000000000001461111f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5765617261626c65733a205472616e736665722072656a65637465642f66616960448201527f6c6564206279205f746f000000000000000000000000000000000000000000006064820152608401610136565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260096020908152604080832085845290915281205480831115611d47576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f4c69624974656d733a20446f65736e277420686176652074686174206d616e7960448201527f20746f207472616e7366657200000000000000000000000000000000000000006064820152608401610136565b611d518382612f0a565b73ffffffffffffffffffffffffffffffffffffffff861660009081526009840160209081526040808320888452909152902081905590508061200b5773ffffffffffffffffffffffffffffffffffffffff85166000908152600b830160209081526040808320878452909152812054611dcc90600190612f0a565b73ffffffffffffffffffffffffffffffffffffffff87166000908152600a8501602052604081205491925090611e0490600190612f0a565b9050808214611f455773ffffffffffffffffffffffffffffffffffffffff87166000908152600a850160205260408120805483908110611e6d577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b906000526020600020015490508061ffff1685600a0160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208481548110611ef8577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600091825260209091200155611f0f836001612e7c565b73ffffffffffffffffffffffffffffffffffffffff89166000908152600b87016020908152604080832094835293905291909120555b73ffffffffffffffffffffffffffffffffffffffff87166000908152600a850160205260409020805480611fa2577f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b6000828152602080822083017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90810183905590920190925573ffffffffffffffffffffffffffffffffffffffff89168252600b86018152604080832089845290915281205550505b5050505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152602f6020908152604080832086845282528083209385168352929052908120548061205b5750506121f9565b6000818152602a8301602052604090206007810154158061208b5750600a81015460ff6101009091041615156001145b8061209f5750600a81015460ff1615156001145b156120ac575050506121f9565b600581015480156121c9576002820154600183015460038401546040517efdd58e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9283166004820152602481019190915291169062fdd58e9060440160206040518083038186803b15801561213357600080fd5b505afa158015612147573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061216b9190612cc3565b905081600501548110156121c957600582018190556006820154604080518381526020810192909252429082015283907f9a1e053d28c2efc6add1e4a5d1647a99e883b256a54f9ef4a0abf8fcba643a559060600160405180910390a25b806121f45760018201546121f490849073ffffffffffffffffffffffffffffffffffffffff1661237d565b505050505b505050565b833b8061228d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f4c696245524332303a20455243323020746f6b656e206164647265737320686160448201527f73206e6f20636f646500000000000000000000000000000000000000000000006064820152608401610136565b6040805173ffffffffffffffffffffffffffffffffffffffff86811660248301528581166044830152606480830186905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd00000000000000000000000000000000000000000000000000000000179052915160009283929089169161232c9190612d72565b6000604051808303816000865af19150503d8060008114612369576040519150601f19603f3d011682016040523d82523d6000602084013e61236e565b606091505b50915091506121f48282612519565b604080517f6c697374656400000000000000000000000000000000000000000000000000008152602c60068201528151908190036026019020600084815260209190915290812060018101546123d4575050612515565b6000848152602a830160205260409020600a81015460ff6101009091041615156001148061240b5750600a81015460ff1615156001145b1561241857505050612515565b600181015473ffffffffffffffffffffffffffffffffffffffff85811691161461249e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f4d61726b6574706c6163653a206f776e6572206e6f742073656c6c65720000006044820152606401610136565b600a810180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1661010017905560048101546040805191825243602083015286917fc1ee70d4dadc0ea8041f31f81b07d0ac9374b6bf41956d9cae562e672f3f8a91910160405180910390a261200b858561268e565b5050565b81156125cb578051156125c6578080602001905181019061253a9190612c5c565b6125c6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603160248201527f4c696245524332303a207472616e73666572206f72207472616e73666572467260448201527f6f6d2072657475726e65642066616c73650000000000000000000000000000006064820152608401610136565b612515565b80511561260657806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101369190612e69565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f4c696245524332303a207472616e73666572206f72207472616e73666572467260448201527f6f6d2072657665727465640000000000000000000000000000000000000000006064820152608401610136565b604080517f6c697374656400000000000000000000000000000000000000000000000000008152602c60068201528151908190036026019020600084815260209190915290812060018101546126e5575050612515565b8054801561274857600083602c01604051612723907f6c69737465640000000000000000000000000000000000000000000000000000815260060190565b9081526040805160209281900383019020600085815292529020600284810154910155505b600282015480156127a957600084602c01604051612789907f6c69737465640000000000000000000000000000000000000000000000000000815260060190565b908152604080516020928190038301902060008581529252902084549055505b6000868152602a85016020908152604080832060048101548452602b88019092529182902091517f6c69737465640000000000000000000000000000000000000000000000000000815290918891600601908152602001604051809103902054141561286457600284015460048201546000908152602b870160205260409081902090517f6c697374656400000000000000000000000000000000000000000000000000008152600601908152604051908190036020019020555b60006001850181905580855560028501556040517f6c697374656400000000000000000000000000000000000000000000000000008152602e860190600601908152604080516020928190038301902060008a81529252902080549094509250821561292557600085602e01604051612900907f6c69737465640000000000000000000000000000000000000000000000000000815260060190565b9081526040805160209281900383019020600087815292529020600286810154910155505b60028401549150811561298857600085602e01604051612968907f6c69737465640000000000000000000000000000000000000000000000000000815260060190565b908152604080516020928190038301902060008681529252902085549055505b506000868152602a85016020908152604080832073ffffffffffffffffffffffffffffffffffffffff89168452602d88018352818420600482015485529092529182902091517f6c697374656400000000000000000000000000000000000000000000000000008152909188916006019081526020016040518091039020541415612a8357600284015473ffffffffffffffffffffffffffffffffffffffff87166000908152602d870160209081526040808320600486015484529091529081902090517f6c697374656400000000000000000000000000000000000000000000000000008152600601908152604051908190036020019020555b600060018501819055808555600280860182905582015473ffffffffffffffffffffffffffffffffffffffff9081168252602f870160209081526040808420600386015485528252808420928a1684529181528183209290925560048301548151908152429281019290925288917f276ac39b0f98215592b4487434c1618e3e527c57ca2f471ac93eb4eab1694091910160405180910390a250505050505050565b60405180606001604052806003906020820280368337509192915050565b803573ffffffffffffffffffffffffffffffffffffffff81168114612b6757600080fd5b919050565b60008083601f840112612b7d578182fd5b50813567ffffffffffffffff811115612b94578182fd5b6020830191508360208083028501011115612bae57600080fd5b9250929050565b600080600080600060608688031215612bcc578081fd5b612bd586612b43565b9450602086013567ffffffffffffffff80821115612bf1578283fd5b612bfd89838a01612b6c565b90965094506040880135915080821115612c15578283fd5b50612c2288828901612b6c565b969995985093965092949392505050565b60008060408385031215612c45578182fd5b612c4e83612b43565b946020939093013593505050565b600060208284031215612c6d578081fd5b81518015158114612c7c578182fd5b9392505050565b600060208284031215612c94578081fd5b81517fffffffff0000000000000000000000000000000000000000000000000000000081168114612c7c578182fd5b600060208284031215612cd4578081fd5b5051919050565b60008284527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831115612d0c578081fd5b6020830280836020870137939093016020019283525090919050565b60008151808452612d40816020860160208601612f21565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60008251612d84818460208701612f21565b9190910192915050565b600073ffffffffffffffffffffffffffffffffffffffff808a16835280891660208401525060a06040830152612dc860a083018789612cdb565b8281036060840152612ddb818688612cdb565b90508281036080840152612def8185612d28565b9a9950505050505050505050565b600060408252612e11604083018688612cdb565b8281036020840152612e24818587612cdb565b979650505050505050565b600060608252612e43606083018789612cdb565b8281036020840152612e56818688612cdb565b9150508260408301529695505050505050565b600060208252612c7c6020830184612d28565b60008219821115612e8f57612e8f612faa565b500190565b600082612ec8577f4e487b710000000000000000000000000000000000000000000000000000000081526012600452602481fd5b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612f0557612f05612faa565b500290565b600082821015612f1c57612f1c612faa565b500390565b60005b83811015612f3c578181015183820152602001612f24565b838111156119da5750506000910152565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612f7f57612f7f612faa565b5060010190565b600063ffffffff80831681811415612fa057612fa0612faa565b6001019392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea164736f6c6343000802000a";

export class ShopFacet__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ShopFacet> {
    return super.deploy(overrides || {}) as Promise<ShopFacet>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ShopFacet {
    return super.attach(address) as ShopFacet;
  }
  connect(signer: Signer): ShopFacet__factory {
    return super.connect(signer) as ShopFacet__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ShopFacetInterface {
    return new utils.Interface(_abi) as ShopFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ShopFacet {
    return new Contract(address, _abi, signerOrProvider) as ShopFacet;
  }
}