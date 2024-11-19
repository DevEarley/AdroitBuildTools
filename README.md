# Adroit Build Tool
This exe allows developers to remotely build, test and publish any Unity3D project from a Perforce repo.

## PC Requirements
- Windows 11 with 16 GB (or more) of ram (DDR4 or DDR5)
- SSD with 1 TB or more. 
- It is recommended to use the Chris Titus Tech Tool to debloat windows. https://christitus.com/windows-tool/
 - Switch to security updates only
 - Disable any features you don't need on this machine.

## Service Accounts
You will need a couple of "service accounts". It is reccommended you create a new SA for each server instance.
- TriggerCMD SA - One seat is free. After that you will need to pay. https://www.triggercmd.com/
- P4V SA - Or you could use your Dev account. 
- Google Account with google drive

## Technology Stack
- Server OS: Windows 11
- Deno - typescript app
- TriggerCMD - triggers the batch file from a link clicked by a developer.
- 7Zip - zips the build and the build logs
- Unity
- google drive for windows

## Setup 
1) Download and Install GDrive for Windows, Deno, 7Zip, P4V and Unity3D. 
    - To modify the deno scripts, you may want to use VSCode with the Deno extension.
2) Add a P4CONFIG file to the workspace's root folder (`D/Repos/MHS` in my case). 
```
P4CLIENT=UserName_Workspace_MHS2
P4USER=UserName
```
3) Install TriggerCMD client on your build server. Register client using website. 
4) Create a Zip folder, a Builds folder and a Repos folder on your fastest hard-drive (SDD is required)
5) Open command window with admin permission
6) run ```setx _discord_key <api key> \m```
7) Check ```maint.ts``` for path directories. Make changes as needed.

## Run
  
```
run-deno.bat
```
