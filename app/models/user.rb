class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation, :name
  attr_reader :name

  before_save :ensure_token
  before_save { email.downcase! }

  EMAIL_REGEX = /\A[^\W_]([\w+\-]|(?<!\.)\.)+@[^\W_]([a-z\d\-]|(?<!\.)\.)+(?<!\.)\.[a-z]+\z/i
  validates_presence_of :name,  :email

  validate :no_middle_names
  validates :first_name, :last_name, length: { maximum: 50 }

  validates :email, format: { with: EMAIL_REGEX }, uniqueness: { case_sensitive: false }

  has_secure_password
  validates :password, on: :create, presence: true,
    length: { minimum: 6, allow_nil: true },
    confirmation: true
  validates :password_confirmation, on: :create, presence: true

  validates :password, on: :update, length: { minimum: 6, allow_nil: true }, confirmation: true
  validates :password_confirmation, presence: true, unless: :password_nil?, on: :update

  after_validation { self.errors.messages.delete(:password_digest) }

  def password_nil?
    password.nil?
  end

  def ensure_token
    self.token = SecureRandom.urlsafe_base64(16)
  end

  def name=(name)
    @name = name
    names = self.name.split(" ")
    self.first_name = names.first
    self.last_name = (names.length > 1 ? names.last : "")
    @name
  end

  def no_middle_names
    errors.add(:first_name, "Only first and last names") if self.name.split(" ").length > 2
  end
end