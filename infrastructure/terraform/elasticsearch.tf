resource "aws_iam_role" "kibana_auth_role" {
  name = "${var.account__name}-kibana_auth_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_cloudwatch_log_group" "elasticsearch" {
  name = "/aws/elasticsearch/${var.elasticsearch__domain}"
}

resource "aws_cloudwatch_log_resource_policy" "example" {
  policy_name = "${var.elasticsearch__domain}-cloudwatch"

  policy_document = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": [
        "logs:PutLogEvents",
        "logs:PutLogEventsBatch",
        "logs:CreateLogStream"
      ],
      "Resource": "arn:aws:logs:*"
    }
  ]
}
CONFIG
}


resource "aws_iam_role_policy_attachment" "cognito_auth_policy" {
  role       = "${aws_iam_role.kibana_auth_role.id}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonESCognitoAccess"
}

resource "aws_elasticsearch_domain" "es" {
  domain_name           = "${var.elasticsearch__domain}"
  elasticsearch_version = "6.7"

  cluster_config {
    instance_type  = "${var.elasticsearch__instance_type}"
    instance_count = 3
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }

  log_publishing_options {
    cloudwatch_log_group_arn = "${aws_cloudwatch_log_group.elasticsearch.arn}"
    log_type                 = "INDEX_SLOW_LOGS"
  }

  # vpc_options {
  #   subnet_ids = [
  #     "${data.aws_subnet.default_2a.id}",
  #     "${data.aws_subnet.default_2b.id}",
  #   ]

  #   security_group_ids = ["${data.aws_security_group.default.id}"]
  # }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  tags = {
    Domain = "${var.elasticsearch__domain}"
  }

  access_policies = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "es:*",
      "Principal": "*",
      "Effect": "Allow",
      "Resource": "arn:aws:es:${var.aws__region}:${replace(var.aws__account_id, "-", "")}:domain/${var.elasticsearch__domain}/*",
      "Condition": {
        "IpAddress": {"aws:SourceIp": []}
      }
    }
  ]
}
POLICY

  cognito_options = {
    enabled          = true
    user_pool_id     = "${module.cognito_global_user.pool_id}"
    identity_pool_id = "${element(concat(module.identity_pool_global_user.global_user_id, list("")), count.index)}"
    role_arn         = "${aws_iam_role.kibana_auth_role.arn}"
  }
}

output "elasticsearch_arn" {
  value = "${aws_elasticsearch_domain.es.arn}"
}

output "elasticsearch_domain_name" {
  value = "${aws_elasticsearch_domain.es.domain_name}"
}

output "elasticsearch_endpoint" {
  value = "${aws_elasticsearch_domain.es.endpoint}"
}
