resource "aws_s3_bucket" "shogir_front_s3_bucket" {
  bucket = "shogir.pyon.app"
}

resource "aws_s3_bucket_policy" "shogir_front_s3_bucket_policy" {
  bucket = aws_s3_bucket.shogir_front_s3_bucket.id
  policy = data.aws_iam_policy_document.shogir_front_s3_read_iam_policy_document.json
}

resource "aws_s3_object" "shogir_front_s3_files_upload" {
  for_each = module.shogir_front_s3_files.files

  bucket       = aws_s3_bucket.shogir_front_s3_bucket.id
  key          = each.key
  content_type = each.value.content_type
  source       = each.value.source_path
  content      = each.value.content
  source_hash  = each.value.digests.md5
}
module "shogir_front_s3_files" {
  source   = "hashicorp/dir/template"
  base_dir = "${path.module}/../out"
}

resource "aws_s3_bucket" "shogir_workspace_s3_bucket" {
  bucket = "shogir-workspace"
}

resource "aws_s3_bucket_cors_configuration" "shogir_workspace_s3_bucket_cors_configuration" {
  bucket = aws_s3_bucket.shogir_workspace_s3_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET", "PUT", "POST"]
    allowed_origins = [
      "http://localhost:44051",
      "https://shogir.pyon.app",
      "https://${aws_cloudfront_distribution.shogir_cloudfront_distribution.domain_name}",
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
