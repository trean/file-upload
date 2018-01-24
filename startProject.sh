#!/usr/bin/env bash


command=$1
port=$(( $2 ? $2 : 80 ))
echo $command
echo $port

if [ $command == 'build' ]
then
    npm install
fi

[[ -d uploads ]] || mkdir uploads
PORT=${port} node server/server.js | tee -a server.log 1>/dev/null

cd app
if [ $command == 'build' ]
then
    npm install
fi

npm start