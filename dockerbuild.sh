#!/bin/bash

#if script is running with sudo privileges...
if [ $(id -u) -eq 0 ]; then
# Run the 'docker info' command and capture its output
docker_info=$(docker info 2>/dev/null)

# Check if the 'docker info' command was successful
if [ $? -eq 0 ]; then
    # Check if the output contains information about authentication
    if echo "$docker_info" | grep -q "Username:"; then
        
  
  CI= npm run build


  arch=$(uname -m)
  
    echo "Building docker image..."
    docker build -t arthmc/observer:latest .
  

  docker push arthmc/observer:latest
  exit 0
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

