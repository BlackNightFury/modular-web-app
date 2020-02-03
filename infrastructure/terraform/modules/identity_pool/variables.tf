variable "aws__region" {}
variable "aws__account_id" {}

locals {
  account_id = "${replace(var.aws__account_id, "-", "")}"
}

variable "cognito__identity_pool_name" {}
variable "cognito__authenticated_role_name" {}

variable "cognito__authenticated_policy_name" {}

variable "cognito__user_pool_id" {
  default = ""
}

variable "cognito__user_pool_client_id" {
  default = ""
}

# variable "pinpoint__id" {}

variable "environments" {
  type = "list"
}

variable "s3__bucket_name" {
  default = ""
}

variable "openid__arn" {
  default = ""
}

variable "resource__prefix" {}

variable "standard_tags" {
  type = "map"
}

variable "is_global_user" {
  default = false
}

variable "is_admin" {
  default = false
}

variable "elasticsearch_arn" {
  default = ""
}

variable "tenant_id" {
  default = ""
}
