#The idea here is to output the versions of key components to helo us understand any differences between
# local development and code build.
# npm run output-versions
echo "node -v"
node -v
echo "npm -v"
npm -v

cd ./infrastructure/serverless
echo "sls --version"
./node_modules/.bin/sls --version

cd ../..