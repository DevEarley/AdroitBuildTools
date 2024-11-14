const arg1 = Deno.args[0];
const arg2 = Deno.args[1];
const logs: string[] = [];

const finished = () => {
    const logsWithNewlines = logs.join("\n");
    Deno.writeTextFile(
        "C:\\Users\\TheDean\\Desktop\\build-logs.txt",
        logsWithNewlines,
    );
};

const getLatest = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
    });
};

const buildUnityProject = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
    });
};

const log = (message:string) => {
    logs.push(message);
}

try {
    logs.push("Get Latest");
    getLatest().then(() => {
        log("Get Latest | finished");
    }).catch((error) => {
        log("Get Latest | error");
        throw ("Get Latest | ERROR" + error);
    });

    buildUnityProject().then(() => {
        log("Build Unity Project | finished");
    }).catch((error) => {
        log("Build Unity Project | error");
        throw ("Build Unity Project | ERROR" + error);
    });
    // upload build to google drive

    // notify users

    //write to logs
    finished();
} catch {
    finished();
}
