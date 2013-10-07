class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation, :name
  attr_reader :name

  before_save :generate_token
  before_save { email.downcase! }

  EMAIL_REGEX = /\A[^\W_]([\w+\-]|(?<!\.)\.)+@[^\W_]([a-z\d\-]|(?<!\.)\.)+(?<!\.)\.[a-z]+\z/i
  validates_presence_of :name,  on: :create

  validate :no_middle_names, on: :create
  validates :first_name, :last_name, length: { maximum: 50 }

  validates :email, presence: true,
                    format: { with: EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }

  has_secure_password
  validates :password, on: :create, presence: true,
    length: { minimum: 6, allow_nil: true },
    confirmation: true
  validates :password_confirmation, on: :create, presence: true

  validates :password, on: :update, length: { minimum: 6, allow_nil: true }, confirmation: true
  validates :password_confirmation, presence: true, unless: :password_nil?, on: :update

  after_validation { self.errors.messages.delete(:password_digest) }

  has_many: :events, class_name: "Event", foreign_key: :owner_id, dependent: :destroy

  def password_nil?
    password.nil?
  end

  def reset_token!
    generate_token
    self.save!
  end

  def name=(name)
    @name = name
    names = self.name.split(" ")
    self.first_name = names.first
    self.last_name = (names.length > 1 ? names.last : "")
    @name
  end

  def no_middle_names
    errors[:base] << "Only first and last names" if self.name.split(" ").length > 2
  end

  private

  def generate_token
    self.token = SecureRandom.urlsafe_base64(16)
  end
end