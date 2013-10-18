class CalendarShare < ActiveRecord::Base
  attr_accessible :calendar_id, :user_id, :permissions, :title, :description, :color

  before_save :set_random_color, unless: :persisted?
  before_save :save_default_title_and_description, :if => :new_record?

  validates :user_id, uniqueness: { scope: :calendar_id }
  validates_presence_of :user_id, :calendar_id
  validates_inclusion_of :permissions, in: ["Make changes AND manage sharing",
                                            "Make changes to events",
                                            "See all event details"]

  belongs_to :user
  belongs_to :calendar

  def self.build_from_emails(params)
    attrs = params[:calendar_shares].values.map(&:values)
    user_ids = User.where(email: attrs.map { |el| el[0] }).map(&:id)

    new_params = attrs.map.with_index(0) do |el, i|
      hash = {};
      hash[:user_id] = user_ids[i]
      hash[:permissions] = el[1]
      hash
    end

    new_params.map { |new_attrs| CalendarShare.new(new_attrs) }
  end

  def set_random_color
    self.color = Calendar.colors.sample
  end

  def save_default_title_and_description
    self.title = self.calendar.owner_name
    self.description = self.calendar.description
  end

  def owner_email
    self.calendar.owner_email
  end

  def calendar_time_zone
    ActiveSupport::TimeZone.new(self.calendar.time_zone).to_s
  end

  def can_edit_events
    self.permissions == "Make changes AND manage sharing" ||
      self.permissions == "Make changes to events"
  end
end