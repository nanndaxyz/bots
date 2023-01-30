import { ethers } from "ethers";
import { FeeAmount } from "@uniswap/v3-sdk";
import * as dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  provider: new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC),
  slackToken: process.env.SLACK_TOKEN || "",
  channelNames: {
    price: "#200_ndt-eth_bots",
    kpi: "C04ESJT4G5R", // "#210_kpi-bots"
  },
  upperThresholdPrice: Number(process.env.UPPER_THRESHOLD_PRICE),
  lowerThresholdPrice: Number(process.env.LOWER_THRESHOLD_PRICE),
  uniswapV3FactoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  uniswapV3PoolFee: FeeAmount.HIGH,
  wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  ndtAddress: "0xD832D3B46E70c7b8B9DE15715c9c119B0fA99280",
  questViewAddress: "0x6a49CD67A9fb153e397De084588CC39BED8EF229",
  quests: [
    { address: "0x42dD5159a4b00563E972794049a161120023A8d1", name: "forest" },
    { address: "0x431922f3960076c8f7Ad52023544612fDA5442Bd", name: "coast" },
    { address: "0x33bF21D42C5d1A0B86E6490E3DeCd43082D45D18", name: "volcano" },
  ],
  darknessAddress: "0x91D1Da2e8E4FA5EB6dC8e60Ed2a81a652c6B7acb",
  liquidityProvisionStartBlocknumber: 15456415,
  mentionIds: [
    "U03PG5ZLYUS", // k.t
    "U03C1FNPN85", // y.t
    "U03C4BB0L6N", // t.a
  ],
};
