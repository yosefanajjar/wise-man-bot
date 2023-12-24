import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { VerifyDiscordRequest, InstallGlobalCommands } from "./utils.js";
import { ALL_COMMANDS } from "./commands.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(
  bodyParser.raw({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) })
);

/**`
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === "quote") {
      const quote = await quoteOfTheDay();
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: quote,
        },
      });
    }
  }
});

app.get("/", (req, res) =>
  res.json({ status: 200, message: "Wise Man Bot API" })
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
});
