@ECHO OFF

SETLOCAL

SET "MAVEN_CMD_LINE_ARGS=%*"

SET "WRAPPER_JAR=.mvn\wrapper\maven-wrapper.jar"
SET "WRAPPER_PROPERTIES=.mvn\wrapper\maven-wrapper.properties"

FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%WRAPPER_PROPERTIES%") DO (
    IF "%%A"=="distributionUrl" SET "MAVEN_DISTRIBUTION_URL=%%B"
)

IF NOT DEFINED MAVEN_DISTRIBUTION_URL (
    ECHO ERROR: Could not find distributionUrl in "%WRAPPER_PROPERTIES%"
    GOTO :EOF
)

ECHO INFO: Found distributionUrl: %MAVEN_DISTRIBUTION_URL%

SET "MAVEN_PROJECT_DIR=%~dp0"

SET "MVNW_VERBOSE=false"
IF "%1"=="-v" SET "MVNW_VERBOSE=true"
IF "%1"=="--verbose" SET "MVNW_VERBOSE=true"

SET "MAVEN_OPTS="

ECHO INFO: MAVEN_PROJECT_DIR is set to %MAVEN_PROJECT_DIR%

SET "MAVEN_TARGET_DIR=%MAVEN_PROJECT_DIR%target"
SET "MAVEN_TARGET_CLASSIFIER=bin"
SET "MAVEN_TARGET_FILENAME=apache-maven-3.8.6-bin.zip"

SET "MAVEN_TARGET_ZIP=%MAVEN_TARGET_DIR%\%MAVEN_TARGET_FILENAME%"

IF NOT EXIST "%MAVEN_TARGET_ZIP%" (
    ECHO INFO: %MAVEN_TARGET_FILENAME% not found, downloading...
    IF NOT EXIST "%MAVEN_TARGET_DIR%" mkdir "%MAVEN_TARGET_DIR%"
    ECHO INFO: Downloading %MAVEN_DISTRIBUTION_URL% to %MAVEN_TARGET_ZIP%
    powershell.exe -Command "(New-Object System.Net.WebClient).DownloadFile('%MAVEN_DISTRIBUTION_URL%', '%MAVEN_TARGET_ZIP%')"
    IF ERRORLEVEL 1 (
        ECHO ERROR: Download of %MAVEN_DISTRIBUTION_URL% failed.
        EXIT /B 1
    )
) ELSE (
    ECHO INFO: %MAVEN_TARGET_FILENAME% found, skipping download.
)

SET "MAVEN_UNPACK_DIR=%MAVEN_TARGET_DIR%\unpack"

IF NOT EXIST "%MAVEN_UNPACK_DIR%" (
    ECHO INFO: %MAVEN_TARGET_FILENAME% not unpacked, unpacking...
    IF NOT EXIST "%MAVEN_UNPACK_DIR%" mkdir "%MAVEN_UNPACK_DIR%"
    powershell.exe -Command "Expand-Archive -Path '%MAVEN_TARGET_ZIP%' -DestinationPath '%MAVEN_UNPACK_DIR%' -Force"
    IF ERRORLEVEL 1 (
        ECHO ERROR: Unpacking of %MAVEN_TARGET_ZIP% failed.
        EXIT /B 1
    )
) ELSE (
    ECHO INFO: %MAVEN_TARGET_FILENAME% already unpacked, skipping.
)

SET "MAVEN_HOME="
FOR /D %%D IN ("%MAVEN_UNPACK_DIR%\apache-maven-*") DO SET "MAVEN_HOME=%%D"

IF NOT DEFINED MAVEN_HOME (
    ECHO ERROR: Could not find Maven home directory in %MAVEN_UNPACK_DIR%.
    EXIT /B 1
)

SET "MAVEN_BIN=%MAVEN_HOME%\bin"

ECHO INFO: Maven home: %MAVEN_HOME%

SET "PATH=%MAVEN_BIN%;%PATH%"

ECHO INFO: Running Maven command: mvn %MAVEN_CMD_LINE_ARGS%

CALL mvn %MAVEN_CMD_LINE_ARGS%

ENDLOCAL
