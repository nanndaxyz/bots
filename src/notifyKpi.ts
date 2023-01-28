import { utils } from "ethers";

import { AppConfig } from "../app.config";
import { sendMessage } from "./libs/slack";

import { getQuestView } from "./libs/quest-view/types";
import { culcRewards } from "./libs/quest-view/aggregation";

export const notify = async (rewards: ReturnType<typeof culcRewards>) => {
  const args = {
    channel: AppConfig.channelNames.kpi,
    text: "Unclaimed Quest Rewards",
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
    ],
  };

  await sendMessage(AppConfig.slackToken, args);
};

const main = async () => {
  const questView = await getQuestView();
  await notify(culcRewards(await questView.getDpositDatas()));
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
