The production environment is more secure than dev & uat environments, due to the fact that real customer data is present. Developers do not have direct access to this account.

The configuration is encrypted and decrypted with AWS KMS, using key e6cd15aa-3398-4dcb-b324-17decda370bb

Configuration files with 'secret' values, for production accounts, accessing 'real' customer data must not be committed to GIT in clear text. Instead they should be encrypted.

To decrypt the file:

AWS_PROFILE=reams-prod-admin aws kms decrypt --ciphertext-blob fileb://etc/prod/secrets.cipher.yml --output text --query Plaintext | base64 --decode > etc/prod/secrets.yml

To encrypt the file:

AWS_PROFILE=reams-prod-admin aws kms encrypt --key-id e6cd15aa-3398-4dcb-b324-17decda370bb --plaintext file://etc/prod/secrets.yml --output text --query CiphertextBlob | base64 --decode > etc/prod/secrets.cipher.yml

