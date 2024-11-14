@echo off
set projectpath="D:\Repos\MHS\MHS2_Upgrade\MHS 2.0"
set logpath="C:\Users\TheDean\Desktop\build-logs.txt"
set buildFunction="AdroitBuilder.BuildProject"
"C:\Program Files\Unity\Hub\Editor\2023.2.4f1\Editor\Unity.exe" -quit -batchmode -projectpath %projectpath% -executeMethod %buildFunction% -logFile %logpath%

