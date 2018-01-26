#!/usr/bin/env bash


command=$1
port=$(( $2 ? $2 : 80 ))
echo $command
echo $port

if [ $command == 'build' ]
then
    npm install
    cd app
    npm install
    npm run build
    cd ../
fi

[[ -d static ]] && [[ -d static/uploads ]] || mkdir -p static/uploads
cd server
PORT=${port} node server.js | tee -a server.log
