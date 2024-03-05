data "aws_iam_policy_document" "shogir_front_s3_read_iam_policy_document" {
  statement {
    sid       = "ShogirFrontS3Read"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.shogir_front_s3_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudfront_distribution.shogir_cloudfront_distribution.arn]
    }
  }
}

resource "aws_iam_role" "shogir_user_iam_role" {
  name = "shogir_user_iam_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Federated = "cognito-identity.amazonaws.com" }
        Action    = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals             = { "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.shogir_cognito_identity_pool.id }
          "ForAnyValue:StringLike" = { "cognito-identity.amazonaws.com:amr" = "authenticated" }
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "shogir_user_iam_role_policy" {
  name   = "shogir_user_iam_role_policy"
  role   = aws_iam_role.shogir_user_iam_role.id
  policy = data.aws_iam_policy_document.shogir_workspace_private_access_iam_policy_document.json
}

data "aws_iam_policy_document" "shogir_workspace_private_access_iam_policy_document" {
  statement {
    sid       = "ShogirWorkspacePrivateAccessGetPutObject"
    effect    = "Allow"
    actions   = ["s3:GetObject", "s3:PutObject"]
    resources = ["${aws_s3_bucket.shogir_workspace_s3_bucket.arn}/$${cognito-identity.amazonaws.com:sub}/*"]
  }
  statement {
    sid       = "ShogirWorkspacePrivateAccessListBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.shogir_workspace_s3_bucket.arn]
    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["$${cognito-identity.amazonaws.com:sub}/*"]
    }
  }
}
