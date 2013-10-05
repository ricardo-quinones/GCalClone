class User < ActiveRecord::Base
  attr_accessible :email, :password

  before_validation :ensure_token
  before_save { self.email = email.downcase }

  EMAIL_REGEX =
  validates_presence_of :first_name, :last_name, :email, :token
  validates :email, format:
  validates :password, length: { minimum: 6, allow_nil: true }

  has_secure_password

  # def self.find_by_email(email, password)
#     user = User.find_by_email(email)
#     (user.nil? || !user.is_password?(password) ? nil : user)
#   end
#
#   def self.generate_token
#     SecureRandom.urlsafe_base64(16)
#   end


end
