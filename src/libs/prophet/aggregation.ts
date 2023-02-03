import asyncRetry from "async-retry";

import { Prophet } from "./types";

const classes = [
  { id: 0, name: "Junior" },
  { id: 1, name: "Senior" },
  { id: 2, name: "Grand Master" },
  { id: 3, name: "Legend" },
];

export const getCounts = async (prophet: Prophet) => {
  return await Promise.all(
    classes.map(({ id, name }) => {
      return asyncRetry(async () => {
        const number = await prophet.classCount(id);
        return { className: name, number };
      });
    })
  );
};
