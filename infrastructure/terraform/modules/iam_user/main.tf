# TODO : review this implementation

# I think this this tenant_user_role policy should be attached to the cognito user, rather than
# to a set of credentials that (I assume) will be coded into the web UI.

# The "base IAM" user should have a policy that only allows us to authenticate a provided
# username & password with cognito, and to use the identity pool to then get IAM
# credentials for the logged in user

resource "aws_iam_user" "tenant_user" {
  name = "${var.iam_user_name}"
  path = "/system/"

  tags = "${var.standard_tags}"
}

resource "aws_iam_access_key" "tenant_user" {
  user = "${aws_iam_user.tenant_user.name}"

  # tags = "${var.standard_tags}"
}

resource "aws_iam_user_policy" "tenant_user_role" {
  name = "${var.policy_name}"
  user = "${aws_iam_user.tenant_user.name}"

  # tags = "${var.standard_tags}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowAccessToOnlyItemsMatchingTenant1",
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:BatchGetItem",
                "dynamodb:Query",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:eu-west-1:725203252708:table/${var.table_name}"
            ],
            "Condition": {
                "ForAllValues:StringLike": {
                    "dynamodb:LeadingKeys": [
                        "${var.tenant_id}_*"
                    ]
                }
            }
        }
    ]
}
EOF
}
