import { GoogleAuth } from "npm:google-auth-library";

import { google } from "npm:googleapis";
import * as deno_commands from "./deno-commands.ts";
import * as deno_discord from "./deno-discord.ts";

let gdrive_client_secret = "";
let gdrive_client_id = "";
const arg1 = Deno.args[0];
const arg2 = Deno.args[1];

let buildTime: number = 0;
const build_batch_path = "D:\\Repos\\BuildServer\\BuildServer\\script-build-unity.bat";
const build_path = "D:\\Repos\\MHS";
const discord_message = "Click this link to do another build:\n";
const files_up_to_date_message = "File(s) up-to-date.";
const gdrive_client_id_path = "D:\\Repos\\BuildServer\\BuildServer\\script-get-gdrive-client-id.bat";
const gdrive_client_secret_path = "D:\\Repos\\BuildServer\\BuildServer\\script-get-gdrive-client-secret.bat";
const get_latest_number_path = "D:\\Repos\\BuildServer\\BuildServer\\script-get-latest-number.bat";
const get_latest_path = "D:\\Repos\\BuildServer\\BuildServer\\script-get-latest.bat";
const has_latest_path = "D:\\Repos\\BuildServer\\BuildServer\\script-has-latest.bat";
const is_unity_running = "D:\\Repos\\BuildServer\\BuildServer\\script-is-unity-running.bat";
const logs_path = "C:\\Users\\TheDean\\Desktop\\deno-logs.txt";
const path_to_build_logs = "C:\\Users\\TheDean\\Desktop\\build-logs.txt";
const trigger_command_build_link = "https://www.triggercmd.com/trigger/bookmark?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib29rbWFya3VzZXJfaWQiOiI2NzIxYThhNzVmM2EyNzAwMTIyZTQzYjciLCJjb21wdXRlcl9pZCI6IjY3MzYzOTlkNzI1M2M5MDAxM2MxYWI1ZCIsImNvbW1hbmRfaWQiOiI2NzM3NmJhNTcyNTNjOTAwMTNjMWUxOGUiLCJleHBpcmVzSW5TZWNvbmRzIjoiIiwiaWF0IjoxNzMxOTUxOTA0fQ.RxvIKCsdgaBQHZ6PYUIzEEw9_BSAzTNhLE6KuV9LoeY";
const unity_build_function = "AdroitBuilder.BuildProject";
const unity_is_not_running_message = "INFO: No tasks are running which match the specified criteria.";
const unity_location = "C:\\Program Files\\Unity\\Hub\\Editor\\2023.2.4f1\\Editor\\Unity.exe";
const unity_log_path = "C:\\Users\\TheDean\\Desktop\\build-logs.txt";
const unity_project_path = "D:\\Repos\\MHS\\MHS2_Upgrade\\MHS 2.0";
const zip_parent_directory = "D:\\Builds";
const zip_target_directory = "D:\\Zips\\";
const zip_unity_path = "D:\\Repos\\BuildServer\\BuildServer\\script-zip-build.bat";


const logs: string[] = [];
let logs_for_discord_part_1: string[] = [];
let logs_for_discord_part_2: string[] = [];

const log = (message: string, logs_for_discord: string[]) => {
    logs.push(message);
    logs_for_discord.push(message);
};

const updateDiscord = (logs_for_discord: string[]) => {
    deno_discord.sendLogsToDiscord(logs_for_discord)
};
const finished = () => {
    log(`========== Upload complete. ✅ ==========`, logs_for_discord_part_2);
    log(discord_message + trigger_command_build_link, logs_for_discord_part_2);
    updateDiscord(logs_for_discord_part_2);
    const logsWithNewlines = logs.join("\n");
    Deno.writeTextFile(
        logs_path,
        logsWithNewlines,
    );
};

const getGdriveClientSecret = async (): Promise<any> => {
    try {
        const result = await deno_commands.run_command(
            gdrive_client_secret_path,
            [],
        );
        const output_string = deno_commands.getOutputString(result);

        gdrive_client_secret = output_string.replace(
            "_gdrive_client_secret=",
            ""
        );
        log(output_string, logs_for_discord_part_2);

    } catch (error) {
        throw error;
    }
};
const getGdriveClientId = async (): Promise<any> => {
    try {
        const result = await deno_commands.run_command(gdrive_client_id_path, []);
        const output_string = deno_commands.getOutputString(result);

        gdrive_client_id = output_string.replace(
            "_gdrive_client_id=",
            ""
        );
        log(output_string, logs_for_discord_part_2);

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
            log(files_up_to_date_message, logs_for_discord_part_1);
            return;
        } else {
            const get_latest_result = await deno_commands.run_command(
                get_latest_path,
                [build_path],
            );
            const output_string_get_latest = deno_commands.getOutputString(
                get_latest_result,
            );
            log(output_string_get_latest, logs_for_discord_part_1);
        }
    } catch (error) {
        throw error;
    }
};

const getLatestNumber = async (): Promise<any> => {
    try {
        const result = await deno_commands.run_command(
            get_latest_number_path,
            [build_path],
        );
        const output_string = deno_commands.getOutputString(
            result,
        );
        log(output_string, logs_for_discord_part_1);
    } catch (error) {
        throw error;
    }
};

const zip = async (
    zip_target_folder: string,
    zip_file_name: string,
): Promise<any> => {
    try {
        buildTime = (new Date()).getTime();

        const output = await deno_commands.run_command(zip_unity_path, [
            zip_parent_directory,
            zip_target_folder,
            zip_file_name,
            path_to_build_logs,
        ]);
        const delta_time_in_seconds = getDeltaTimeInSeconds();

        log(

            "Zip took " + delta_time_in_seconds + " seconds.",
            logs_for_discord_part_2);
        log("zip complete.", logs_for_discord_part_2);

    } catch (error) {
        throw error;
    }
};

const uploadToGDrive = async (
    zip_file_name: string,
): Promise<any> => {

    const scopes = 'https://www.googleapis.com/auth/drive.file';
    log("Uploading To GDrive | START", logs_for_discord_part_2);
    const auth = new GoogleAuth({
        scopes: scopes,
    });
    const service = google.drive({ version: "v3", auth });
    const requestBody = {        name: zip_file_name,        fields: "id"    };
    const media = {
        mimeType: "application/zip",
        body: await Deno.readFile(zip_parent_directory + "//" + zip_file_name)
    };
    try {
        const file = await service.files.create({
            requestBody,
            media: media,
        });
        log("File Id:" + file.data.id, logs_for_discord_part_2);
        let uploadToGDrive_output = file.data.id;

        deno_discord.logToDiscord(            "Upload To GDrive | finished" +            uploadToGDrive_output        );
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

        log(
            "Build Unity Project | DONE" + output_string + "\n" +
            "Build took " + delta_time_in_seconds + " seconds.",
            logs_for_discord_part_2);
    } catch (error) {
        log("Build Unity Project | | ERROR", logs_for_discord_part_2);

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
        log(output_string, logs_for_discord_part_1);
        const unity_is_not_running = output_string.includes(
            unity_is_not_running_message,
        );
        if (unity_is_not_running) {
            log("Unity is available", logs_for_discord_part_1);
            return true;
        } else {
            log("Unity is busy. Please try again later.", logs_for_discord_part_1);
            throw new Error("Unity is in use. Please try again later.");
        }
    } catch (error) {
        log("error | checkIsUnityRunning", logs_for_discord_part_1);

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
    //TODO - use multiple functions in unity to control the scenes
    const date_string = new Date().toLocaleDateString();
    const zip_target_folder = date_string.replaceAll("/", "-");
    const zip_file_name = zip_target_directory + zip_target_folder + ".zip";
    deno_discord.logToDiscord(`========== Build started. 🏁 ==========`);
    getLatest().then(() => {
        getLatestNumber().then(() => {
            checkIsUnityRunning().then(() => {
                log(`========== Build complete. ✅ Upload started 🏁 ==========`, logs_for_discord_part_1);
                updateDiscord(logs_for_discord_part_1);
                buildUnityProject().then(() => {

                    setTimeout(() => {
                        zip(zip_target_folder, zip_file_name).then(() => {
                            finished();
                        });
                    }, 5000);
                });
            });
        });
    });
} catch {
    deno_discord.logToDiscord("========== Finished with errors. ==========");
}
