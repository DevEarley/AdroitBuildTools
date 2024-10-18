#Adroit Build Tool
This exe allows developers to remotely build, test and publish any Unity3D project from a Perforce repo.

##Technology Stack
- Server OS: Windows 11
- Server runtime: Dino 2 app using typescript

##Features
###Uses a config.json for default values.
```json 
{
  "defaultRepo":"MHS",
  "serviceAccount":{
    "username":"AdroitSA",
    "password-keychain-name":"com.adroit.adroit_sa_password" // store in windows reg
  },
  "definedRepos:[
    {
      "connection":
    },
    {
    },  
  ]
}
```

###Can be invoked with command line arguments.
  
```bash

-l -L
  Get Latest.

-r -R <repo name>
  Pick a repository

-t -T <test case>
  Run automated testing.

-p -P
  Enable profiling.

-s -S
  Stream to twitch account
```
