module "cognito_tenant1" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}tenant1"
  cognito_user_pool_client_name = "${var.resource__prefix}tenant1-client"

  standard_tags = "${local.standard_tags}"
}

module "cognito_tenant2" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}tenant2"
  cognito_user_pool_client_name = "${var.resource__prefix}tenant2-client"

  standard_tags = "${local.standard_tags}"
}

module "cognito_tenant3" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}tenant3"
  cognito_user_pool_client_name = "${var.resource__prefix}tenant3-client"

  standard_tags = "${local.standard_tags}"
}

module "cognito_test_tenant" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}test-tenant"
  cognito_user_pool_client_name = "${var.resource__prefix}test-tenant"

  standard_tags = "${local.standard_tags}"
}

#TODO - we really need to figure out how to optimise this to use the tenant array from config
# These are the test tenants for initial launch
# * atkins
# * 20fcst
# * allianz
# * rhc

module "cognito_atkins" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}atkins"
  cognito_user_pool_client_name = "${var.resource__prefix}atkins"

  standard_tags = "${local.standard_tags}"
}

module "cognito_20fcst" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}20fcst"
  cognito_user_pool_client_name = "${var.resource__prefix}20fcst"

  standard_tags = "${local.standard_tags}"
}

module "cognito_allianz" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}allianz"
  cognito_user_pool_client_name = "${var.resource__prefix}allianz"

  standard_tags = "${local.standard_tags}"
}

module "cognito_rhc" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}rhc"
  cognito_user_pool_client_name = "${var.resource__prefix}rhc"

  standard_tags = "${local.standard_tags}"
}

module "cognito_ba" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}ba"
  cognito_user_pool_client_name = "${var.resource__prefix}ba"

  standard_tags = "${local.standard_tags}"
}

module "cognito_airbus" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}airbus"
  cognito_user_pool_client_name = "${var.resource__prefix}airbus"

  standard_tags = "${local.standard_tags}"
}

module "cognito_global_user" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}global-user"
  cognito_user_pool_client_name = "${var.resource__prefix}global-user"

  standard_tags = "${local.standard_tags}"
  is_kibana_auth = true
  elasticsearch_domain = "${var.elasticsearch__domain}"
}

module "cognito_reams_user" {
  source = "./modules/cognito"

  cognito_user_pool_name        = "${var.resource__prefix}reams-user"
  cognito_user_pool_client_name = "${var.resource__prefix}reams-user"

  standard_tags = "${local.standard_tags}"
}

output "cognito_tenant1__pool_id" {
  value = "${module.cognito_tenant1.pool_id}"
}

output "cognito_tenant1__web_client_id" {
  value = "${module.cognito_tenant1.web_client_id}"
}

output "cognito_tenant1__web_client_secret" {
  value = "${module.cognito_tenant1.web_client_secret}"
}

output "cognito_tenant2__pool_id" {
  value = "${module.cognito_tenant2.pool_id}"
}

output "cognito_tenant2__web_client_id" {
  value = "${module.cognito_tenant2.web_client_id}"
}

output "cognito_tenant2__web_client_secret" {
  value = "${module.cognito_tenant2.web_client_secret}"
}

output "cognito_tenant3__pool_id" {
  value = "${module.cognito_tenant3.pool_id}"
}

output "cognito_tenant3__web_client_id" {
  value = "${module.cognito_tenant3.web_client_id}"
}

output "cognito_tenant3__web_client_secret" {
  value = "${module.cognito_tenant3.web_client_secret}"
}

output "cognito_test_tenant__pool_id" {
  value = "${module.cognito_test_tenant.pool_id}"
}

output "cognito_test_tenant__web_client_id" {
  value = "${module.cognito_test_tenant.web_client_id}"
}

output "cognito_test_tenant__web_client_secret" {
  value = "${module.cognito_test_tenant.web_client_secret}"
}

output "cognito_global_user__web_client_id" {
  value = "${module.cognito_global_user.web_client_id}"
}

output "cognito_global_user__web_client_secret" {
  value = "${module.cognito_global_user.web_client_secret}"
}

output "cognito_reams_user__web_client_id" {
  value = "${module.cognito_reams_user.web_client_id}"
}

output "cognito_reams_user__web_client_secret" {
  value = "${module.cognito_reams_user.web_client_secret}"
}

# * atkins
# * 20fcst
# * allianz
# * rhc

output "cognito_atkins__web_client_id" {
  value = "${module.cognito_atkins.web_client_id}"
}

output "cognito_atkins__web_client_secret" {
  value = "${module.cognito_atkins.web_client_secret}"
}

output "cognito_20fcst__web_client_id" {
  value = "${module.cognito_20fcst.web_client_id}"
}

output "cognito_20fcst__web_client_secret" {
  value = "${module.cognito_20fcst.web_client_secret}"
}

output "cognito_allianz__web_client_id" {
  value = "${module.cognito_allianz.web_client_id}"
}

output "cognito_allianz__web_client_secret" {
  value = "${module.cognito_allianz.web_client_secret}"
}

output "cognito_rhc__web_client_id" {
  value = "${module.cognito_rhc.web_client_id}"
}

output "cognito_rhc__web_client_secret" {
  value = "${module.cognito_rhc.web_client_secret}"
}

output "cognito_ba__web_client_id" {
  value = "${module.cognito_ba.web_client_id}"
}

output "cognito_ba__web_client_secret" {
  value = "${module.cognito_ba.web_client_secret}"
}

output "cognito_airbus__web_client_id" {
  value = "${module.cognito_airbus.web_client_id}"
}

output "cognito_airbus__web_client_secret" {
  value = "${module.cognito_airbus.web_client_secret}"
}
