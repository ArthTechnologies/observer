#!/bin/bash

#if script is running with sudo privileges...
if [ $(id -u) -eq 0 ]; then
# Run the 'docker info' command and capture its output
docker_info=$(docker info 2>/dev/null)

# Check if the 'docker info' command was successful
if [ $? -eq 0 ]; then
    # Check if the output contains information about authentication
    if echo "$docker_info" | grep -q "Username:"; then
        
  echo "Enter the name of the container (ex: arthmc/observer):"
  read container_name
  CI= npm run build
  docker build . -t $container_name
  docker push $container_name
    else
        echo "You are not logged into Docker."
    fi
else
    echo "Docker is not installed or not running."
fi
else
  echo "This script is not running with sudo privileges. Run 'sudo sh dockerbuild.sh' instead."
  exit 1
fi

