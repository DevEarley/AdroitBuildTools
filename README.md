# Adroit Build Tool
This exe allows developers to remotely build, test and publish any Unity3D project from a Perforce repo.

## Technology Stack
- Server OS: Windows 11
- Server runtime: Dino 2 app using typescript

## Features
### Uses a config.json for default values.
(password is managed by windows)

```json 
{
  "defaultRepoName":"MHS",
  "perforceServer":"ssl:perforce.mhs.missouri.edu:1666",
  "serviceAccount":{
    "username":"AdroitSA",
    "password-keychain-name":"com.adroit.adroit_sa_password" 
  },
  "twitchAccount":{
    "username":"AdroitTester2",
    "password-keychain-name":"com.adroit.adroit_twitch_password" 
  },
  "itchIOAccount":{
    "username":"Adroit",
    "password-keychain-name":"com.adroit.adroit_itchio_password" 
  },
  "definedRepos":[
    {
      "name":"MHS",
      "workspaceName":"BuildTool_WS_MHS",
      "stream":"//MHS2/MHS2_Devline/"
    },
    {
      "name":"vSchool",
      "workspaceName":"BuildTool_WS_vSchool",
      "stream":"//ProSocial_Stream/ProSocial_Devline/"
    },  
  ]
}
```

### Can be invoked with command line arguments.
  
```
adroit-build-tool.exe
  Run this tool without arguments, it will get latest and build the default repo, without testing or profiling.

-l -L -latest
  Get Latest.

-c -C <changelist number>
  Get a specific Changelist number (runs a clean build)
  
-f -F -fresh
  Delete local copy and get fresh copy from repo

-ri -RI -reimport
  Delete the Library folder to force a reimport of all assets

-r -R -repo <repo name>
  Pick a repository

-tc -TC -testcase <test case>
  Run automated testing.

-p -P -profiling
  Enable profiling.

-s -S -stream
  Stream to twitch account

-tu -TU -twitch-username <username>
  Set twitch username

```

## Resources & Links

[Deno](https://deno.com/)

[Accessing Windows Credential Manager from PowerShell](https://stackoverflow.com/questions/29103238/accessing-windows-credential-manager-from-powershell)

[Gets a PowerShell Credential from the Windows Credential Manager. This only works for Generic Credentials ](https://gist.github.com/cdhunt/5729126)





