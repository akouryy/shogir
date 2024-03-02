terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.37"
    }
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "shogir"
      Terraform = "true"
    }
  }
}

variable "shogir_initial_cognito_user_username" {}
variable "shogir_initial_cognito_user_email" {}
variable "shogir_initial_cognito_user_password" {}
