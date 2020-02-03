variable "aws__region" {
  default = "eu-west-2"
}

variable "aws__account_id" {}

variable "account__name" {}

variable "resource__prefix" {
  default = "elias-mwa-"
}

variable "deployment__key_name" {
  default = "elias-deployment-key"
}

# variable "instanta__agent_instance_name" {
#   default = "elias-mvp-instanta-agent"
# }

variable "instanta__agent_instance_port" {
  default = "443"
}

variable "cognito__identity_pool_name" {
  default = "eliasmwaidentitypool"
}

variable "cognito__authenticated_role_name" {
  default = "elias-mwa-authenticated-role"
}

variable "cognito__authenticated_policy_name" {
  default = "elias-mwa-authenticated-policy"
}

variable "cleanup__enabled" {
  default = false
}
# data "local_file" "foo" {
#     filename = "${path.module}/foo.bar"
# }

# variable "dynamodb__table_name" {
#   default = "elias-mwa-dynamodb"
# }

# variable "s3_tenant_1" {
#   default = "s3-example-tenant-1"
# }

variable "s3__image_logs" {}

variable "iam__tenant_1_id" {
  default = "672FB50-BE2B-405D-9526-CB81427B7B7E"
}

variable "s3__tenant1_images" {}

variable "iam__tenant_2_id" {
  default = "ba7e007f-761b-4a0f-afaf-45b032ac19a2"
}

variable "s3__tenant2_images" {}

variable "iam__tenant_3_id" {
  default = "8720A63-FCE4-328E-3321-AD3F58797C7F"
}

variable "s3__tenant3_images" {}

variable "iam__test_tenant_id" {
  default = "3333333-3333-3333-3333-333333333333"
}

variable "s3__test_tenant_images" {}

variable "iam__reams_tenant_id" {
  default = "1111111-1111-1111-1111-111111111111"
}

variable "s3__reams_tenant_images" {}

# * atkins
# * 20fcst
# * allianz
# * rhc
variable "s3__atkins_images" {}
variable "s3__20fcst_images" {}
variable "s3__allianz_images" {}
variable "s3__rhc_images" {}
variable "s3__ba_images" {}
variable "s3__airbus_images" {}

variable "environments" {
  type = "list"
}

variable "tenants" {
  type = "list"
}

variable "lambda__vpc_available" {
  default = false
}

variable "terraform__applied_by" {
  # default = ""
}

variable "terraform__applied_at" {
  # default = ""
}

variable "terraform__repo" {
  # default = ""
}

variable "terraform__branch" {
  # default = ""
}

variable "terraform__iam_role_arn" {
  default = "arn:aws:iam::136165052809:role/REAMSDeveloperUserRole"
}

variable "iam__open_id_connect_provider" {}

variable "elasticsearch__domain" {}
variable "elasticsearch__instance_type" { default = "t2.small.elasticsearch" }

locals {
  lambda__vpc_available = "${var.lambda__vpc_available ? 1 : 0}"
  standard_tags = {
    Applied_By = "${var.terraform__applied_by}"
    Applied_At = "${var.terraform__applied_at}"
    Repository = "${var.terraform__repo}"
    Branch     = "${replace(replace(var.terraform__branch, "(", ""), ")", "")}"
  }
}
