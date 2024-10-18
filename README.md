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

-r -R <repo name>
  Pick a repository

-t -T <test case>
  Run automated testing.

-p -P
  Enable profiling.

-s -S
  Stream to twitch account
```
