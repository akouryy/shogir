resource "aws_s3_bucket" "shogir_front_s3_bucket" {
  bucket = "shogir.pyon.app"
}

resource "aws_s3_bucket_policy" "shogir_front_s3_bucket_policy" {
  bucket = aws_s3_bucket.shogir_front_s3_bucket.id
  policy = data.aws_iam_policy_document.shogir_front_s3_read_policy.json
}
data "aws_iam_policy_document" "shogir_front_s3_read_policy" {
  statement {
    sid    = "ShogirAllowCloudFrontRead"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.shogir_front_s3_bucket.arn}/*"]
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudfront_distribution.shogir_cloudfront_distribution.arn]
    }
  }
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
