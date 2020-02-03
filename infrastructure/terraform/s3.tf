resource "aws_s3_bucket" "log_bucket" {
  bucket = "${var.s3__image_logs}"
  acl    = "log-delivery-write"

  tags = "${local.standard_tags}"
}

module "tenant1_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__tenant1_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "tenant2_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__tenant2_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "tenant3_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__tenant3_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "test_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__test_tenant_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "reams_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__reams_tenant_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

#TODO - we really need to figure out how to optimise this to use the tenant array from config
# These are the test tenants for initial launch
# * atkins
# * 20fcst
# * allianz
# * rhc

module "atkins_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__atkins_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "20fcst_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__20fcst_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "allianz_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__allianz_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "rhc_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__rhc_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "ba_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__ba_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}

module "airbus_tenant_s3" {
  source = "./modules/s3"

  bucket_name = "${var.s3__airbus_images}"
  log_bucket  = "${aws_s3_bucket.log_bucket.id}"
  environment = "${var.account__name}"

  standard_tags = "${local.standard_tags}"
}