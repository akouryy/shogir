resource "aws_cognito_user_pool" "shogir_cognito_user_pool" {
  name = "shogir_cognito_user_pool"

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

  username = var.shogir_initial_cognito_user_username
  password = var.shogir_initial_cognito_user_password

  attributes = {
    email          = var.shogir_initial_cognito_user_email
    email_verified = true
  }
}
