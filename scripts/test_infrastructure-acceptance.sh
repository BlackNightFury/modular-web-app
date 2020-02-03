#!/bin/bash
if [ "$1" == "--stage" ]; then
    STAGE=$2;
    ACCOUNT=$4;
    # echo "Stage"
elif [ "$3" == "--account" ]; then
    STAGE=$4;
    ACCOUNT=$2;
    # echo "Account"
fi;

MWA_STAGE="$STAGE" MWA_ACCOUNT="$ACCOUNT" umi test infrastructure/acceptance_tests
