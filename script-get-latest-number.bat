@echo off
cd %1
p4 changes -s submitted -m1 2>&1