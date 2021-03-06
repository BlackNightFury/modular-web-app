
#!/bin/bash
ENVIRONMENT=$2
ACCOUNT=$4
VERSION=$6

#!/bin/bash
if [ "$2" == "" ]; then
  ENVIRONMENT="int"
fi
if [ "$4" == "" ]; then
  ACCOUNT="test"
fi

rm -f ./.umirc.$ENVIRONMENT.js
touch ./.umirc.$ENVIRONMENT.js
echo "export default {" >> ./.umirc.$ENVIRONMENT.js
echo "define: {" >> ./.umirc.$ENVIRONMENT.js
echo "Environment: '$ENVIRONMENT'," >> ./.umirc.$ENVIRONMENT.js
echo "Account: '$ACCOUNT'," >> ./.umirc.$ENVIRONMENT.js
echo "Version: '$VERSION'," >> ./.umirc.$ENVIRONMENT.js
echo "}" >> ./.umirc.$ENVIRONMENT.js
echo "}" >> ./.umirc.$ENVIRONMENT.js
UMI_ENV=$ENVIRONMENT umi build
