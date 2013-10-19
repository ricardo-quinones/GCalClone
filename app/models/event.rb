class Event < ActiveRecord::Base
  attr_accessible :all_day, :end_date, :location, :start_date, :title,
    :calendar_id, :creator_id, :time_zone, :description, :event_color

  validate :valid_date_range
  validates :all_day, :inclusion => {:in => [true, false]}
  validates_presence_of :calendar_id, :start_date, :end_date,
    :time_zone, :creator_id

  belongs_to :calendar
  belongs_to :creator, class_name: "User", foreign_key: :creator_id

  has_many :availability_statuses, dependent: :destroy

  def color
    self.event_color || self.calendar.color
  end

  def availability_status(user)
    self.availability_statuses.where(user_id: user.id).first
  end

  def valid_date_range
    unless self.start_date < self.end_date
      errors.add(:start_date, "Invalid date range")
    end
  end
end
