
#!/bin/bash
if [ "$2" == "--stage" ]; then
    STAGE=$3;
    ACCOUNT=$5;
    VERSION=${7:-wip};
    # echo "Stage"
elif [ "$2" == "--account" ]; then
    STAGE=$5;
    ACCOUNT=$3;
    VERSION=${7:-wip};
    # echo "Account"
fi;

if [ ! -d "./etc/$ACCOUNT/$STAGE" ]; then
  echo "Directory ./etcx/$ACCOUNT/$STAGE DOES NOT exists."
  exit 1
fi

# echo "Stage : $STAGE";
# echo "Account : $ACCOUNT";
# echo "Profile : $AWS_PROFILE";
echo "Version : $VERSION";
# exit;

if [[ $AWS_PROFILE =~ .*$ACCOUNT.* ]]; then
    echo "Deploying to account $ACCOUNT environment $STAGE using AWS Profile $AWS_PROFILE and config path ./etc/$ACCOUNT/$STAGE";

elif [[ -z "$SKIP_PROFILE_CHECK" ]]; then

    echo "AWS_PROFILE env var does not include account name - suggests we're about to deploy to the wrong account. Please re-check and try again."

    echo
    echo "export AWS_PROFILE=reams-$ACCOUNT is the likely solution";
    echo
    echo
    exit;

else

    #This is intended to be used in something like AWS code pipeline, where we use instance
    # roles, rather than cli profiles
    # expects an env var such as SKIP_PROFILE_CHECK=true to be set
    echo "Skipping AWS_PROFILE check. SHOULD ONLY BE USED IN BUILD SERVERS!"

fi;

if [[ ! -z "$BUILD_OVERRIDE_STAGE" ]]; then
    echo "BUILD_OVERRIDE_STAGE provided, will build with $BUILD_OVERRIDE_STAGE"
fi;

if [[ ! -z "$SKIP_ACCEPTANCE_TESTS" ]]; then
    echo "SKIP_ACCEPTANCE_TESTS provided, will skip api acceptance tests"
fi;

if [ "$1" == "deploy" ] || [ "$1" == "s3sync" ]; then

    if [[ ! -z "$SKIP_BUILD" ]]; then
        echo "SKIP_BUILD provided, will skip the build task"
    else
        npm run build -- --stage $STAGE --account $ACCOUNT --version $VERSION

        # exit;
        
        build_result=$?
        # build_result=0
        
        if [ $build_result != 0 ]; then
            echo "Build didn't complete successfully $build_result"
            exit -1
        else
            echo "Done build $build_result"
        fi

        echo "pwd after build completion (should be mwa dir) : $(pwd)"

        # cd ../../
            
    fi; 
    
    echo "pwd before cd into serverless (should be mwa dir) : $(pwd)"

    cd ./infrastructure/serverless

    echo "pwd pre sharp build (should be serverless dir) : $(pwd)"

    if [ "$1" == "s3sync" ]; then
        echo "s3 sync, will skip the re-build of sharp"
    elif [[ ! -z "$SKIP_SHARP_BUILD" ]]; then
        echo "SKIP_SHARP_BUILD provided, will skip the re-build of sharp"
    else
        #TODO - this should check cat ./node_modules/sharp/vendor/platform.json to see if its already compiled for linux
        # echo "Updating sharp for darwin"
        rm -rf node_modules/sharp
        npm install --arch=x64 --platform=linux --target=8.10.0 sharp
    fi;

    echo "pwd pre deploy (should be serverless dir) : $(pwd)"
    # exit
    echo "running sls $1"
    
    ./node_modules/.bin/serverless $1 -v --account $ACCOUNT --stage $STAGE

    sls_result=$?

    cd ../../

    if [ $sls_result != 0 ]; then
        echo "Deploy didn't complete successfully $sls_result"
        exit -1
    elif [[ ! -z "$SKIP_ACCEPTANCE_TESTS" ]]; then
        echo "Done deploy $sls_result. Skipping tests as SKIP_ACCEPTANCE_TESTS env var set"
    else
        echo "Done deploy $sls_result"
        npm run test:infrastructure-acceptance -- --stage $STAGE --account $ACCOUNT
    fi

# elif [ "$1" == "remove" ]; then
#     ./node_modules/.bin/serverless remove --stage $STAGE --account $ACCOUNT
else
    echo "pwd before cd into serverless (should be mwa dir) : $(pwd)"

    cd ./infrastructure/serverless

    echo "pwd pre sls $1 (should be serverless dir) : $(pwd)"

     ./node_modules/.bin/serverless $1 --stage $STAGE --account $ACCOUNT
    # echo "No serverless command passed. Exiting"
fi
