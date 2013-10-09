class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation, :name, :time_zone,
    :first_name, :last_name
  attr_reader :name

  before_save :ensure_token

  before_validation { email.downcase! }
  EMAIL_REGEX = /\A[^\W_]([\w+\-]|(?<!\.)\.)+@[^\W_]([a-z\d\-]|(?<!\.)\.)+(?<!\.)\.[a-z]+\z/
  validates_presence_of :name,  on: :create

  validate :no_middle_names, on: :create
  validates :first_name, :last_name, length: { maximum: 50 }

  before_validation { email.downcase! }
  EMAIL_REGEX = /\A[^\W_]([\w+\-]|(?<!\.)\.)+@[^\W_]([a-z\d\-]|(?<!\.)\.)+(?<!\.)\.[a-z]+\z/
  validates :email, presence: true,
                    format: { with: EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }

  has_secure_password
  validates :password, presence: true, length: { minimum: 6 },
    confirmation: true, on: :create
  validates :password_confirmation, presence: true, on: :create

  validates :password, length: { minimum: 6, allow_nil: true }, confirmation: true, on: :update
  validates :password_confirmation, presence: true, unless: :password_nil?, on: :update

  after_validation { self.errors.messages.delete(:password_digest) }

  has_many :events, class_name: "Event", foreign_key: :creator_id
  has_many :calendars, class_name: "Calendar", foreign_key: :owner_id, dependent: :destroy

  def self.generate_token
    SecureRandom.urlsafe_base64(16)
  end

  def password_nil?
    password.nil?
  end

  def update_without_password(params)
    params.delete(:password)
    params.delete(:password_confirmation)
    self.update_attributes(params)
  end

  def reset_token!
    self.token = User.generate_token
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

  def ensure_token
    self.token ||= User.generate_token
  end
end