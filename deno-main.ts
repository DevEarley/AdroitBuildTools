import * as deno_commands from "./deno-commands.ts";
import * as deno_discord from "./deno-discord.ts";

const arg1 = Deno.args[0];
const arg2 = Deno.args[1];

let buildTime: number = 0;
const build_batch_path = "D:\\Repos\\BuildServer\\BuildServer\\script-build-unity.bat";
const build_path = "D:\\Repos\\MHS";
const discord_message = "Click this link to do another build:\n";
const files_up_to_date_message = "File(s) up-to-date.";
const get_latest_number_path = "D:\\Repos\\BuildServer\\BuildServer\\script-get-latest-number.bat";
const get_latest_path = "D:\\Repos\\BuildServer\\BuildServer\\script-get-latest.bat";
const has_latest_path = "D:\\Repos\\BuildServer\\BuildServer\\script-has-latest.bat";
const is_unity_running = "D:\\Repos\\BuildServer\\BuildServer\\script-is-unity-running.bat";
const logs_path = "C:\\Users\\TheDean\\Desktop\\deno-logs.txt";
const path_to_build_logs = "C:\\Users\\TheDean\\Desktop\\build-logs.txt";

const trigger_command_build_link = "https://www.triggercmd.com/trigger/bookmark?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib29rbWFya3VzZXJfaWQiOiI2NzIxYThhNzVmM2EyNzAwMTIyZTQzYjciLCJjb21wdXRlcl9pZCI6IjY3MzYzOTlkNzI1M2M5MDAxM2MxYWI1ZCIsImNvbW1hbmRfaWQiOiI2NzNjZDg0OTU0N2ZjZTAwMTNiYjg0NTMiLCJleHBpcmVzSW5TZWNvbmRzIjoiIiwiaWF0IjoxNzMyMDQwNzk3fQ.iCF09geq4NJyTSBr9FS6U2nEZhUAaM8HO9rUyjDCY_A";

const unity_build_function = "AdroitBuilder.BuildProject";
const unity_is_not_running_message = "INFO: No tasks are running which match the specified criteria.";
const unity_location = "C:\\Program Files\\Unity\\Hub\\Editor\\2023.2.4f1\\Editor\\Unity.exe";
const unity_log_path = "C:\\Users\\TheDean\\Desktop\\build-logs.txt";
const unity_project_path = "D:\\Repos\\MHS\\MHS2_Upgrade\\MHS 2.0";
const zip_parent_directory = "D:\\Builds";
const zip_target_directory = "D:\\Zips";
const zip_unity_path = "D:\\Repos\\BuildServer\\BuildServer\\script-zip-build.bat";


const logs: string[] = [];
let logs_for_discord: string[] = [];

const log = (message: string) => {
    logs.push(message);
    logs_for_discord.push(message);
};

const finished = () => {
  
    log(discord_message + trigger_command_build_link);

    const logsWithNewlines = logs.join("\n");
    Deno.writeTextFile(
        logs_path,
        logsWithNewlines,
    );
};


const getLatest = async (): Promise<any> => {
    try {
        const has_latest_result = await deno_commands.run_command(
            has_latest_path,
            [build_path],
        );
        const output_string = deno_commands.getOutputString(has_latest_result);
        log(files_up_to_date_message);
        if (output_string.includes(files_up_to_date_message)) {
            return;
        } else {
            const get_latest_result = await deno_commands.run_command(
                get_latest_path,
                [build_path],
            );
            const output_string_get_latest = deno_commands.getOutputString(
                get_latest_result,
            );
            log(output_string_get_latest);
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
        deno_discord.logToDiscord(output_string);
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

        const result = await deno_commands.run_command(zip_unity_path, [
            zip_parent_directory,
            zip_target_folder,
            zip_file_name,
            path_to_build_logs,
            zip_target_directory
        ]);
        const output_string = deno_commands.getOutputString(result);
        log(output_string);
        const delta_time_in_seconds = getDeltaTimeInSeconds();
        deno_discord.logToDiscord(  "Zip took " + delta_time_in_seconds + " seconds.");

    } catch (error) {
        deno_discord.logToDiscord("Zip project | | ERROR");
        throw error;
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
            "Build took " + delta_time_in_seconds + " seconds.");
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
        log(output_string);
        const unity_is_not_running = output_string.includes(
            unity_is_not_running_message,
        );
        if (unity_is_not_running) {
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
    //TODO - use multiple functions in unity to control the scenes
    const date_string = new Date().toLocaleDateString();
    const zip_target_folder = date_string.replaceAll("/", "-");
    const zip_file_name = zip_target_folder + ".zip";
    deno_discord.logToDiscord(`========== Get Latest. 🏁  ${new Date().toLocaleTimeString()} ==========`);
    checkIsUnityRunning().then(() => {
        getLatest().then(() => {
            getLatestNumber().then(() => {
                deno_discord.logToDiscord(`========== Get Latest complete. ✅ Build started. 🏁 ${new Date().toLocaleTimeString()}==========`);
               buildUnityProject().then(() => {
                    deno_discord.logToDiscord(`========== Build complete. ✅ Zip started. 🏁 ${new Date().toLocaleTimeString()}==========`);
                    zip(zip_target_folder, zip_file_name).then(() => {
                        deno_discord.logToDiscord(`========== Zip complete. ✅ ${new Date().toLocaleTimeString()}==========`);
                        finished();
                    });

                });
           });
        });
    });
} catch {
    deno_discord.logToDiscord("========== Finished with errors. ==========");
    finished();

}
