
REM %1 - Parent directory
REM %2 - Folder to zip
REM %3 - Zip file name
REM %4 - Build Logs to include
REM %5 - Target Directory
set temp_path=%1\%3
cd %1
"C:\Program Files\7-Zip\7z.exe" a -tzip %temp_path% %2 -r -w %1
"C:\Program Files\7-Zip\7z.exe" a -tzip %temp_path% %4 -w %1
move %temp_path% %5

