#!/usr/bin/env python3

import os
import platform
import subprocess

def run_command(command):
    try:
        subprocess.run(command, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        exit(1)

def main():
    is_windows = platform.system().lower() == "windows"

    if is_windows:
        print("Running on Windows")
        run_command("npm run docker:build && npm run docker:compose")
    else:
        print("Running on Unix, using sudo...")
        run_command("sudo npm run docker:build && sudo npm run docker:compose")

if __name__ == "__main__":
    main()