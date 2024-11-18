import { GoogleAuth } from "npm:google-auth-library";

import { google } from "npm:googleapis";
import * as deno_commands from "./deno-commands.ts";
import * as deno_discord from "./deno-discord.ts";

let zip_file_name = "";
let gdrive_api_key = "";
const arg1 = Deno.args[0];
const arg2 = Deno.args[1];

const logs: string[] = [];

let buildTime: number = 0;

const build_batch_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-build-unity.bat";
const logs_path = "C:\\Users\\TheDean\\Desktop\\deno-logs.txt";
const is_unity_running =
    "D:\\Repos\\BuildServer\\BuildServer\\script-is-unity-running.bat";
const unity_is_not_running_message =
    "INFO: No tasks are running which match the specified criteria.";

const zip_unity_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-zip-build.bat";
const zip_parent_directory = "";
const zip_target_folder = "";
const get_latest_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-get-latest.bat";

const trigger_command_build_link =
    "https://triggercmd.com/sb?b=pPp-mTpXm00kpxub";
const discord_message =
    "Build complete!\n Click this link to do another build:";
const path_to_build_logs = "C:\\Users\\TheDean\\Desktop\\build-logs.txt";
const gdrive_api_key_path =
    "D:\\Repos\BuildServer\\BuildServer\\script-get-gdrive-key.bat";

const unity_project_path = "D:\\Repos\\MHS\\MHS2_Upgrade\\MHS 2.0";
const unity_log_path = "C:\\Users\\TheDean\\Desktop\\build-logs.txt";
const unity_build_function = "AdroitBuilder.BuildProject";
const unity_location =
    "C:\\Program Files\\Unity\\Hub\\Editor\\2023.2.4f1\\Editor\\Unity.exe";

const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/drive",
});

const finished = () => {
    deno_discord.logToDiscord(discord_message + trigger_command_build_link);
    const logsWithNewlines = logs.join("\n");

    Deno.writeTextFile(
        logs_path,
        logsWithNewlines,
    );
};

const getGdriveKey = async (): Promise<any> => {
    try {
        return await deno_commands.run_command(
            gdrive_api_key,
            [],
        );
    } catch (error) {
        throw error;
    }
};

const getLatest = async (): Promise<any> => {
    try {
        return await deno_commands.run_command(
            get_latest_path,
            [],
        );
    } catch (error) {
        throw error;
    }
};

const zip = async (): Promise<any> => {
    try {
        return await deno_commands.run_command(zip_unity_path, [
            zip_parent_directory,
            zip_target_folder,
            zip_file_name,
            path_to_build_logs,
        ]);
    } catch (error) {
        throw error;
    }
};

const uploadToGDrive = async (): Promise<any> => {
    deno_discord.logToDiscord("Upload To GDrive | started");
    // const service = google.drive({ version: "v3", auth });
    // const requestBody = {
    //     name: zip_file_name,
    //     fields: "id",
    // };
    // const media = {
    //     mimeType: "application/zip",
    //     body: await Deno.readFile(zip_target_folder),
    // };
    try {
        //     const file = await service.files.create({
        //         requestBody,
        //         media: media,
        //     });
        //     console.log("File Id:", file.data.id);
        //     let uploadToGDrive_output = file.data.id;

        //     deno_discord.logToDiscord(
        //         "Upload To GDrive | finished" +
        //             uploadToGDrive_output,
        //     );
        return true;
    } catch (err) {
        throw err;
    }
};

const buildUnityProject = async (): Promise<any> => {
    try {
        buildTime = (new Date()).getTime();
        const output = await deno_commands.run_command(
            build_batch_path,
            [
                unity_project_path,
                unity_log_path,
                unity_build_function,
                unity_location,
            ],
        );
        const output_string = getOutputString(
            output,
        );
        const delta_time_in_seconds = getDeltaTimeInSeconds();

        deno_discord.logToDiscord(
            "Build Unity Project | finished" + output_string + "\n" +
                "Build took " + delta_time_in_seconds + " seconds.",
        );
    } catch (error) {
        deno_discord.logToDiscord("errpr | buildUnityProject");

        throw error;
    }
};

const checkIsUnityRunning = async (): Promise<any> => {
    try {
        const output = await deno_commands.run_command(
            is_unity_running,
            [],
        );
        const output_string = getOutputString(output);
        deno_discord.logToDiscord(output_string);
        const unity_is_not_running = output_string.includes(
            unity_is_not_running_message,
        );
        if (unity_is_not_running) {
            deno_discord.logToDiscord("Unity is available");
            return true;
        } else {
            deno_discord.logToDiscord("Unity is busy. Please try again later.");
            throw new Error("Unity is in use. Please try again later.");
        }
    } catch (error) {
        deno_discord.logToDiscord("errpr | checkIsUnityRunning");

        throw error;
    }
};

const getOutputString = (buildUnityProject_output: any) => {
    const untrimmed_output = new TextDecoder().decode(
        buildUnityProject_output["stdout"],
    );
    const output_string = untrimmed_output.trim();
    return output_string;
};

const getDeltaTimeInSeconds = () => {
    const time_completed = (new Date()).getTime();
    const delta_time = time_completed - buildTime;
    const delta_time_in_seconds = delta_time / 1000.0;
    return delta_time_in_seconds;
};

try {
    deno_discord.logToDiscord("START!");

    //TODO - pass this to unity's AdroitBuilder.cs
    zip_file_name = new Date().toLocaleDateString().replace("/", "-") + ".zip";
    deno_discord.logToDiscord("Hello?");
//
       // checkIsUnityRunning().then((checkIsUnityRunning_result) => {
          //  buildUnityProject().then((buildUnityProject_result) => {
              //  uploadToGDrive().then((uploadToGDrive_result) => {
                    /* Done! */
                //    deno_discord.logToDiscord("Complete");
                 //   finished();
           //     });
         //   });
  //  });
} catch {
    deno_discord.logToDiscord("Finished with errors");
}
