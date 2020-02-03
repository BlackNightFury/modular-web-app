
resource "aws_iam_openid_connect_provider" "default" {
  url = "${var.provider_url}"

  client_id_list = [
    "${var.client_id}",
  ]

  thumbprint_list = [
    "${var.thumbprint}",
  ]
}

output "arn" {
  value = "${aws_iam_openid_connect_provider.default.arn}"
}
