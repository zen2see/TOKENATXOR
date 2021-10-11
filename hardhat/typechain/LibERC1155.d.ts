/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface LibERC1155Interface extends ethers.utils.Interface {
  functions: {};

  events: {
    "ApprovalForAll(address,address,bool)": EventFragment;
    "TransferBatch(address,address,address,uint256[],uint256[])": EventFragment;
    "TransferFromParent(address,uint256,uint256,uint256)": EventFragment;
    "TransferSingle(address,address,address,uint256,uint256)": EventFragment;
    "TransferToParent(address,uint256,uint256,uint256)": EventFragment;
    "URI(string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferFromParent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferSingle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferToParent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
}

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean] & {
    _owner: string;
    _operator: string;
    _approved: boolean;
  }
>;

export type TransferBatchEvent = TypedEvent<
  [string, string, string, BigNumber[], BigNumber[]] & {
    _operator: string;
    _from: string;
    _to: string;
    _ids: BigNumber[];
    _values: BigNumber[];
  }
>;

export type TransferFromParentEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber] & {
    _fromContract: string;
    _fromTokenId: BigNumber;
    _tokenTypeId: BigNumber;
    _value: BigNumber;
  }
>;

export type TransferSingleEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber] & {
    _operator: string;
    _from: string;
    _to: string;
    _id: BigNumber;
    _value: BigNumber;
  }
>;

export type TransferToParentEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber] & {
    _toContract: string;
    _toTokenId: BigNumber;
    _tokenTypeId: BigNumber;
    _value: BigNumber;
  }
>;

export type URIEvent = TypedEvent<
  [string, BigNumber] & { _value: string; _id: BigNumber }
>;

export class LibERC1155 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: LibERC1155Interface;

  functions: {};

  callStatic: {};

  filters: {
    "ApprovalForAll(address,address,bool)"(
      _owner?: string | null,
      _operator?: string | null,
      _approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { _owner: string; _operator: string; _approved: boolean }
    >;

    ApprovalForAll(
      _owner?: string | null,
      _operator?: string | null,
      _approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { _owner: string; _operator: string; _approved: boolean }
    >;

    "TransferBatch(address,address,address,uint256[],uint256[])"(
      _operator?: string | null,
      _from?: string | null,
      _to?: string | null,
      _ids?: null,
      _values?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber[], BigNumber[]],
      {
        _operator: string;
        _from: string;
        _to: string;
        _ids: BigNumber[];
        _values: BigNumber[];
      }
    >;

    TransferBatch(
      _operator?: string | null,
      _from?: string | null,
      _to?: string | null,
      _ids?: null,
      _values?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber[], BigNumber[]],
      {
        _operator: string;
        _from: string;
        _to: string;
        _ids: BigNumber[];
        _values: BigNumber[];
      }
    >;

    "TransferFromParent(address,uint256,uint256,uint256)"(
      _fromContract?: string | null,
      _fromTokenId?: BigNumberish | null,
      _tokenTypeId?: BigNumberish | null,
      _value?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        _fromContract: string;
        _fromTokenId: BigNumber;
        _tokenTypeId: BigNumber;
        _value: BigNumber;
      }
    >;

    TransferFromParent(
      _fromContract?: string | null,
      _fromTokenId?: BigNumberish | null,
      _tokenTypeId?: BigNumberish | null,
      _value?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        _fromContract: string;
        _fromTokenId: BigNumber;
        _tokenTypeId: BigNumber;
        _value: BigNumber;
      }
    >;

    "TransferSingle(address,address,address,uint256,uint256)"(
      _operator?: string | null,
      _from?: string | null,
      _to?: string | null,
      _id?: null,
      _value?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        _operator: string;
        _from: string;
        _to: string;
        _id: BigNumber;
        _value: BigNumber;
      }
    >;

    TransferSingle(
      _operator?: string | null,
      _from?: string | null,
      _to?: string | null,
      _id?: null,
      _value?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        _operator: string;
        _from: string;
        _to: string;
        _id: BigNumber;
        _value: BigNumber;
      }
    >;

    "TransferToParent(address,uint256,uint256,uint256)"(
      _toContract?: string | null,
      _toTokenId?: BigNumberish | null,
      _tokenTypeId?: BigNumberish | null,
      _value?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        _toContract: string;
        _toTokenId: BigNumber;
        _tokenTypeId: BigNumber;
        _value: BigNumber;
      }
    >;

    TransferToParent(
      _toContract?: string | null,
      _toTokenId?: BigNumberish | null,
      _tokenTypeId?: BigNumberish | null,
      _value?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        _toContract: string;
        _toTokenId: BigNumber;
        _tokenTypeId: BigNumber;
        _value: BigNumber;
      }
    >;

    "URI(string,uint256)"(
      _value?: null,
      _id?: BigNumberish | null
    ): TypedEventFilter<
      [string, BigNumber],
      { _value: string; _id: BigNumber }
    >;

    URI(
      _value?: null,
      _id?: BigNumberish | null
    ): TypedEventFilter<
      [string, BigNumber],
      { _value: string; _id: BigNumber }
    >;
  };

  estimateGas: {};

  populateTransaction: {};
}
