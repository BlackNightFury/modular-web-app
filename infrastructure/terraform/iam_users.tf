module "tenant1_user" {
  source = "./modules/iam_user"

  tenant_id     = "${var.iam__tenant_1_id}"
  table_name    = "${var.resource__prefix}dynamodb"
  iam_user_name = "${var.resource__prefix}tenant1-base-user"
  policy_name   = "${var.resource__prefix}tenant1-iam-policy"

  standard_tags = "${local.standard_tags}"
}
