variable "cognito_user_pool_name" {}
variable "cognito_user_pool_client_name" {}

variable "standard_tags" {
  type = "map"
}

variable "is_kibana_auth" {
  default = false
}

variable "elasticsearch_domain" {
  default = ""
}
