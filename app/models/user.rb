class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation, :name, :time_zone,
    :first_name, :last_name, :default_calendar_id
  attr_reader :name

  before_save :ensure_token
  before_save :change_time_zone_string, unless: :persisted?
  before_save :generate_default_calendars, unless: :persisted?

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
  has_many :calendar_shares, dependent: :destroy
  has_many :shared_calendars, through: :calendar_shares, source: :calendar

  has_many :availability_statuses, dependent: :destroy
  has_many(
    :events_labeled_as_busy,
    through: :availability_statuses,
    source: :event,
    conditions: ['availability_statuses.availability = ?', 'busy']
  )

  has_many :shares_of_users_availability, class_name: "AvailabilityShare", foreign_key: :availability_owner_id
  has_many :users_that_can_see_availability, through: :shares_of_users_availability, source: :availability_subscriber

  has_many :availabilities_shared_with_user, class_name: "AvailabilityShare", foreign_key: :availability_subscriber_id
  has_many :users_that_share_their_availability, through: :availabilities_shared_with_user, source: :availability_owner

  has_many(
    :manage_sharing_calendars,
    through: :calendar_shares,
    source: :calendar,
    conditions: ['calendar_shares.permissions = ?', "Make changes AND manage sharing"]
  )

  has_many(
    :make_event_changes_calendars,
    through: :calendar_shares,
    source: :calendar,
    conditions: ['calendar_shares.permissions = ?', "Make changes to events"]
  )

  has_many(
    :see_event_details_calendars,
    through: :calendar_shares,
    source: :calendar,
    conditions: ['calendar_shares.permissions = ?', "See all event details"]
  )

  def subscribed_user_availability_calendars
    [].tap do |array|
      self.users_that_share_their_availability.each do |user|
        hash = {}
        share_id = self.availabilities_shared_with_user.find_by_availability_owner_id(user.id).id
        hash["availability_share_id"] = share_id
        hash["can_edit_events"] = false
        hash["email"] = user.email
        hash["events"] = user.events_labeled_as_busy.select.as_json(only: [:start_date, :end_date, :all_day, :time_zone])
        hash["events"].map! { |event| event.merge({ "availability_share_id" => share_id }) }
        array << hash.merge(self.availabilities_shared_with_user.find_by_availability_owner_id(user.id).as_json(only: [:color, :title]))
      end
    end
  end

  def self.generate_token
    SecureRandom.urlsafe_base64(16)
  end

  def password_nil?
    password.nil?
  end

  def generate_default_calendars
    self.calendars = [
      Calendar.new(title: "Personal", time_zone: self.time_zone),
      Calendar.new(title: "Work", time_zone: self.time_zone)
    ]
  end

  def set_default_calendar_id
    self.default_calendar_id ||= self.calendars.first.id
    self.save
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

  def full_name
    return "#{self.first_name} #{self.last_name}"
  end

  def no_middle_names
    errors[:base] << "Only first and last names" if self.name.split(" ").length > 2
  end

  private

  def ensure_token
    self.token ||= User.generate_token
  end

  def change_time_zone_string
    self.time_zone = ActiveSupport::TimeZone::MAPPING.key(self.time_zone)
  end
end