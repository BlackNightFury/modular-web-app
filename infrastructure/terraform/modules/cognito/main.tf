resource "aws_cognito_user_pool" "pool" {
  name = "${var.cognito_user_pool_name}"

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  password_policy = {
    minimum_length    = 8
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
    require_lowercase = true
  }

  schema = [
    {
      attribute_data_type = "String"
      name                = "email"
      required            = true

      string_attribute_constraints {
        min_length = 6
        max_length = 64
      }
    },
    {
      # {  #   attribute_data_type = "String"  #   name                = "phone_number"  #   mutable             = true  #   required            = true

      #   string_attribute_constraints {
      #     min_length = 6
      #     max_length = 32
      #   }
      # },
      attribute_data_type = "String"

      name = "tenant_id"

      string_attribute_constraints {
        min_length = 6
        max_length = 32
      }
    },
  ]

  tags = "${var.standard_tags}"
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${var.cognito_user_pool_client_name}"

  user_pool_id = "${aws_cognito_user_pool.pool.id}"
  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH"]

  # tags = "${var.standard_tags}"
}

// TODO: Will be needed for SAML oauth
# resource "aws_cognito_identity_provider" "saml_o356_provider" {
#   count         = "${var.is_kibana_auth ? 1 : 0}"
#   user_pool_id  = "${aws_cognito_user_pool.pool.id}"
#   provider_type = "SAML"
#   provider_name = "REAMS_Office365"

#   provider_details = {
#     MetadataURL = "https://login.microsoftonline.com/reamstest.onmicrosoft.com/FederationMetadata/2007-06/FederationMetadata.xml"
#   }
# }

resource "aws_cognito_user_pool_domain" "kibana_domain" {
  count        = "${var.is_kibana_auth ? 1 : 0}"
  domain       = "${var.elasticsearch_domain}"
  user_pool_id = "${aws_cognito_user_pool.pool.id}"
}

output "pool_id" {
  value = "${aws_cognito_user_pool.pool.id}"
}

output "web_client_id" {
  value = "${aws_cognito_user_pool_client.client.id}"
}

output "web_client_secret" {
  value = "${aws_cognito_user_pool_client.client.client_secret}"
}
