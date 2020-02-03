#!/bin/bash

# ACCOUNT_IDS
# Craig: 5c1fdd09553b6b6604ec396f
# Victor: 557058:ac48b3de-40e5-40a6-8d21-aa7393d55311
# Slav: 5b686224be179e3d03c8145d
# Nikola: 5ca5f79cbb353819f2b5f2bc
# Eugen: 5aef2a1e2317186dc96aa6d8

ENVIRONMENT=""
EMAIL="$(git log -1 --pretty=format:'%ae')"

if [ "$CODEBUILD_WEBHOOK_ACTOR_ACCOUNT_ID" == "5c1fdd09553b6b6604ec396f" ]; then
  ENVIRONMENT="craig"
elif [ "$CODEBUILD_WEBHOOK_ACTOR_ACCOUNT_ID" == "557058:ac48b3de-40e5-40a6-8d21-aa7393d55311" ]; then
  ENVIRONMENT="victor"
elif [ "$CODEBUILD_WEBHOOK_ACTOR_ACCOUNT_ID" == "5b686224be179e3d03c8145d" ]; then
  ENVIRONMENT="slav"
elif [ "$CODEBUILD_WEBHOOK_ACTOR_ACCOUNT_ID" == "5ca5f79cbb353819f2b5f2bc" ]; then
  ENVIRONMENT="nikola"
elif [ "$CODEBUILD_WEBHOOK_ACTOR_ACCOUNT_ID" == "5aef2a1e2317186dc96aa6d8" ]; then
  ENVIRONMENT="eugen"
elif [ "$EMAIL" == "craig.edmunds@gmail.com" ]; then
  ENVIRONMENT="craig"
fi

if [ "$ENVIRONMENT" == "" ]; then
  echo ERROR: Unknown environment
  exit 1
fi

echo "pm2 start npm -- start -- --stage $ENVIRONMENT --account dev & wait-on http://localhost:8000"
pm2 start npm -- start -- --stage $ENVIRONMENT --account dev & wait-on http://localhost:8000
