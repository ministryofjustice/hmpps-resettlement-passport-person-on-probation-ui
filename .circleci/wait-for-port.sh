#!/usr/bin/env bash
port=${1:-8080}
echo "waiting for port $port to be available on localhost"
timeout 30 sh -c "until nc -z localhost $port; do sleep 0.5; done"
