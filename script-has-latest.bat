@echo off
cd %1
REM p4 set P4CONFIG=P4CONFIG.txt
p4 sync -n -m 1 2>&1
