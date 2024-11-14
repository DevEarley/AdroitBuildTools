const build_batch_path = 'D:\\Repos\\BuildServer\\BuildServer\\build-unity.bat';
const logs_path ='C:\\Users\\TheDean\\Desktop\\deno-logs.txt';
const is_unity_running ='D:\\Repos\\BuildServer\\BuildServer\\is-unity-running.bat';
const arg1 = Deno.args[0];
const arg2 = Deno.args[1];
const logs: string[] = [];

const finished = () => {
    const logsWithNewlines = logs.join("\n");
    Deno.writeTextFile(
        logs_path,
        logsWithNewlines,
    );
};

const getLatest = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
    });
};

const buildUnityProject = async (): Promise<any> => {
    logs.push("Build Unity Project | started");
    const subpro = new Deno.Command(build_batch_path, { args: [] });
    return await subpro.output();
};
const checkIsUnityRunning = async (): Promise<any> => {
    logs.push("checkIsUnityRunning | started");
    const subpro = new Deno.Command(is_unity_running, { args: [] });
    return await subpro.output();
};

const log = (message: string) => {
    console.log(message);
    logs.push(message);
};

try {
    // check unity
    // get latest
    // build unity
    // zip
    // gdrive
    // discord with gdrive link

    // getLatest().then(() => {
    //     log("Get Latest | finished");
    // }).catch((error) => {
    //     log("Get Latest | error");
    //     throw ("Get Latest | ERROR" + error);
    // });
    checkIsUnityRunning().then((output) => {
       /*
       
       {
  success: true,
  code: 0,
  signal: null,
  stdout: [Getter],
  stderr: [Getter]
}
       */
const output_string:string = (new TextDecoder().decode(output["stdout"])).trim();
 
        if(output_string.includes("INFO: No tasks are running which match the specified criteria.")){
            log("Free to use unity")
        }
        else{
            log("Unity is in use");
        }
    }).catch((error) => {
        log("checkIsUnityRunning | error");
        throw ("checkIsUnityRunning | ERROR" + error);
    });
    // buildUnityProject().then((output: any) => {
    //     const output_string = (new TextDecoder().decode(output["stdout"])).trim();
    //     log("Build Unity Project | finished" + output_string);
    // }).catch((error) => {
    //     log("Build Unity Project | error");
    //     throw ("Build Unity Project | ERROR" + error);
    // });
    // upload build to google drive

    // notify users

    //write to logs
    finished();
} catch {
    finished();
}
