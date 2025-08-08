@echo off
REM ComfortCo Website - Quick Setup Script for Windows

echo Setting up ComfortCo Website...
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

REM Install the glass component from 21st.dev
echo Installing glass component from 21st.dev...
call npx shadcn@latest add "https://21st.dev/r/suraj-xd/liquid-glass"

echo.
echo Setup complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
