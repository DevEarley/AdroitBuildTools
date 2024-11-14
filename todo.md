# Todo

## Desired functionality 
0) User clicks link and with query params (TriggerCMD)
1) WoL is invoked and PC is turned on. (nice to have, requires a second server, kinda defeats the point)
2) Get latest with P4V
3) Using Unity CLI, rebuild asset DB 
4) Using Unity CLI, build project
5) When build is done, zip the build folder and send it to google Drive
6) When Google drive is finished, send URL to discord.
7) If profiling build, send a message on discord when build is done
8) If Profiling build, start http server
9) If profiling build, launch Chromebook (needs WoL or needs to be on)
10) If profiling build, launch OBS, start streaming (each build has a "total run time" - stop streaming after this time)
11) If profiling build, and the stream is over, send a message on discord
12) Turn PC off.

## MVP requirements
1) Start deno app when dev clicks link (DONE)
2) Get latest from P4V using batch file.
3) Build unity project using batch file.
4) Upload to google drive (via post (https://developers.google.com/drive/api/guides/manage-uploads#simple))
5) Send messages on discord (using webhooks)
6) Store / retrieve credentials ( never store passwords as plain-text!! )
 
## Nice to have requirements
1) WoL Build PC
2) WoL Chromebook
3) Stream on twitch using obs

## Unity CLI

https://docs.unity3d.com/Manual/EditorCommandLineArguments.html

## batch files
> parameters passed through the command line can be accessed in batch files with the notation %1 to %9 
> There are also two other tokens that you can use:
>   %0 is the executable (batch file) name as specified in the command line.
>   %* is all parameters specified in the command line -- this is very useful if you want to forward the parameters to another program.
> (from stack overflow)

## Google Drive CLI
https://developers.google.com/drive/api/guides/manage-uploads#simple (Simple post)
https://github.com/glotlabs/gdrive (CLI)

## Discord using webhooks
https://hookdeck.com/webhooks/platforms/tutorial-how-to-configure-discord-webhooks-using-the-api

## Enable Wake On Lan (WoL)

### WoL on Chromebooks
``` set_wake_on_lan``` (chromebook terminal)

### WoL on Windows
This would require another server on my home network to wake up the PC.
Disable fast startup in Windows 11 to avoid conflicts with WoL.
https://www.solveyourtech.com/how-to-enable-wake-on-lan-in-windows-11-step-by-step-guide/
https://www.howtogeek.com/192642/how-to-remotely-turn-on-your-pc-over-the-internet/

Enter BIOS/UEFI settings.
Enable Wake on LAN.
Boot into Windows 11.
Open Device Manager.
Locate Network Adapter.
Enable Wake on LAN.
enable Magic Packet or Wake on Magic Packet.


## Perforce
### P4 CLI - Step #1 - Set Workspace
Before you can work in a stream, you must associate your workspace with the stream.

using windows "set" command, we need to assign a value  to the P4CLIENT environment variable.

> Set - Displays, sets, or removes cmd.exe environment variables. If used without parameters, set displays the current environment variable settings.

*From [Windows Set Command Reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/set_1)*

```set P4CLIENT=bruno_ws```
> Use the p4 client command to bind your workspace to the stream.

*From [P4Guide- Define a client](https://www.perforce.com/manuals/p4guide/Content/P4Guide/tutorial.create-workspace.html)*

```p4 client -S //JamCode/main```


### P4 CLI - Step #2 - Sync

```p4 sync ...```

> p4 sync - By passing in …​, we request to sync all files in the current directory.

*From [P4 Guide](https://www.perforce.com/manuals/p4guide/Content/P4Guide/tutorial.sync.html)*

### Unity 

```
set buildDate=%1
set projectpath="D:\Repos\MHS\MHS2_Upgrade\MHS 2.0"
set buildpath="D:\Builds\MHS2-"
set logpath="C:\Users\TheDean\Desktop\build-logs.txt"
"C:\Program Files\Unity\Editor\Unity.exe" -quit -batchmode -projectpath %projectpath% -buildTarget webgl %buildpath%%buildDate% -logFile %logpath%
```

