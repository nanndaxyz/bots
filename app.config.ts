import { ethers } from "ethers";
import { FeeAmount } from "@uniswap/v3-sdk";
import * as dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  provider: new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC),
  slackToken: process.env.SLACK_TOKEN || "",
  slackChannel: "#200_ndt-eth_bots",
  upperThresholdPrice: Number(process.env.UPPER_THRESHOLD_PRICE),
  lowerThresholdPrice: Number(process.env.LOWER_THRESHOLD_PRICE),
  uniswapV3FactoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  uniswapV3PoolFee: FeeAmount.HIGH,
  wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  ndtAddress: "0xD832D3B46E70c7b8B9DE15715c9c119B0fA99280",
  liquidityProvisionStartBlocknumber: 15456415,
  mentionIds: [
    "U03PG5ZLYUS", // k.t
    "U03C1FNPN85", // y.t
    "U03C4BB0L6N", // t.a
  ],
};
