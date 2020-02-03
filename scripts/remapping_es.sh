#!/bin/bash

if [ "$1" == "--stage" ]; then
    STAGE=$2;
    ACCOUNT=$4;
    TENANT=$6;
elif [ "$1" == "--account" ]; then
    STAGE=$4;
    ACCOUNT=$2;
    TENANT=$6;
fi;
echo "STAGE $STAGE"
echo "ACCOUNT $ACCOUNT"
echo "TENANT $TENANT"
MWA_STAGE="$STAGE" MWA_ACCOUNT="$ACCOUNT" MWA_TENANT="$TENANT" node ./scripts/remapping_es.js
