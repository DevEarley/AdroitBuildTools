let discord_webook_key = "";
import * as deno_commands from "./deno-commands.ts";
const discord_webook_key_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-get-discord-webhook.bat";
const discord_webhook = "https://discord.com/api/webhooks/";

export const logToDiscord = async (log_message: string) => {

    console.log(log_message);
    await getDiscordKey();
    await fetch(`${discord_webhook + discord_webook_key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: log_message,
        }),
    });
};

export const sendLogsToDiscord = async (log_messages: string[]) :Promise<any> =>  {

    await getDiscordKey();
    await fetch(`${discord_webhook + discord_webook_key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: log_messages.join("\n"),
        }),
    });
};

async function getDiscordKey() {
  if (discord_webook_key == "") {
    const output_key = await deno_commands.run_command(
      discord_webook_key_path,
      []
    );
    const untrimmed_discord_webook_key = deno_commands.getOutputString(
      output_key
    );
    discord_webook_key = untrimmed_discord_webook_key.replace(
      "_DISCORD_KEY=",
      ""
    );
  }
}
