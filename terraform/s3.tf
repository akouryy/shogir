resource "aws_s3_bucket" "shogir_s3_bucket" {
  bucket = "shogir.pyon.app"
}

resource "aws_s3_bucket_policy" "shogir_s3_bucket_policy" {
  bucket = aws_s3_bucket.shogir_s3_bucket.id
  policy = data.aws_iam_policy_document.shogir_s3_read_policy.json
}
data "aws_iam_policy_document" "shogir_s3_read_policy" {
  statement {
    sid = "AllowCloudFrontRead"
    effect = "Allow"
    principals {
      # type = "AWS"
      # identifiers = [aws_cloudfront_origin_access_identity.cloudfront_oai.iam_arn]
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.shogir_s3_bucket.arn}/*"]
    condition {
      test = "StringEquals"
      variable = "aws:SourceArn"
      values = [aws_cloudfront_distribution.shogir_cloudfront_distribution.arn]
    }
  }
}

resource "aws_s3_object" "shogir_s3_files_upload" {
  for_each = module.shogir_s3_files.files
  bucket = aws_s3_bucket.shogir_s3_bucket.id
  key = each.key
  content_type = each.value.content_type
  source = each.value.source_path
  content = each.value.content
  source_hash = each.value.digests.md5
}
module "shogir_s3_files" {
  source = "hashicorp/dir/template"
  base_dir = "${path.module}/../out"
}
