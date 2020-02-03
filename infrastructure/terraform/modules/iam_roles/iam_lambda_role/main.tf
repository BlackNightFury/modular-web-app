resource "aws_iam_role" "iam_appsync_lambda_role" {
  name = "${var.account__name}-lambda-appsync-${var.type}"

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

resource "aws_iam_role_policy" "iam_appsync_lambda_policy" {
  name = "${var.account__name}-lambda-appsync-${var.type}-policy"
  role = "${aws_iam_role.iam_appsync_lambda_role.id}"

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
    },
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Resource": "arn:aws:iam::${replace(var.aws__account_id, "-", "")}:role/${var.account__name}-lambda-*-appsync-${var.type}"
    },
    {
      "Effect" : "Allow",
      "Action" : [
        "kms:Decrypt"
      ],
      "Resource" : [
        "*"
      ]
    }
  ]
}
EOF
}

output "role_name" {
  value = "${aws_iam_role.iam_appsync_lambda_role.name}"
}

output "role_arn" {
  value = "${aws_iam_role.iam_appsync_lambda_role.arn}"
}