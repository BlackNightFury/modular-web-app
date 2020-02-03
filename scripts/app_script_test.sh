#!/bin/bash

ENVIRONMENT=$2
ACCOUNT=$4
#!/bin/bash
if [ "$2" == "" ]; then
  ENVIRONMENT="int"
fi
if [ "$4" == "" ]; then
  ACCOUNT="test"
fi

cd ./infrastructure/serverless
#TODO - this should check cat ./node_modules/sharp/vendor/platform.json to see if its already compiled for local os
echo "Updating sharp for your local os"
rm -rf node_modules/sharp
npm install sharp
cd ../../
MWA_ENVIRONMENT=$ENVIRONMENT MWA_ACCOUNT=$ACCOUNT umi test --testPathIgnorePatterns=/infrastructure/acceptance_tests/ --testPathIgnorePatterns=/node_modules/
