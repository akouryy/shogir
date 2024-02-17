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
