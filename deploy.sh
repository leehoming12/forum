#!/bin/bash

echo "Attempting to deploy to $1"
if [ $1 = "dev" ]; then
    echo "Deploying to dev"
    pm2 deploy ecosystem.nvm.config.js dev
    # Deploy to dev
elif [ $1 = 'uat' ]; then
    echo "Deploying to uat"
    # Deploy to uat
    pm2 deploy ecosystem.config.js uat
elif [ $1 = 'prd' ]; then
    echo "Deploying to prod"
    # Deploy to prod
    pm2 deploy ecosystem.config.js prd
else
    echo "Invalid argument"
    exit 1
fi