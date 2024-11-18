import { GoogleAuth } from "npm:google-auth-library";

import { google } from "npm:googleapis";
import * as deno_commands from "./deno-commands.ts";
import * as deno_discord from "./deno-discord.ts";

let gdrive_api_key = "";
const arg1 = Deno.args[0];
const arg2 = Deno.args[1];

const logs: string[] = [];

let buildTime: number = 0;
const files_up_to_date_message = "File(s) up-to-date.";
const build_batch_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-build-unity.bat";
const build_path = "D:\\Repos\\MHS";
const logs_path = "C:\\Users\\TheDean\\Desktop\\deno-logs.txt";
const is_unity_running =
    "D:\\Repos\\BuildServer\\BuildServer\\script-is-unity-running.bat";
const unity_is_not_running_message =
    "INFO: No tasks are running which match the specified criteria.";

const zip_unity_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-zip-build.bat";
const zip_parent_directory = "D:\\Builds";

const get_latest_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-get-latest.bat";
const has_latest_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-has-latest.bat";

const trigger_command_build_link =
    "https://www.triggercmd.com/trigger/bookmark?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib29rbWFya3VzZXJfaWQiOiI2NzIxYThhNzVmM2EyNzAwMTIyZTQzYjciLCJjb21wdXRlcl9pZCI6IjY3MzYzOTlkNzI1M2M5MDAxM2MxYWI1ZCIsImNvbW1hbmRfaWQiOiI2NzM3NmJhNTcyNTNjOTAwMTNjMWUxOGUiLCJleHBpcmVzSW5TZWNvbmRzIjoiIiwiaWF0IjoxNzMxOTQ5MDQ4fQ.t-Wtpdx3AMjHv2djmCHd7YzACsq4PAzDWDF-AqQzTMY";
const discord_message =
    "Build complete!\n Click this link to do another build:";
const path_to_build_logs = "C:\\Users\\TheDean\\Desktop\\build-logs.txt";
const gdrive_api_key_path =
    "D:\\Repos\\BuildServer\\BuildServer\\script-get-gdrive-key.bat";

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
        const has_latest_result = await deno_commands.run_command(
            has_latest_path,
            [build_path],
        );
        const output_string = deno_commands.getOutputString(has_latest_result);
        if (output_string.includes(files_up_to_date_message)) {
            deno_discord.logToDiscord(files_up_to_date_message);
            return;
        } else {
            const get_latest_result =  await deno_commands.run_command(
                get_latest_path,
                [build_path],
            );
            const output_string_get_latest = deno_commands.getOutputString(get_latest_result);
            console.log(output_string_get_latest);
        }
    } catch (error) {
        throw error;
    }
};

const zip = async (
    zip_target_folder: string,
    zip_file_name: string,
): Promise<any> => {
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
    deno_discord.logToDiscord("Uploading To GDrive | START");
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
        const output_string = deno_commands.getOutputString(
            output,
        );
        const delta_time_in_seconds = getDeltaTimeInSeconds();

        deno_discord.logToDiscord(
            "Build Unity Project | DONE" + output_string + "\n" +
                "Build took " + delta_time_in_seconds + " seconds.",
        );
    } catch (error) {
        deno_discord.logToDiscord("Build Unity Project | | ERROR");

        throw error;
    }
};

const checkIsUnityRunning = async (): Promise<any> => {
    try {
        const output = await deno_commands.run_command(
            is_unity_running,
            [],
        );
        const output_string = deno_commands.getOutputString(output);
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
        deno_discord.logToDiscord("error | checkIsUnityRunning");

        throw error;
    }
};

const getDeltaTimeInSeconds = () => {
    const time_completed = (new Date()).getTime();
    const delta_time = time_completed - buildTime;
    const delta_time_in_seconds = delta_time / 1000.0;
    return delta_time_in_seconds;
};

try {
    

    //TODO - pass this to unity's AdroitBuilder.cs
    const date_string = new Date().toLocaleDateString();
    const zip_target_folder = date_string.replaceAll("/", "-");
    const zip_file_name = zip_target_folder + ".zip";

    getLatest().then(() => {
        checkIsUnityRunning().then(() => {
            deno_discord.logToDiscord("Build Unity Project | START");
            buildUnityProject().then(() => {
                zip(zip_target_folder, zip_file_name).then(() => {
                 //   uploadToGDrive().then(() => {
                        /* Done! */
                        finished();
                  //  });
                });
            });
        });
    });
} catch {
    deno_discord.logToDiscord("Finished with errors");
}
