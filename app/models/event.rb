class Event < ActiveRecord::Base
  attr_accessible :all_day, :end_date, :location, :start_date,
    :title, :calendar_id, :creator_id, :time_zone

  before_validation :adjust_dates

  validates_presence_of :calendar_id, :start_date, :end_date,
    :time_zone, :creator_id

  belongs_to :calendar
  belongs_to :creator, class_name: "User", foreign_key: :creator_id

  def adjust_dates
    Time.zone = self.time_zone
    self.start_date = Time.zone.parse(start_date).utc
    self.end_date = Time.zone.parse(end_date).utc
  end

  def adjusted_start_date
    self.start_date.in_time_zone(self.time_zone)
  end

  def adjusted_end_date
    self.end_date.in_time_zone(self.time_zone)
  end
end
