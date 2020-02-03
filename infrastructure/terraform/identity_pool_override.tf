module "identity_pool_tenant1" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}tenant1"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}tenant1"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}tenant1"
  cognito__user_pool_id              = "${module.cognito_tenant1.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_tenant1.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__tenant1_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "672FB50-BE2B-405D-9526-CB81427B7B7E"
}

module "identity_pool_tenant2" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}tenant2"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}tenant2"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}tenant2"
  cognito__user_pool_id              = "${module.cognito_tenant2.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_tenant2.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__tenant2_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "BA7E007F-761B-4A0F-AFAF-45B032AC19A2"
}

module "identity_pool_tenant3" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}tenant3"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}tenant3"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}tenant3"
  cognito__user_pool_id              = "${module.cognito_tenant3.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_tenant3.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__tenant3_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "8720A63-FCE4-328E-3321-AD3F58797C7F"
}

module "identity_pool_test_tenant" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}test_tenant"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}test_tenant"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}test_tenant"
  cognito__user_pool_id              = "${module.cognito_test_tenant.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_test_tenant.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__test_tenant_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "3333333-3333-3333-3333-333333333333"
}

module "identity_pool_admin" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}admin"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}admin"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}admin"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments     = "${var.environments}"
  openid__arn      = "${var.iam__open_id_connect_provider}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  is_admin      = true
}

module "identity_pool_global_user" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}globaluser"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}globaluser"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}globaluser"
  cognito__user_pool_id              = "${module.cognito_global_user.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_global_user.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments     = "${var.environments}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  is_global_user     = true
}

module "identity_pool_reams_user" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}reams_tenant"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}reams_tenant"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}reams_tenant"
  cognito__user_pool_id              = "${module.cognito_reams_user.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_reams_user.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__reams_tenant_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "1111111-1111-1111-1111-111111111111"
}

#TODO - we really need to figure out how to optimise this to use the tenant array from config
# These are the test tenants for initial launch
# * atkins
# * 20fcst
# * allianz
# * rhc

module "identity_pool_atkins" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}atkins"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}-atkins"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}-atkins"
  cognito__user_pool_id              = "${module.cognito_atkins.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_atkins.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__atkins_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "90C8BE2E-AB81-45B5-A9DB-A6F967471C1D"
}

module "identity_pool_20fcst" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}20fcst"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}-20fcst"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}-20fcst"
  cognito__user_pool_id              = "${module.cognito_20fcst.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_20fcst.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__20fcst_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "91139949-B379-4EC7-AD72-45BEB7DBB9B8"
}

module "identity_pool_allianz" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}allianz"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}-allianz"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}-allianz"
  cognito__user_pool_id              = "${module.cognito_allianz.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_allianz.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__allianz_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "9692179F-A1B5-4045-AA6C-0A3FD1D49DE8"
}

module "identity_pool_rhc" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}rhc"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}-rhc"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}-rhc"
  cognito__user_pool_id              = "${module.cognito_rhc.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_rhc.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__rhc_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "93FC987A-9705-495A-BA65-37654374EB4C"
}

module "identity_pool_ba" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}ba"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}-ba"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}-ba"
  cognito__user_pool_id              = "${module.cognito_ba.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_ba.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${var.s3__rhc_images}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "97000000-0000-0000-0000-00000000000"
}

module "identity_pool_airbus" {
  source = "./modules/identity_pool"

  cognito__identity_pool_name        = "${var.cognito__identity_pool_name}airbus"
  cognito__authenticated_role_name   = "${var.cognito__authenticated_role_name}-airbus"
  cognito__authenticated_policy_name = "${var.cognito__authenticated_policy_name}-airbus"
  cognito__user_pool_id              = "${module.cognito_airbus.pool_id}"
  cognito__user_pool_client_id       = "${module.cognito_airbus.web_client_id}"

  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"

  # pinpoint__id                        = "${aws_pinpoint_app.pinpoint.application_id}"
  environments    = "${var.environments}"
  s3__bucket_name = "${module.airbus_tenant_s3.bucket_id}"

  # openid__arn      = "${module.azure_ad_open_id_connect.arn}"
  resource__prefix = "${var.resource__prefix}"

  standard_tags     = "${local.standard_tags}"
  elasticsearch_arn = "${aws_elasticsearch_domain.es.arn}"
  tenant_id         = "97000000-0000-0000-0000-00000000001"
}

output "identity_pool_id_tenant1" {
  value = "${module.identity_pool_tenant1.main_id}"
}

output "identity_pool_id_tenant2" {
  value = "${module.identity_pool_tenant2.main_id}"
}

output "identity_pool_id_tenant3" {
  value = "${module.identity_pool_tenant3.main_id}"
}

output "identity_pool_id_admin" {
  value = "${module.identity_pool_admin.admin_id}"
}

output "identity_pool_id_test_tenant" {
  value = "${module.identity_pool_test_tenant.main_id}"
}

output "identity_pool_id_global_user" {
  value = "${module.identity_pool_global_user.global_user_id}"
}

output "identity_pool_id_reams_user" {
  value = "${module.identity_pool_reams_user.main_id}"
}

output "identity_pool_id_atkins" {
  value = "${module.identity_pool_atkins.main_id}"
}

output "identity_pool_id_20fcst" {
  value = "${module.identity_pool_20fcst.main_id}"
}

output "identity_pool_id_allianz" {
  value = "${module.identity_pool_allianz.main_id}"
}

output "identity_pool_id_rhc" {
  value = "${module.identity_pool_rhc.main_id}"
}

output "identity_pool_id_ba" {
  value = "${module.identity_pool_ba.main_id}"
}

output "identity_pool_id_airbus" {
  value = "${module.identity_pool_airbus.main_id}"
}
