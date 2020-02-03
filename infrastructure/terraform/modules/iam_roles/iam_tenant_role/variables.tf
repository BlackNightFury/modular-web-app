variable "tenants" {
  type    = "list"
  default = []
}

variable "account__name" {
  default = ""
}

variable "aws__account_id" {}

variable "aws__region" {}

variable "is_global_user" {
  default = false
}

variable "is_admin" {
  default = false
}

variable "type" {}
