#!/bin/bash

BASEDIR=$(dirname $0)
ENVIRONMENT=$1

installDependencies () {
    # check yarn
    if [ yarn ];
    then
        echo "Installing with yarn"
        yarn
    # check npm
    elif [ npm ];
    then
        echo "Installing with npm"
        npm install
    else
        echo "You need npm or yarn to run this project"
        exit 0
    fi
}

if [ "${ENVIRONMENT}" == "" ];
then
    echo "ENV cannot be undefined"
    exit 0
fi

if [ "${ENVIRONMENT}" == "local" ] || [ "${ENVIRONMENT}" == "debug" ]  || [ "${ENVIRONMENT}" == "dev" ] ;
then
    case "${ENVIRONMENT}" in
        local)
            echo "Deploying local..."
            cd lambda/
            installDependencies
            STAGE=local sls offline
        ;;
        debug)
            echo "Deploying local..."
            cd lambda/
            installDependencies
            STAGE=local sls offline
        ;;
        dev)
            echo "Deploying development..."
            cd lambda/
            installDependencies
            STAGE=dev sls deploy
        ;;
    esac
else
    echo "Canot find ENV ${ENVIRONMENT}"
fi
