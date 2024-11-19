@echo off
REM %1 - Parent directory
REM %2 - Folder to zip
REM %3 - Zip file name
REM %4 - Build Logs to include
REM %5 - Target Directory
cd %1
"C:\Program Files\7-Zip\7z.exe" a -tzip -r %2 * %3
"C:\Program Files\7-Zip\7z.exe" a -tzip %4 %3
move %1\%3 %5
