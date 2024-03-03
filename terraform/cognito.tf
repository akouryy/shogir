resource "aws_cognito_user_pool" "shogir_cognito_user_pool" {
  name = "shogir_cognito_user_pool"

  username_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "admin_only"
      priority = 1
    }
  }
  admin_create_user_config {
    allow_admin_create_user_only = true
  }
  password_policy {
    minimum_length = 16
  }
}

resource "aws_cognito_user" "shogir_initial_cognito_user" {
  user_pool_id = aws_cognito_user_pool.shogir_cognito_user_pool.id

  username = var.shogir_initial_cognito_user_email
  password = var.shogir_initial_cognito_user_password

  attributes = {
    email          = var.shogir_initial_cognito_user_email
    email_verified = true
  }
}

resource "aws_cognito_user_pool_client" "shogir_cognito_user_pool_client" {
  name         = "shogir_cognito_user_pool_client"
  user_pool_id = aws_cognito_user_pool.shogir_cognito_user_pool.id

  explicit_auth_flows = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
}
