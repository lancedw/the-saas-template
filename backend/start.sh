#!/bin/bash


# Install global dependencies if they are not installed
echo "Installing swc and nodemon..."

echo "Installing @swc/cli..."
npm install -g @swc/cli@latest --no-audit --no-fund --loglevel=silent
echo "Installing @swc/core..."
npm install -g @swc/core@latest --no-audit --no-fund --loglevel=silent
echo "Installing nodemon..."
npm install -g nodemon --no-audit --no-fund --loglevel=silent

echo "Installing done"

# Build the project using swc and start the app
echo "Building project..."
swc src --out-dir dist
node dist/app.js &
echo $! >.pidfile

# Start nodemon to watch the src directory and rebuild and rerun the app on changes
echo "Starting dev server..."
nodemon -L --watch src --ext js,ts,json --ignore dist/ --exec "bash -c 'swc src --out-dir dist && (kill \$(cat .pidfile) 2>/dev/null || true); node dist/app.js & echo \$! > .pidfile'" --delay 500ms
 
