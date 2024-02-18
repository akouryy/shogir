resource "aws_cloudfront_distribution" "shogir_cloudfront_distribution" {
  enabled = true

  price_class = "PriceClass_200"

  origin {
    domain_name = aws_s3_bucket.shogir_s3_bucket.bucket_regional_domain_name
    origin_id = aws_s3_bucket.shogir_s3_bucket.id
    origin_access_control_id = aws_cloudfront_origin_access_control.shogir_cloudfront_oac.id
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_cache_behavior {
    target_origin_id = aws_s3_bucket.shogir_s3_bucket.id
    viewer_protocol_policy = "https-only" # TODO: redirect-to-https も検討する
    cached_methods = ["GET", "HEAD"]
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    function_association {
      event_type = "viewer-request"
      function_arn = aws_cloudfront_function.shogir_cloudfront_spa_function.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_function" "shogir_cloudfront_spa_function" {
  name = "shogir_cloudfront_spa_function"
  runtime = "cloudfront-js-2.0"
  code = <<-JS
    function handler(event) {
      if (event.request.method === 'GET' && event.request.uri.indexOf('.') === -1) {
        event.request.uri = '/index.html'
      }
      return event.request
    }
  JS
}

resource "aws_cloudfront_origin_access_control" "shogir_cloudfront_oac" {
  name = "shogir_cloudfront_oac"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}
