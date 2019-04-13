@echo off

cl /nologo /O2 /Ox /DNODEPS /DDJGPP /DWIN32 ..\src\dcraw.c

REM notes
REM cl /MT /nologo /O2 /Ox -c /arch:SSE2  -D_X86_=1  /D_WINDOWS /D_WIN32_WINDOWS=0x501 /DWINVER=0x501 /D_CRT_SECURE_NO_WARNINGS /D_WIN32 /DWIN32  /I ../lcms/include /I ../libjpeg/jpeg  dcraw_im.c
REM cl /ML /nologo /O2 /Ox -c /arch:SSE2  -D_X86_=1  /D_WINDOWS /D_WIN32_WINDOWS=0x0601 /DWINVER=0x0601 /D_CRT_SECURE_NO_WARNINGS /D_WIN32 /DWIN32  /I ../lcms/include /I ../libjpeg/jpeg  dcraw_im.c
