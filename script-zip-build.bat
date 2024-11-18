@echo off
REM %1 - Parent directory
REM %2 - Folder to zip
REM %3 - Zip file name
REM %4 - Build Logs to include
cd %1
"C:\Program Files\7-Zip\7z.exe" a -r %2 * %3
"C:\Program Files\7-Zip\7z.exe" a %4 %3
