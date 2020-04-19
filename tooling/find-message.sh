#!/bin/bash

# Exit when any command fails
set -e

MESSAGE=$(git log --format=%B -n 1 61c9c1fba4c66938a5c5d4f995e279f4eb9ed45b)
echo $MESSAGE