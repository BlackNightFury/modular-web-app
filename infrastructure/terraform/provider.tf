provider "aws" {
  region = "${var.aws__region}"
  assume_role {
    role_arn = "${var.terraform__iam_role_arn}"
  }
}
