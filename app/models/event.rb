class Event < ActiveRecord::Base
  attr_accessible :all_day, :end_date, :location, :start_date,
    :title, :calendar_id, :creator_id, :time_zone

  before_validation :adjust_dates

  validates :all_day, :inclusion => {:in => [true, false]}
  validates_presence_of :calendar_id, :start_date, :end_date,
    :time_zone, :creator_id

  belongs_to :calendar
  belongs_to :creator, class_name: "User", foreign_key: :creator_id

  def adjust_dates
    self.start_date = ActiveSupport::TimeZone.new(self.time_zone)
      .local_to_utc(self.start_date)
    self.end_date = ActiveSupport::TimeZone.new(self.time_zone)
      .local_to_utc(self.end_date)
  end

  def local_start_date
    self.start_date.in_time_zone(self.time_zone)
  end

  def local_end_date
    self.end_date.in_time_zone(self.time_zone)
  end
end
