import 'dotenv/config'
import { InstallGlobalCommands } from './utils.js'
import { type Command } from './types/index.js'

// Command containing options
const GET_QUOTE_COMMAND: Command = {
  name: 'quote',
  description: 'Get a random quote from the wise man'
}

export const ALL_COMMANDS: Command[] = [GET_QUOTE_COMMAND]

void (async () => {
  await InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS)
})()
