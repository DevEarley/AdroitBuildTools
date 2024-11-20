
REM %1 - Parent directory (D:\Builds)
REM %2 - Folder to zip (MM-dd-yy)
REM %3 - Zip file name (MM-dd-yy.zip)
REM %4 - Build Logs to include (path)
REM %5 - Target Directory (D:\Zips)
set temp_path=%1\%3
set temp_path_2=%1\%2
"C:\Program Files\7-Zip\7z.exe" a -tzip %temp_path% %temp_path_2% -r
"C:\Program Files\7-Zip\7z.exe" a -tzip %temp_path% %4
move %temp_path% %5

