#!/bin/bash
PROJECT="$4"
REGION="eu-west-2"
CODEBUILD_BUILD_URL="$CODEBUILD_BUILD_URL"
CODEBUILD_SOURCE_REPO_URL="$CODEBUILD_SOURCE_REPO_URL"
COMMITTER="$(git log -1 --pretty=format:'%an')"
COMMIT_MESSAGE="$(git log -1 --pretty=format:'%B')"
GIT_HASH="$(git log -1 --pretty=format:'%H')"
ABBREVIATED_GIT_HASH="$(git log -1 --pretty=format:'%h')"
BRANCH="$(git branch --contains $GIT_HASH)"

echo $CODEBUILD_BUILD_URL
echo $CODEBUILD_SOURCE_REPO_URL

if [ "$6" == "TEST" ]; then
    if [ "$2" == "SUCCESS" ]; then
        SLACK_TEXT="
        :white_check_mark: *<$CODEBUILD_BUILD_URL|Succeeded to pass tests>*
        $8 Test suite *passed* for project $REGION($PROJECT)
        ";
    else 
        SLACK_TEXT="
        :no_entry: *<$CODEBUILD_BUILD_URL|Failed to pass tests>*
        $8 Test suite *failed* for project $REGION($PROJECT)
        ";
    fi
else
    if [ "$2" == "SUCCESS" ]; then
        SLACK_TEXT="
        :white_check_mark: *<$CODEBUILD_BUILD_URL|Deployed to int>*
        Build *succeeded* for project $REGION($PROJECT)
        ";
    else 
        SLACK_TEXT="
        :no_entry: *<$CODEBUILD_BUILD_URL|Deployed to int failed>*
        Build *failed* for project $REGION($PROJECT)
        ";
    fi
fi

SLACK_ATTACHMENT="[{'author_name':'$COMMITTER','title':'\`$ABBREVIATED_GIT_HASH\` $COMMIT_MESSAGE','title_link':'$CODEBUILD_SOURCE_REPO_URL/commits/$GIT_HASH','text':'$BRANCH'}]"
#echo $SLACK_ATTACHMENT
SLACK_HOOK_URL="https://hooks.slack.com/services/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"

curl --header "Content-Type: application/json" \
  --request POST \
  --data "{'text':'$SLACK_TEXT', 'attachments': $SLACK_ATTACHMENT}" \
  $SLACK_HOOK_URL