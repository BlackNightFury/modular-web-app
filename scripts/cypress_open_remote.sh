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

CYPRESS_baseUrl=https://"$ENVIRONMENT"."$ACCOUNT"-aws.reams-elias.co.uk cypress open
