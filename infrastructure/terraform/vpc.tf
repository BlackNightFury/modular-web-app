data "aws_vpc" "vpc" {
  default = true
}

data "aws_security_group" "default" {
  name = "default"
}

data "aws_subnet" "default_2a" {
  default_for_az = "true"
  availability_zone = "eu-west-2a"
}

data "aws_subnet" "default_2b" {
  default_for_az = "true"
  availability_zone = "eu-west-2b"
}

# data "aws_subnet" "lambda_2a" {
#   name = "ai-eu2a-lambda"
#   availability_zone = "eu-west-2a"
# }

# data "aws_subnet" "lambda_2b" {
#   name = "ai-eu2b-lambda"
#   availability_zone = "eu-west-2b"
# }

resource "aws_vpc_endpoint" "sts" {
  count        = "${local.lambda__vpc_available}"
  vpc_id       = "${data.aws_vpc.vpc.id}"
  service_name = "com.amazonaws.eu-west-2.sts"
  vpc_endpoint_type = "Interface"

  security_group_ids = [
    "${data.aws_security_group.default.id}",
  ]

  private_dns_enabled = true
}
