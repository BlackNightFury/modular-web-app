# Running locally

After cloning, in order to run the application:

  * npm run install-all
  * npm run start

If you want to run it in your environment, then set up your environment and run belows:

  * npm start -- --stage $ENVIRONMENT --account $ACCOUNT
  * i.e npm start -- --stage victor --account dev

## Unit testing

	* Run the test suite: `npm run test -- --stage $ENVIRONMENT --account $ACCOUNT`

## Infrastructure Acceptance Testing
 
	* export AWS_SDK_LOAD_CONFIG=1
	* export AWS_PROFILE=reams-dev
	* Run the test suite: `npm run test:infrastructure-acceptance -- --stage $ENVIRONMENT --account $ACCOUNT`
	* i.e npm run test:infrastructure-acceptance -- --stage victor --account dev

## Cypress testing

	* Run the project: `npm start`
	* After your application started, run the cypress UI: `npm run cypress:open`
	* Alternatively to run from the CLI, run the cypress command: `npm run cypress:run`
	* There is `sample_spec.js` file on the Cypress App
	* Click `sample_spec.js` file to run cypress testing.
	* Open the remote test: `npm run cypress:open-remote -- --stage $ENVIRONMENT --account $ACCOUNT`
	* Run the remote test suite: `npm run cypress:run-remote -- --stage $ENVIRONMENT --account $ACCOUNT`

## Integration testing with enzyme

	* Run the test suite: `npm run test:integration`

# Infrastructure / configuration

The account arrangement is described in the "Multi environment" section of the [Product & dev process document](https://docs.google.com/document/d/12oE-9BUrhLl9UJhmKUvQCwVQUKRmFB0EnWUEDM1EJ9s/edit).

The application is deployed into prod 3051-5626-1037, test 5755-3685-3050 & dev 1361-6505-2809 accounts, along with a temporary sandpit 7252-0325-2708 account.

We have folders for each of these accounts, containing account specific configuration.

The dev & sandpit accounts have multiple environments within them (for each developer/feature etc) so we have a folder for each environment within the relevent account folder.

## Signing into our AWS infrastructure

This is described more fully in the [Product & dev process document](https://docs.google.com/document/d/12oE-9BUrhLl9UJhmKUvQCwVQUKRmFB0EnWUEDM1EJ9s/edit).

In order to login to an account to execute the terraform or serverless code, it is assumed you have a AWS config file (~/.aws/config) setup as per the example in the doc and we can then use aws-azure-login to login to the "shared / iam" account :

	export AWS_SDK_LOAD_CONFIG=1
	export AWS_PROFILE=reams
	aws-azure-login

It is then necessary to use assume role across from the shared account, to the dev/test account as necessary (NB - only the build server and administrators have write access to non-dev accounts).

## Setting up static resources which will be used for all features and developers

We have one set of terraform code that's used to deploy "common" elements into each account which is then shared by each environment.

To apply the terraform infrastructure to an application account, you need to first install terraform(v 0.11.11 from [here](https://www.terraform.io/downloads.html) or by using tfenv or a package manager such as homebrew. The following assumes it is installed and available for use on your PATH.

We can then deploy to one of the application accounts, such as dev, using the npm wrapper, which under the hood uses the AWS profile as described in the above doc:

	npm run terraform init dev
	npm run terraform apply dev

Or:

	npm run terraform plan dev

## Running terraform plan in non-dev environments

Developers are restricted in their access to test & production environments, to minimise the chances of accidents, and generally reduce the number of people responsible for these environments.

In order to ensure code runs in these environments prior to review/merge it makes to execute a plan, against that environment. This can be done with the developers read only permissions (NB, may need to delete the local TF_STATE dir if it doesn't have the correct credentials).

npm run terraform init test -- -- --backend-config="role_arn=arn:aws:iam::575536853050:role/REAMSDeveloperUserRole"
npm run terraform plan test  -- -- -var "terraform__iam_role_arn=arn:aws:iam::575536853050:role/REAMSDeveloperUserRole"

### Setting Up dynamic resources which will be used for each environment/feature separately

The serverless project in infrastructure/serverless creates an appsync instance and web hosting s3 bucket for each environment within the account.

## How to deploy

  * Run `npm run serverless-deploy -- --stage victor --account dev` where victor is the environment name and dev is the account
  If stage is not provided, then `int` will be default.
  * After your PR is merged, you can use `npm run serverless-remove -- --stage your-env-name` to remove all resources created by serverless before.
  * A --version argument can be passed with the version number, which passes it out into the JS console ( --version v02.00.0038.0001)

To deploy your current version of the application, but point to a different backend (for example, using the es-prototype appsymnc & elastic search, as it has more stable data), use:

SKIP_ACCEPTANCE_TESTS=true BUILD_OVERRIDE_STAGE=es-prototype  npm run serverless-deploy -- --stage craig --account dev
SKIP_ACCEPTANCE_TESTS=true BUILD_OVERRIDE_STAGE=prod BUILD_OVERRIDE_ACCOUNT=prod  npm run serverless-deploy -- --stage craig --account dev

To deploy the int environment in test (admin users only):

export AWS_PROFILE=reams-test-admin
npm run serverless-deploy -- --stage int --account test

## Deploying just the react app

The react app can be deployed individually, without also deploying the appsync/lambda stack, by using the following command:

npm run serverless-s3sync -- --stage $ENVIRONMENT --account $ACCOUNT
npm run serverless-s3sync -- --stage craig --account dev

### Adding a new environment
As described in  the [Product & dev process document](https://docs.google.com/document/d/12oE-9BUrhLl9UJhmKUvQCwVQUKRmFB0EnWUEDM1EJ9s/edit) we have multiple
environments in each AWS account. This allows each developer to have their a sandboxed dev environment and also when needed, an environment a specific task
that's taking an extended period of time, or other purpose.

We have a number of dev environments, in the AWS dev account, and then an `int` environment, based on the master branch, in the AWS test account.

Each environment has appsync, cloudfront and an s3 website, deployed with serverless.

Due to an oddity in the relationship between some AWS resources being created by serverless and others by terraform, the mechanism to create a new environment
is a little more involved than it should be; we run serverless to create the appsync instance, followed by terraform to create the correct policies, identity pools, etc
followed by serverless again to fix everything up! We intend to resolve this in future by creating the identity pools with serverless rather than terraform.

To create a new environment, you should follow these steps below:

* npm run serverless-deploy -- --stage ${environment_name} --account ${account_name}

For developers, we generally use the `dev` account, so

* npm run serverless-deploy -- --stage craig --account dev

After serverless-deploy success, a folder named `environment_name` should be created inside `etc/${account_name}`

Inside that folder, add `application.yml` file with the content like this:

```
aws:
  appsync:
    graphqlEndpoint: 'https://lqfumsl7kzccnm5laofuryj4lq.appsync-api.eu-west-2.amazonaws.com/graphql'

tenants:
  672FB50-BE2B-405D-9526-CB81427B7B7E:
    identityPoolId: eu-west-2:4438433d-3282-453e-b6de-8b075649255e
  BA7E007F-761B-4A0F-AFAF-45B032AC19A2:
    identityPoolId: eu-west-2:ed76afc7-3495-4c5f-a0bd-4aefdec2b62f
  8720A63-FCE4-328E-3321-AD3F58797C7F:
    identityPoolId: eu-west-2:e68499e6-fa2b-4437-add0-0524f63ac758
```

Change graphqlEndpoint with the newly created one in aws console

Find `api_id` variable inside `etc/${account_name}/account.tfvars`. And the new api_id with the following format

{
  name = "${account_name}",
  apiId = "${newly created appsync api id in aws console}"
}

* Run `npm run terraform apply ${account_name}`

After terraform apply, if you go to aws console, then you can see that identitypools have been created for the environment.

Each tenant has its own identity pool. So you can see, the same number of identitypools added as tenants.

* Open `etc/${account_name}/${environment_name}/application.yml`
* Change the identityPoolIds with the newly created ones. Make sure that you put the correct identity pool id for each tenant.
* Run `npm run serverless-deploy -- --stage ${environment_name} --account ${account_name}` again
* After that, your environment will live and you are free to use it.

Setup the elastic search indexes for the new environment:

AWS_PROFILE=${profile_name} npm run remapping-es -- --account ${account_name} --stage ${environment_name}

If it's a new account, setup the cognito users, for each tenant:
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} admin
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} global
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 672FB50-BE2B-405D-9526-CB81427B7B7E
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 8720A63-FCE4-328E-3321-AD3F58797C7F
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} BA7E007F-761B-4A0F-AFAF-45B032AC19A2
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 1111111-1111-1111-1111-111111111111
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 3333333-3333-3333-3333-333333333333
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 90C8BE2E-AB81-45B5-A9DB-A6F967471C1D #atkins
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 91139949-B379-4EC7-AD72-45BEB7DBB9B8 #20fcst
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 9692179F-A1B5-4045-AA6C-0A3FD1D49DE8 #allianz
AWS_PROFILE=${profile_name} ./create_cognito_users.js ${account_name} 93FC987A-9705-495A-BA65-37654374EB4C #rhc

Run the cleanup script, to create initial data:

AWS_PROFILE=${profile_name} npm run cleanup:env -- --stage ${environment_name} --account ${account_name}

### Migrations

Migrations

Creating a new migration can be done by runnung npm run migrate:create, e.g.

npm run migrate:create -- EMW-183-complete-floor-delete-all-data

Executing migrations results in the the tool comparing the migrations already executed in a given environment (they're stored in the environmnt), to those in the current source tree, and then applying them. Can be done with:

npm run migrate:up -- --stage ${environment_name} --account ${account_name}

The intention is to execute the migrations as part of the serverless deployment process, after the application is deployed, but before the API tests execute.

## REAMS-AWS-APPSYNC

We have forked our own version of the aws appsync library in order to make some changes to the offline behaviour - the hope is that in time our PR is merged and we can switch back to the standard npm package.

### Why is it needed
When user is offline and mutations are happened, the aws-appsync package stores snapshot to local storage and then does mutations. That snapshot is restored when user becomes online. This makes user confused about they lost their works.

### How to update it
To fix above issue, we forked the repository and add some changes.
aws-appsync is maintained by lerna so we published 'reams-aws-appsync' with lerna.
This repo will be removed when aws-appsync fixed above issue.

### What we have changed
We have disabled the restoring snapshot code [Disable Snapshot Restore](https://github.com/realestateams/aws-mobile-appsync-sdk-js/commit/42e97296802f84c89591c201cf451af7861f75ff)


### Create users in cognito user pool manually

Config your local AWS CLI with proper permissions
Update USERS array in `./scripts/create_cognito_users.js` as you need

In the root of the project, run

`node ./scripts/create_cognito_users.js --account account --tenant tenantId`
#
