import { BigNumber, Contract, utils } from "ethers";
import { FormatTypes } from "ethers/lib/utils";

import { AppConfig } from "../../../app.config";

const abi = [
  "constructor(address[])",
  "event OwnershipTransferred(address indexed,address indexed)",
  "function _questAddresses(uint256) view returns (address)",
  "function getDpositDatas() view returns (tuple(address,uint256,tuple(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint8,uint8,bool)[])[])",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function setQuest(address[])",
  "function transferOwnership(address)",
];

// IQuest.Data
type IQuestDataRaw = [
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  number,
  number,
  boolean
];

export type IQuestData = {
  holder: string;
  earningPower: BigNumber;
  reward: BigNumber;
  diedAt: BigNumber;
  depositedAt: BigNumber;
  lastUpdatedAt: BigNumber;
  termsUpdatedAt: BigNumber;
  endAt: BigNumber;
  remainingTime: BigNumber;
  life: number;
  depositPeriod: number;
  autoMode: boolean;
};

const toIQuestData = (raw: IQuestDataRaw): IQuestData => {
  const [
    holder,
    earningPower,
    reward,
    diedAt,
    depositedAt,
    lastUpdatedAt,
    termsUpdatedAt,
    endAt,
    remainingTime,
    life,
    depositPeriod,
    autoMode,
  ] = raw;
  return {
    holder,
    earningPower,
    reward,
    diedAt,
    depositedAt,
    lastUpdatedAt,
    termsUpdatedAt,
    endAt,
    remainingTime,
    life,
    depositPeriod,
    autoMode,
  };
};

// DepositData
type DepositDataRaw = [string, BigNumber, IQuestDataRaw[]];
export type DepositData = {
  questAddress: string;
  questId: BigNumber;
  datas: IQuestData[];
};
const toDepositData = (raw: DepositDataRaw): DepositData => {
  const [questAddress, questId, datas] = raw;
  return {
    questAddress,
    questId,
    datas: datas.map((d) => toIQuestData(d)),
  };
};

type QueryViewRaw = {
  getDpositDatas: () => Promise<DepositDataRaw[]>;
};

type QueryView = {
  getDpositDatas: () => Promise<DepositData[]>;
};

export const getQuestView = async (): Promise<QueryView> => {
  const provider = AppConfig.provider;

  const rawContract = new Contract(
    AppConfig.questViewAddress,
    abi,
    provider
  ) as unknown as QueryViewRaw;

  return {
    getDpositDatas: async () => {
      return (await rawContract.getDpositDatas()).map((d) => toDepositData(d));
    },
  };
};
