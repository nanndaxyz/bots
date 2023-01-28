import { BigNumber, utils } from "ethers";

import { DepositData } from "./types";
import { AppConfig } from "../../../app.config";

const sumBigNumber = (arr: BigNumber[]) => {
  return arr.reduce((prev, current) => {
    return prev.add(current);
  }, BigNumber.from(0));
};

const culcRewardsPerQuest = (
  d: DepositData
): { questName: string; rewards: BigNumber } => {
  const { questAddress, datas } = d;

  const questName = AppConfig.quests.find(({ address, name }) => {
    return utils.getAddress(questAddress) === utils.getAddress(address);
  })?.name;

  if (questName == null) throw new Error(`questName is unknown`);

  const rewards = sumBigNumber(datas.map((d) => d.reward));

  return {
    questName,
    rewards,
  };
};

export const culcRewards = (d: DepositData[]) => {
  const culculated = d.map(culcRewardsPerQuest);

  return {
    perQuests: culculated,
    sum: sumBigNumber(culculated.map(({ rewards }) => rewards)),
  };
};
