const build_batch_path = "D:\\Repos\\BuildServer\\BuildServer\\build-unity.bat";
const logs_path = "C:\\Users\\TheDean\\Desktop\\deno-logs.txt";
const is_unity_running =
    "D:\\Repos\\BuildServer\\BuildServer\\is-unity-running.bat";
const unity_is_not_running_message =
    "INFO: No tasks are running which match the specified criteria.";
const unity_is_busy_message =
    "Unity is currently in use. Please try again later.";
const zip_unity_path = "D:\\Repos\\BuildServer\\BuildServer\\zip-build.bat";
const zip_source = "";
const zip_target = "";
const get_latest_path = "D:\\Repos\\BuildServer\\BuildServer\\get-latest.bat";
const upload_command_path =
    "D:\\Repos\\BuildServer\\BuildServer\\upload-build.bat";
const discord_webhook =
    "https://discord.com/api/webhooks/1306749383945224274/H33mu7dKOIFV1d3uVSGEg2whmIsnehOeG2p5eYHGDmPpVhkpXVbdd-HYoxs5VXDw4U5W";

const trigger_command_build_link =
    "https://triggercmd.com/sb?b=pPp-mTpXm00kpxub";
const discord_message =
    "Build complete!\n Click this link to do another build:";

const arg1 = Deno.args[0];
const arg2 = Deno.args[1];

const logs: string[] = [];

let buildTime: number = 0;

const log = (message: string) => {
    console.log(message);
    logs.push(message);
};

const finished = () => {
    logToDiscord(discord_message + trigger_command_build_link);
    const logsWithNewlines = logs.join("\n");
    
    Deno.writeTextFile(
        logs_path,
        logsWithNewlines,
    );
};

const logToDiscord = async (log_message: string): Promise<any> => {
    logs.push(log_message);
    return await fetch(`${discord_webhook}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: log_message,
        }),
    });
};

const getLatest = async (): Promise<any> => {
    logToDiscord("Get Latest | started");
    const subpro = new Deno.Command(get_latest_path, { args: [] });
    return await subpro.output();
};

const zip = async (): Promise<any> => {
    const message = "Zip Unity Project | started";
    logToDiscord(message);

    const subpro = new Deno.Command(zip_unity_path, {
        args: [zip_source, zip_target],
    });
    return await subpro.output();
};

const uploadToGDrive = async (): Promise<any> => {
    logToDiscord("Upload to Google Drive | started");
    const subpro = new Deno.Command(upload_command_path, { args: [] });
    return await subpro.output();
};

const buildUnityProject = async (): Promise<any> => {
    logToDiscord("Build Unity Project | started");
    const subpro = new Deno.Command(build_batch_path, { args: [] });
    return await subpro.output();
};

const checkIsUnityRunning = async (): Promise<any> => {
    logToDiscord("checkIsUnityRunning | started");
    const subpro = new Deno.Command(is_unity_running, { args: [] });
    return await subpro.output();
};

const get_output_string = (buildUnityProject_output: any) => {
    const untrimmed_output = new TextDecoder().decode(
        buildUnityProject_output["stdout"],
    );
    const output_string = untrimmed_output.trim();
    return output_string;
};

const get_delta_time_in_seconds = () => {
    const time_completed = (new Date()).getTime();
    const delta_time = time_completed - buildTime;
    const delta_time_in_seconds = delta_time / 1000.0;
    return delta_time_in_seconds;
};

try {
    logToDiscord("Hello world");
    //run_build();
} catch {
    logToDiscord("Finished with errors");
    finished();
}

function run_build() {
    /*is unity busy?*/
    checkIsUnityRunning().then((checkIsUnityRunning_output) => {
        const output_string = get_output_string(checkIsUnityRunning_output);
        const unity_is_not_running = output_string.includes(
            unity_is_not_running_message,
        );
        if (unity_is_not_running) {
            logToDiscord("Free to use unity");

            /*Get the latest version of code*/
            getLatest().then((getLatest_output) => {
                const getLatest_output_string = get_output_string(
                    getLatest_output,
                );
                log("getLatest | finished" + getLatest_output_string);
                buildTime = (new Date()).getTime();

                /*Build Unity Project*/
                buildUnityProject().then((buildUnityProject_output: any) => {
                    const output_string = get_output_string(
                        buildUnityProject_output,
                    );
                    const delta_time_in_seconds = get_delta_time_in_seconds();
                    log("Build Unity Project | finished" + output_string);
                    logToDiscord("Build took " + delta_time_in_seconds + " seconds.");

                    /*Make zip*/
                    zip().then((zip_output) => {
                        const zip_output_string = get_output_string(zip_output);
                        logToDiscord("Zip | finished" + zip_output_string);

                        /*Upload zip to google*/
                        uploadToGDrive().then((uploadToGDrive_output) => {
                            const uploadToGDrive_output_string =
                                get_output_string(uploadToGDrive_output);
                                logToDiscord(
                                "Upload To GDrive | finished" +
                                    uploadToGDrive_output_string,
                            );
                            /* Done! */
                            logToDiscord("Complete");
                            finished();
                        }).catch((error_uploadToGDrive) => {
                            logToDiscord(error_uploadToGDrive);
                            throw new Error(
                                "uploadToGDrive | ERROR" + error_uploadToGDrive,
                            );
                        });
                    }).catch((error_zip) => {
                        const zip_error_message ="zip | ERROR" + error_zip;
                        logToDiscord(zip_error_message);
                        throw new Error(zip_error_message);
                    });
                }).catch((error_building_unity) => {
                    logToDiscord(error_building_unity);
                    throw new Error(
                        "Build Unity Project | ERROR" + error_building_unity,
                    );
                });
            }).catch((error_getting_latest) => {
                logToDiscord(error_getting_latest);
                throw new Error("getLatest | ERROR" + error_getting_latest);
            });
        } else {
            logToDiscord(unity_is_busy_message);
            throw new Error(unity_is_busy_message);
        }
    }).catch((error_checkIsUnityRunning) => {
        logToDiscord(error_checkIsUnityRunning);
        throw new Error(
            "checkIsUnityRunning | ERROR" + error_checkIsUnityRunning,
        );
    });
}
