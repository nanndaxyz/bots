import { Contract } from "ethers";

import { AppConfig } from "../../../app.config";

const abi = ["function classCount(uint8) view returns (uint32)"];

export type Prophet = {
  classCount: (_class: number) => Promise<number>;
};

export const getProphet = async (): Promise<Prophet> => {
  const provider = AppConfig.provider;

  const rawContract = new Contract(
    AppConfig.prophetAddress,
    abi,
    provider
  ) as unknown as Prophet;

  return rawContract;
};
