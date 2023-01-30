import asyncRetry from "async-retry";

import { Darkness } from "./types";

export const culcLevelAvg = async (darkness: Darkness) => {
  const totalSupply = await darkness.totalSupply();

  const levels = (
    await Promise.all(
      [...Array(totalSupply.toNumber()).keys()].map(async (index) => {
        return asyncRetry(async () => {
          const tokenId = await darkness.tokenByIndex(index);
          return await darkness.darknessData(tokenId);
        });
      })
    )
  ).map(({ level }) => level);
  return (
    levels.reduce((prev, current) => prev + current, 0) / totalSupply.toNumber()
  );
};
