resource "aws_iam_role" "iam_appsync_lambda_tenant_role" {
  count = "${signum(var.is_global_user + var.is_admin) == 1  ? 0 : length(var.tenants)}"
  name  = "${var.account__name}-lambda-${lookup(var.tenants[count.index], "id")}-appsync-${var.type}"

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
    },
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "AWS": "arn:aws:iam::${replace(var.aws__account_id, "-", "")}:role/${var.account__name}-lambda-appsync-${var.type}"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "iam_appsync_lambda_global_user_role" {
  count = "${var.is_global_user ? 1 : 0}"
  name  = "${var.account__name}-lambda-global-user-appsync-${var.type}"

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
    },
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "AWS": "arn:aws:iam::${replace(var.aws__account_id, "-", "")}:role/${var.account__name}-lambda-appsync-${var.type}"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "iam_appsync_lambda_admin_role" {
  count = "${var.is_admin ? 1 : 0}"
  name  = "${var.account__name}-lambda-admin-appsync-${var.type}"

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
    },
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "AWS": "arn:aws:iam::${replace(var.aws__account_id, "-", "")}:role/${var.account__name}-lambda-appsync-${var.type}"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

output "tenant_role_ids" {
  value = "${aws_iam_role.iam_appsync_lambda_tenant_role.*.id}"
}

output "tenant_role_names" {
  value = "${aws_iam_role.iam_appsync_lambda_tenant_role.*.name}"
}

output "global_user_role_id" {
  value = "${element(concat(aws_iam_role.iam_appsync_lambda_global_user_role.*.id, list("")), 0)}"
}

output "global_user_role_name" {
  value = "${element(concat(aws_iam_role.iam_appsync_lambda_global_user_role.*.name, list("")), 0)}"
}

output "admin_role_id" {
  value = "${element(concat(aws_iam_role.iam_appsync_lambda_admin_role.*.id, list("")), 0)}"
}

output "admin_role_name" {
  value = "${element(concat(aws_iam_role.iam_appsync_lambda_admin_role.*.name, list("")), 0)}"
}
