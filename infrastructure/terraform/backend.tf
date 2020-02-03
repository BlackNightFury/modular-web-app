# Configure Terraform to store this in S3
terraform {
  required_version = "0.11.11"

  backend "s3" {
    key                    = "elias-modular-web-app.tfstate"
    region                 = "eu-west-2"
  }
}
