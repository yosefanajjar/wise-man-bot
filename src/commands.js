import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

// Command containing options
const GET_QUOTE_COMMAND = {
  name: "quote",
  description: "Get a random quote from the wise man",
};

export const ALL_COMMANDS = [GET_QUOTE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
