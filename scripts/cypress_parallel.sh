#!/bin/bash

#Use CODEBUILD_BUILD_ID if it's set (ie we're running in codebuild), generate a unique value otherwise
CODEBUILD_BUILD_ID=${CODEBUILD_BUILD_ID:-tmp-elias-dev-codebuild:$(uuidgen)};
echo "Executing parrallel tests for build $CODEBUILD_BUILD_ID";

USE_PARALLEL=${USE_PARALLEL:-true}
echo "Parellel mode $USE_PARALLEL";
# exit
CYPRESS_NODES=${CYPRESS_NODES:-2}
CYPRESS_ENTRYPOINT=${CYPRESS_ENTRYPOINT:-./src/cypress/scripts/docker.sh}

echo "This command is being run with $CYPRESS_NODES cypress nodes"
# exit

#Clear down any containers that are hanging around (should only happen locally)
for (( i=1; i<=CYPRESS_NODES; i++ )); do
	docker rm -f "test_$i"
done

#This network *should* allow us to communicate back to the host from the test container
# using --network="host" caused an issue for xvfb as the display port was being shared
docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 test

if [ "$2" == "INT" ]; then
    SIT=https://int.test-aws.reams-elias.co.uk
else
	SIT=http://192.168.0.1:8000
fi

for (( i=1; i<=CYPRESS_NODES; i++ )); do
	echo "Running docker container test_$i";
	docker run --name "test_$i" --network=test --env CYPRESS_baseUrl=$SIT -d --env CI_BUILD_NUMBER=$CODEBUILD_BUILD_ID --env USE_PARALLEL=$USE_PARALLEL -v $(pwd):/src --entrypoint $CYPRESS_ENTRYPOINT cypress/included:3.4.1;
	# sleep 3;
done

echo "Started containers. Get logs and output to stdout"

for (( i=1; i<=CYPRESS_NODES; i++ )); do
	(docker logs "test_$i" -f | sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]//g") &
done


echo Waiting for cypress containers to exit
wait

echo Cypress parrallel execution done

EXIT=0
echo Cypress checking exit codes $EXIT

#Cypress returns a zero status code if it's successful, normally 1 if tests fail
#we can check if the execution wasn't perfect, by just checking the exit codes of each container
for (( i=1; i<=CYPRESS_NODES; i++ )); do

	EXIT_CODE=$(docker inspect "test_$i" --format='{{.State.ExitCode}}')

	if [ $EXIT_CODE -ne 0 ]
	then
		EXIT=-1
	fi

	echo "Cypress node test_$i exited with code $EXIT_CODE"

done

echo Cypress exit code is $EXIT
#Clean up after ourselves
docker network rm test

exit $EXIT
