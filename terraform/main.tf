terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.37"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "s3_bucket" {
  bucket = "shogir.pyon.app"
}

module "s3_files" {
  source = "hashicorp/dir/template"
  base_dir = "${path.module}/../out"
}

resource "aws_s3_object" "s3_files_upload" {
  for_each = module.s3_files.files
  bucket = aws_s3_bucket.s3_bucket.id
  key = each.key
  content_type = each.value.content_type
  source = each.value.source_path
  content = each.value.content
  source_hash = each.value.digests.md5
}
