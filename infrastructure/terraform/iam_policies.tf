resource "aws_iam_policy" "iam_appsync_lambda_logs_policy" {
  name        = "${var.account__name}-lambda-logs_policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:logs:${var.aws__region}:${replace(var.aws__account_id, "-", "")}:log-group:/aws/lambda/sls-appsync-backend-v1-*",
        "arn:aws:logs:${var.aws__region}:${replace(var.aws__account_id, "-", "")}:log-group:/aws/appsync/apis/*"
      ]
    }
  ]
}
EOF
}

# Tenant based reader and writer policies for s3 and es
resource "aws_iam_policy" "iam_appsync_lambda_s3_tenant_writer_policy" {
  count       = "${length(var.tenants)}"
  name        = "${var.account__name}-lambda-${lookup(var.tenants[count.index], "id")}-s3-tenant-writer-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "s3:PutObject*"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${lookup(var.tenants[count.index], "imgBucket")}/*"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_appsync_lambda_es_tenant_reader_policy" {
  count       = "${length(var.tenants)}"
  name        = "${var.account__name}-lambda-${lookup(var.tenants[count.index], "id")}-es-tenant-reader-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "es:ESHttpPost"
      ],
      "Effect": "Allow",
      "Resource": "${aws_elasticsearch_domain.es.arn}/*-${lower(lookup(var.tenants[count.index], "tenantId"))}/_search"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_appsync_lambda_es_tenant_writer_policy" {
  count       = "${length(var.tenants)}"
  name        = "${var.account__name}-lambda-${lookup(var.tenants[count.index], "id")}-es-tenant-writer-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "es:ESHttpPost"
      ],
      "Effect": "Allow",
      "Resource": "${aws_elasticsearch_domain.es.arn}/*-${lower(lookup(var.tenants[count.index], "tenantId"))}/*"
    }
  ]
}
EOF
}

# Reader and writer policies for global users
resource "aws_iam_policy" "iam_appsync_lambda_s3_global_user_writer_policy" {
  name        = "${var.account__name}-lambda-s3-global-user-writer-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "s3:PutObject*"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::reams-${var.account__name}-*"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_appsync_lambda_es_global_user_reader_policy" {
  name        = "${var.account__name}-lambda-es-global-user-reader-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "es:ESHttpPost"
      ],
      "Effect": "Allow",
      "Resource": "${aws_elasticsearch_domain.es.arn}/*/_search"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_appsync_lambda_es_global_user_writer_policy" {
  name        = "${var.account__name}-lambda-es-global-user-writer-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "es:ESHttpPost"
      ],
      "Effect": "Allow",
      "Resource": "${aws_elasticsearch_domain.es.arn}/*"
    }
  ]
}
EOF
}

# Reader and writer policies for sharedindex
resource "aws_iam_policy" "iam_appsync_lambda_es_sharedindex_reader_policy" {
  name        = "${var.account__name}-lambda-es-sharedindex-reader-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "es:ESHttpPost"
      ],
      "Effect": "Allow",
      "Resource": "${aws_elasticsearch_domain.es.arn}/*-shared/_search"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_appsync_lambda_es_sharedindex_writer_policy" {
  name        = "${var.account__name}-lambda-es-sharedindex-writer-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "es:ESHttpPost"
      ],
      "Effect": "Allow",
      "Resource": "${aws_elasticsearch_domain.es.arn}/*-shared/*"
    }
  ]
}
EOF
}

# ES scroll permission
resource "aws_iam_policy" "iam_appsync_lambda_es_scroll_policy" {
  name        = "${var.account__name}-lambda-es-scroll-policy"
  description = ""

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
      "Action": [
        "es:ESHttpPost"
      ],
      "Effect": "Allow",
      "Resource": "${aws_elasticsearch_domain.es.arn}/_search/scroll"
    }
  ]
}
EOF
}


# VPC Permissions (for RDS)
# https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html
resource "aws_iam_policy" "iam_appsync_lambda_vpc_policy" {
  name        = "${var.account__name}-lambda-vpc-policy"
  description = ""

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateNetworkInterface",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DeleteNetworkInterface"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}
