import { AppConfig } from "../app.config";
import { getPool } from "./libs/uniswap";
import { sendMessage } from "./libs/slack";

const main = async () => {
  const [latestPrice, dayAgoPrice] = await Promise.all([
    ndtPrice(0),
    ndtPrice((60 / 15) * 60 * 24), // about a day ago
  ]);

  const diffRatio = ((latestPrice - dayAgoPrice) / dayAgoPrice) * 100;

  console.log(`latest     : 1NDT = ${latestPrice}WETH`);
  console.log(`a day ago  : 1NDT = ${dayAgoPrice}WETH`);
  console.log(`diff ratio : ${diffRatio}%`);

  if (
    latestPrice < AppConfig.lowerThresholdPrice ||
    AppConfig.upperThresholdPrice < latestPrice
  ) {
    await alert(latestPrice, dayAgoPrice, diffRatio);
  }
};

const ndtPrice = async (blocknumberDiff: number) => {
  const blocknumber =
    (await AppConfig.provider.getBlockNumber()) - blocknumberDiff;

  const targetBlocknumber =
    blocknumber < AppConfig.liquidityProvisionStartBlocknumber
      ? AppConfig.liquidityProvisionStartBlocknumber
      : blocknumber;

  const pool = await getPool(
    AppConfig.provider,
    AppConfig.uniswapV3FactoryAddress,
    AppConfig.wethAddress,
    AppConfig.ndtAddress,
    AppConfig.uniswapV3PoolFee,
    targetBlocknumber
  );

  const price =
    pool.token0.address == AppConfig.ndtAddress
      ? pool.token0Price
      : pool.token1Price;

  return Number(price.toSignificant(10));
};

export const alert = async (
  latestPrice: number,
  dayAgoPrice: number,
  diffRatio: number
) => {
  const uniswapUrl = `https://app.uniswap.org/#/swap?exactField=input&exactAmount=1&inputCurrency=${AppConfig.ndtAddress}&outputCurrency=eth`;

  const args = {
    channel: AppConfig.channelNames.price,
    text: "NDT Price",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:chart_with_upwards_trend: NDT Price :chart_with_upwards_trend:`,
          emoji: true,
        },
      },
      // {
      //   type: "section",
      //   fields: mentions(),
      // },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*latest:*\n${latestPrice.toString()}WETH`,
          },
          {
            type: "mrkdwn",
            text: `*about a day ago:*\n${dayAgoPrice.toString()}WETH`,
          },
          {
            type: "mrkdwn",
            text: `*diff:*\n${diffRatio.toString()}%`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*<${uniswapUrl}|Uniswap>*`,
          },
        ],
      },
    ],
  };

  await sendMessage(AppConfig.slackToken, args);
};

const mentions = () =>
  AppConfig.mentionIds.map((userId) => {
    return {
      type: "mrkdwn",
      text: `<@${userId}>`,
    };
  });

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
