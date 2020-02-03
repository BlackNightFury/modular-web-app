#!/bin/bash

echo "Cypress parallel mode: $USE_PARALLEL"
echo Inside docker $(pwd)
export DEBUG=xvfb,cypress:xvfb,cypress:cli
env

cd /src

echo Inside MWA src $(pwd)

if $USE_PARALLEL; then
  npx cypress run --key 70fffb7e-ccad-4045-8e4f-156c7d32be21 --record --parallel --ci-build-id $CI_BUILD_NUMBER;
else
  npx cypress run
fi

CYPRESS_EXIT=$?

#Cypress returns a zero status code if it's successful, normally 1 if tests fail
echo "Cypress returned $CYPRESS_EXIT"

# EXIT=0
# echo "EXIT CODE $EXIT"

exit $CYPRESS_EXIT
