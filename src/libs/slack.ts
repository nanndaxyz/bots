import { WebClient, ChatPostMessageArguments } from "@slack/web-api";

export const sendMessage = async (
  slackToken: string,
  args: ChatPostMessageArguments
) => {
  const web = new WebClient(slackToken);
  await web.chat.postMessage(args);
};
