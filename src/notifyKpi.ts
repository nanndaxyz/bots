import { utils } from "ethers";

import { AppConfig } from "../app.config";
import { sendMessage } from "./libs/slack";

import { getQuestView } from "./libs/quest-view/types";
import { culcRewards } from "./libs/quest-view/aggregation";

import { getDarkness } from "./libs/darkness/types";
import { culcLevelAvg } from "./libs/darkness/aggregation";

export const notify = async ({
  rewards,
  lvAvg,
}: {
  rewards: ReturnType<typeof culcRewards>;
  lvAvg: number;
}) => {
  const args = {
    channel: AppConfig.channelNames.kpi,
    text: "KPI",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:volcano: Unclaimed Quest Rewards`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: rewards.perQuests.map(({ questName, rewards }) => ({
          type: "mrkdwn",
          text: `*${questName}*\n${utils.formatEther(rewards)} NDT`,
        })),
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Sum*\n ${utils.formatEther(rewards.sum)} NDT`,
          },
        ],
      },
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `Darkness Lv Avg`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `${lvAvg} Lv.`,
          },
        ],
      },
    ],
  };

  await sendMessage(AppConfig.slackToken, args);
};

const main = async () => {
  const questView = await getQuestView();
  const darkness = await getDarkness();
  await notify({
    rewards: culcRewards(await questView.getDpositDatas()),
    lvAvg: await culcLevelAvg(darkness),
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
