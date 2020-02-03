
resource "aws_s3_bucket" "b" {
  bucket = "${var.bucket_name}"
  acl    = "private"

  tags {
    Name        = "${var.bucket_name}"
    Environment = "${var.environment}"
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET", "DELETE", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2", "ETag"]
    max_age_seconds = 3000
  }

  logging {
    target_bucket = "${var.log_bucket}"
    target_prefix = "${var.bucket_name}/"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket = "${aws_s3_bucket.b.id}"

  # Block new public ACLs and uploading public objects
  block_public_acls = true

  # Retroactively remove public access granted through public ACLs
  ignore_public_acls = true

  # Block new public bucket policies
  block_public_policy = true

  # Retroactivley block public and cross-account access if bucket has public policies
  restrict_public_buckets = true
}

output "bucket_id" {
  value = "${aws_s3_bucket.b.id}"
}

output "bucket_arn" {
  value = "${aws_s3_bucket.b.arn}"
}
