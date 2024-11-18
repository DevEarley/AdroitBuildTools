# Adroit Build Tool
This exe allows developers to remotely build, test and publish any Unity3D project from a Perforce repo.

## Service Accounts
You will need a couple of "service accounts". It is reccommended you create a new SA for each server instance.
- TriggerCMD SA - One seat is free. After that you will need to pay. 
- Google Drive SA - Or use Adroit GDrive. 
- P4V SA - Or you could use your Dev account. 

## Technology Stack
- Server OS: Windows 11
- Deno - typescript app
- TriggerCMD - triggers the batch file from a link clicked by a developer.
- 7Zip - zips the build and the build logs
- Unity

## Setup 
1) Install Deno, 7Zip, P4V and Unity3D. 
    - To modify the deno scripts, you may want to use VSCode with the Deno extension.
2) Add a P4CONFIG file to the workspace's root folder (`D/Repos/MHS` in my case). 

```
P4CLIENT=UserName_Workspace_MHS2
P4USER=UserName
```
3) Install TriggerCMD client on your build server. Register client using website. 
 
4) Open command window with admin permission
5) run ```setx _gdrive_api_key <api key> \m```
6) run ```setx _discord_key <api key> \m```
7) Check ```maint.ts``` for path directories. Make changes as needed.

## Run
  
```
run-deno.bat
```
