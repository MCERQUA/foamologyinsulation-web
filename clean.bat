@echo off
echo Cleaning ComfortCo Website dependencies...
echo.

REM Remove node_modules directory
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)

REM Remove package-lock.json
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

REM Remove .astro cache
if exist .astro (
    echo Removing .astro cache...
    rmdir /s /q .astro
)

echo.
echo Clean complete! Now run: npm install
