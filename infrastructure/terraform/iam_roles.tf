### Reader Role For Tenant ###
module "iam_appsync_lambda_tenant_reader_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "reader"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_reader_log_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_reader_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_reader_es_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_reader_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_es_tenant_reader_policy.*.arn, count.index)}"
}

### Reader Role For Global User ###
module "iam_appsync_lambda_global_user_reader_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "reader"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_global_user  = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_reader_log_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_reader_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_reader_es_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_reader_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_reader_policy.arn}"
}

### Reader Role For Admin ###
module "iam_appsync_lambda_admin_reader_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "reader"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_admin        = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_reader_log_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_reader_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_reader_es_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_reader_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_reader_policy.arn}"
}

### Reader Role For Lambda ###
module "iam_appsync_lambda_reader_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "reader"
}

### Writer Role For Tenant ###
module "iam_appsync_lambda_tenant_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_writer_log_role_attach" {
  count      = "${length(var.tenants)}"
  
  role       = "${element(module.iam_appsync_lambda_tenant_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_writer_es_role_attach" {
  count      = "${length(var.tenants)}"
  
  role       = "${element(module.iam_appsync_lambda_tenant_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_es_tenant_writer_policy.*.arn, count.index)}"
}

### Writer Role For Global User ###
module "iam_appsync_lambda_global_user_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_global_user  = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_writer_log_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_writer_es_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_writer_policy.arn}"
}

### Writer Role For Admin ###
module "iam_appsync_lambda_admin_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_admin        = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_writer_log_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_writer_es_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_writer_policy.arn}"
}

### Writer Role For Lambda ###
module "iam_appsync_lambda_writer_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "writer"
}

### Asset Writer Role For Tenant ###
module "iam_appsync_lambda_tenant_asset_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "asset-writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_asset_writer_log_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_asset_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_asset_writer_es_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_asset_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_es_tenant_writer_policy.*.arn, count.index)}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_asset_writer_s3_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_asset_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_s3_tenant_writer_policy.*.arn, count.index)}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_asset_writer_es_sharedindex_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_asset_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_sharedindex_reader_policy.arn}"
}

### Asset Writer Role For Global User ###
module "iam_appsync_lambda_global_user_asset_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "asset-writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_global_user  = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_asset_writer_log_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_asset_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_asset_writer_es_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_asset_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_writer_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_asset_writer_s3_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_asset_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_s3_global_user_writer_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_asset_writer_es_sharedindex_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_asset_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_sharedindex_reader_policy.arn}"
}

### Asset Writer Role For Admin ###
module "iam_appsync_lambda_admin_asset_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "asset-writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_admin        = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_asset_writer_log_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_asset_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_asset_writer_es_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_asset_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_writer_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_asset_writer_s3_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_asset_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_s3_global_user_writer_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_asset_writer_es_sharedindex_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_asset_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_sharedindex_reader_policy.arn}"
}

### Asset Write Role For Lambda ###
module "iam_appsync_lambda_asset_writer_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "asset-writer"
}

### Facility Writer Role For Tenant ###
module "iam_appsync_lambda_tenant_facility_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "facility-writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_facility_writer_log_role_attach" {
  count      = "${length(var.tenants)}"
  # role       = "${var.account__name}-lambda-${lookup(var.tenants[count.index], "id")}-appsync-facility-writer"
  role       = "${element(module.iam_appsync_lambda_tenant_facility_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_facility_writer_es_role_attach" {
  count      = "${length(var.tenants)}"
  # role       = "${var.account__name}-lambda-${lookup(var.tenants[count.index], "id")}-appsync-facility-writer"
  role       = "${element(module.iam_appsync_lambda_tenant_facility_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_es_tenant_writer_policy.*.arn, count.index)}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_facility_writer_s3_role_attach" {
  count      = "${length(var.tenants)}"
  # role       = "${var.account__name}-lambda-${lookup(var.tenants[count.index], "id")}-appsync-facility-writer"
  role       = "${element(module.iam_appsync_lambda_tenant_facility_writer_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_s3_tenant_writer_policy.*.arn, count.index)}"
}

### Facility Writer Role For Global User ###
module "iam_appsync_lambda_global_user_facility_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "facility-writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_global_user  = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_facility_writer_log_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_facility_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_facility_writer_es_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_facility_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_writer_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_global_user_facility_writer_s3_role_attach" {
  role       = "${module.iam_appsync_lambda_global_user_facility_writer_role.global_user_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_s3_global_user_writer_policy.arn}"
}

### Facility Writer Role For Admin ###
module "iam_appsync_lambda_admin_facility_writer_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "facility-writer"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  is_admin        = true
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_facility_writer_log_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_facility_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_facility_writer_es_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_facility_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_global_user_writer_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_admin_facility_writer_s3_role_attach" {
  role       = "${module.iam_appsync_lambda_admin_facility_writer_role.admin_role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_s3_global_user_writer_policy.arn}"
}

### Facility Write Role For Lambda ###
module "iam_appsync_lambda_facility_writer_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "facility-writer"
}

### Cleanup Tenants Role ###
resource "aws_iam_role" "iam_appsync_lambda_cleanup_role" {
  count = "${var.cleanup__enabled ? 1 : 0}"
  name  = "${var.account__name}-lambda-appsync-cleanup"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "iam_appsync_lambda_cleanup_policy" {
  count = "${var.cleanup__enabled ? 1 : 0}"
  name  = "${var.account__name}-lambda-appsync-cleanup-policy"
  role  = "${aws_iam_role.iam_appsync_lambda_cleanup_role.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "appsync:GraphQL",
        "appsync:GetGraphqlApi",
        "appsync:ListGraphqlApis",
        "appsync:ListApiKeys"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:appsync:eu-west-2:*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_clean_up_log_role_attach" {
  count      = "${var.cleanup__enabled ? 1 : 0}"
  role       = "${aws_iam_role.iam_appsync_lambda_cleanup_role.name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

### SharedIndex Write Role ###
module "iam_appsync_lambda_es_sharedindex_writer_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "sharedindex-writer"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_es_sharedindex_writer_role_attach" {
  # role       = "${var.account__name}-lambda-appsync-sharedindex-writer"
  role       = "${module.iam_appsync_lambda_es_sharedindex_writer_role.role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_sharedindex_writer_policy.arn}"
}

### Generate Report Role For Lambda ###
module "iam_appsync_lambda_generate_report_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "generate-report"
}

### Generate Report Role ###
module "iam_appsync_lambda_tenant_generate_report_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "generate-report"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_generate_repot_log_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_generate_report_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_generate_repot_es_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_generate_report_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_es_tenant_writer_policy.*.arn, count.index)}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_generate_report_s3_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_generate_report_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_s3_tenant_writer_policy.*.arn, count.index)}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_generate_report_es_sharedindex_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_generate_report_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_sharedindex_reader_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_generate_report_es_scroll_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_generate_report_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_scroll_policy.arn}"
}

#Roles for accessing RDS
module "iam_appsync_lambda_rds_reader_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "rds-reader"
}

module "iam_appsync_lambda_tenant_rds_reader_role" {
  source = "./modules/iam_roles/iam_tenant_role"

  tenants         = "${var.tenants}"
  account__name   = "${var.account__name}"
  type            = "rds-reader"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
}

#This allows the 'global' rds reader role to create connections to VPC resources, so it can connect to STS, to assume the tenant role
resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_rds_reader_role_vpc_attach" {
  count      = "${local.lambda__vpc_available}"
  role       = "${module.iam_appsync_lambda_rds_reader_role.role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_vpc_policy.arn}"
}

#This allows the 'tenant' rds reader role to log
resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_rds_reader_role_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_rds_reader_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_logs_policy.arn}"
}

#This allows the 'tenant' rds reader role to create connections to VPC resources, so it can connect to RDS
resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_rds_reader_role_vpc_attach" {
  count      = "${var.lambda__vpc_available ? length(var.tenants) : 0}"
  role       = "${element(module.iam_appsync_lambda_tenant_rds_reader_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_vpc_policy.arn}"
}

#This allows the 'tenant' rds reader role to query ES
#TODO : As part of EMW-697 the 'caching' may use the shared index, so may not need this
resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_rds_reader_role_es_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_rds_reader_role.tenant_role_names, count.index)}"
  policy_arn = "${element(aws_iam_policy.iam_appsync_lambda_es_tenant_reader_policy.*.arn, count.index)}"
}

#This allows the 'tenant' rds reader role to query the ES shared index
resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_tenant_rds_reader_role_es_sharedindex_attach" {
  count      = "${length(var.tenants)}"
  role       = "${element(module.iam_appsync_lambda_tenant_rds_reader_role.tenant_role_names, count.index)}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_sharedindex_writer_policy.arn}"
}

module "iam_appsync_lambda_hierarchy_role" {
  source = "./modules/iam_roles/iam_lambda_role"

  account__name   = "${var.account__name}"
  aws__account_id = "${var.aws__account_id}"
  aws__region     = "${var.aws__region}"
  type            = "hierarchy"
}

#This allows the hierarchy role to create connections to VPC resources, so it can connect to RDS
resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_hierarchy_role_vpc_attach" {
  count      = "${local.lambda__vpc_available}"
  role       = "${module.iam_appsync_lambda_hierarchy_role.role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_vpc_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "iam_appsync_lambda_hierarchy_sharedindex_writer_role_attach" {
  role       = "${module.iam_appsync_lambda_hierarchy_role.role_name}"
  policy_arn = "${aws_iam_policy.iam_appsync_lambda_es_sharedindex_writer_policy.arn}"
}