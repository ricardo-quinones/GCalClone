class CalendarShare < ActiveRecord::Base
  attr_accessible :calendar_id, :user_id, :permissions, :title, :description

  before_save :save_default_title_and_description, :if => :new_record?

  validates :user_id, uniqueness: { scope: :calendar_id }
  validates_presence_of :user_id, :calendar_id

  belongs_to :user
  belongs_to :calendar

  def save_default_title_and_description
    self.title = Calendar.find(self.calendar_id).owner_name
    self.description = Calendar.find(self.calendar_id).description
  end

  def owner_email
    self.calendar.owner_email
  end

  def calendar_time_zone
    Time.zone = self.calendar.time_zone
    Time.zone.to_s
  end
end
