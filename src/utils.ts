import 'dotenv/config'
import axios from 'axios'
import { verifyKey } from 'discord-interactions'
import { type Request, type Response } from 'express'
import { type Command } from './types'

type Signature = string
| Buffer
| Uint8Array
| ArrayBuffer

export function VerifyDiscordRequest (clientKey: string) {
  return function (req: Request, res: Response, buf: Buffer, encoding: string) {
    const signature = req.get('X-Signature-Ed25519') as Signature
    const timestamp = req.get('X-Signature-Timestamp') as Signature

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey)
    if (!isValidRequest) {
      res.status(401).send('Bad request signature')
      throw new Error('Bad request signature')
    }
  }
}

interface DiscordRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body: string
}

export const DiscordRequest = async (
  endpoint: string,
  options: DiscordRequestOptions
): Promise<globalThis.Response> => {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent':
        'WiseManBot (https://github.com/yosefanajjar/wise-man-bot, 1.0.0)'
    },
    ...options
  })
  // throw API errors
  if (!res.ok) {
    const data = await res.json()
    console.log(res.status)
    throw new Error(JSON.stringify(data))
  }
  // return original response
  return res
}

export const InstallGlobalCommands = async (
  appId: string | undefined,
  commands: Command[]
): Promise<void> => {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(commands) // Stringify payloads
    })
  } catch (err) {
    console.error(err)
  }
}

export const quoteOfTheDay = async (): Promise<string | void> => {
  try {
    const { data } = await axios.get('https://api.quotable.io/random')
    return `“${data.content}” by ${data.author}`
  } catch (error) {
    console.log(error)
  }
}
