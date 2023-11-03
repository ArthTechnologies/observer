#!/bin/bash

#if script is running with sudo privileges...
if [ $(id -u) -eq 0 ]; then
# Run the git diff command
git diff --exit-code

# Check the exit code of the git diff command
if [ $? -ne 0 ]; then
  echo "Changes detected, building..."
  CI= npm run build
else
  echo "No changes in the source code, running..."
fi

docker run -d -p 3000:3000 arthmc/observer:latest

echo "Use 'docker ps' to find the ID of this container in order to stop it."

exit 0

else
  echo "This script is not running with sudo privileges. Run 'sudo sh dockerbuild.sh' instead."
  exit 1
fi

