resource "aws_cognito_identity_pool" "main" {
  count                            = "${signum(var.is_global_user + var.is_admin) == 1 ? 0 : length(var.environments)}"
  identity_pool_name               = "${var.cognito__identity_pool_name}${replace(lookup(var.environments[count.index], "name"), "-", "")}"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = "${var.cognito__user_pool_client_id}"
    server_side_token_check = false

    provider_name = "cognito-idp.${
        var.aws__region
      }.amazonaws.com/${
        var.cognito__user_pool_id
      }"
  }
}

resource "aws_cognito_identity_pool" "admin" {
  count                            = "${var.is_admin ? length(var.environments) : 0}"
  identity_pool_name               = "${var.cognito__identity_pool_name}${replace(lookup(var.environments[count.index], "name"), "-", "")}"
  allow_unauthenticated_identities = false

  openid_connect_provider_arns = ["${var.openid__arn}"]
}

resource "aws_cognito_identity_pool" "global_user" {
  count                            = "${var.is_global_user ? length(var.environments) : 0}"
  identity_pool_name               = "${var.cognito__identity_pool_name}${replace(lookup(var.environments[count.index], "name"), "-", "")}"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = "${var.cognito__user_pool_client_id}"
    server_side_token_check = false

    provider_name = "cognito-idp.${
        var.aws__region
      }.amazonaws.com/${
        var.cognito__user_pool_id
      }"
  }
}

# resource "aws_cognito_user_pool" "example" {
#   name                     = "example-pool"
#   auto_verified_attributes = ["email"]
# }

resource "aws_iam_role" "authenticated_user" {
  count                 = "${signum(var.is_global_user + var.is_admin) == 1 ? 0 : length(var.environments)}"
  name                  = "${var.cognito__authenticated_role_name}-${lookup(var.environments[count.index], "name")}"
  force_detach_policies = true

  # tags = "${var.standard_tags}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${element(concat(aws_cognito_identity_pool.main.*.id, list("")), count.index)}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "appsync.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role" "authenticated_global_user" {
  count                 = "${signum(var.is_global_user + var.is_admin) == 1 ? length(var.environments): 0}"
  name                  = "${var.cognito__authenticated_role_name}-${lookup(var.environments[count.index], "name")}"
  force_detach_policies = true

  # tags = "${var.standard_tags}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${var.is_global_user ? element(concat(aws_cognito_identity_pool.global_user.*.id, list("")), count.index) : element(concat(aws_cognito_identity_pool.admin.*.id, list("")), count.index)}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "appsync.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "appsync" {
  count = "${length(var.environments)}"
  name  = "${var.resource__prefix}appsync-policy"
  role  = "${signum(var.is_global_user + var.is_admin) == 1 ? element(concat(aws_iam_role.authenticated_global_user.*.name, list("")), count.index) : element(concat(aws_iam_role.authenticated_user.*.name, list("")), count.index)}"

  # tags = "${var.standard_tags}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "appsync:GraphQL"
            ],
            "Resource": [
                "arn:aws:appsync:${var.aws__region}:${local.account_id}:apis/${lookup(var.environments[count.index], "apiId")}/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy" "elasticsearch" {
  count = "${length(var.environments)}"
  name  = "${var.resource__prefix}elasticsearch-policy"
  role  = "${signum(var.is_global_user + var.is_admin) == 1 ? element(concat(aws_iam_role.authenticated_global_user.*.name, list("")), count.index) : element(concat(aws_iam_role.authenticated_user.*.name, list("")), count.index)}"

  # tags = "${var.standard_tags}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "es:${var.is_global_user * (count.index == 0 ? 1 : 0) == 1 ? "*" : "ESHttpPost"}"
        ],
        "Effect": "Allow",
        "Resource": "${var.elasticsearch_arn}/${var.is_global_user * (count.index == 0 ? 1 : 0) == 1 ? "*" : "${lookup(var.environments[count.index], "name")}-${var.is_admin ? "*" : lower(var.tenant_id)}/_search"}"
      }
    ]
}
EOF
}

resource "aws_iam_role_policy" "s3bucket" {
  count = "${length(var.environments)}"
  name  = "${var.resource__prefix}s3bucket"
  role  = "${signum(var.is_global_user + var.is_admin) == 1 ? element(concat(aws_iam_role.authenticated_global_user.*.name, list("")), count.index) : element(concat(aws_iam_role.authenticated_user.*.name, list("")), count.index)}"

  # tags = "${var.standard_tags}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:GetObjectVersion",
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:PutObjectVersionAcl"
            ],
            "Resource": [
                "arn:aws:s3:::${signum(var.is_global_user + var.is_admin) == 1 ? "*" : "${var.s3__bucket_name}/*"}"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy" "es-sharedindex-reader" {
  count = "${length(var.environments)}"
  name  = "${var.resource__prefix}es-sharedindex-reader-policy"
  role  = "${signum(var.is_global_user + var.is_admin) == 1 ? element(concat(aws_iam_role.authenticated_global_user.*.name, list("")), count.index) : element(concat(aws_iam_role.authenticated_user.*.name, list("")), count.index)}"

  # tags = "${var.standard_tags}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "es:ESHttpPost"
        ],
        "Effect": "Allow",
        "Resource": "${var.elasticsearch_arn}/*-shared/_search"
      }
    ]
}
EOF
}

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  count            = "${length(var.environments)}"
  identity_pool_id = "${var.is_global_user ? element(concat(aws_cognito_identity_pool.global_user.*.id, list("")), count.index) : (var.is_admin ? element(concat(aws_cognito_identity_pool.admin.*.id, list("")), count.index) : element(concat(aws_cognito_identity_pool.main.*.id, list("")), count.index))}"

  # tags = "${var.standard_tags}"

  roles {
    "authenticated" = "${signum(var.is_global_user + var.is_admin) == 1 ? element(concat(aws_iam_role.authenticated_global_user.*.arn, list("")), count.index) : element(concat(aws_iam_role.authenticated_user.*.arn, list("")), count.index)}"
  }
}

output "main_id" {
  value = "${aws_cognito_identity_pool.main.*.id}"
}

output "global_user_id" {
  value = "${aws_cognito_identity_pool.global_user.*.id}"
}

output "admin_id" {
  value = "${aws_cognito_identity_pool.admin.*.id}"
}
