class Event < ActiveRecord::Base
  attr_accessible :all_day, :end_date, :location, :start_date, :title,
    :calendar_id, :creator_id, :time_zone, :description, :event_color

  validates :all_day, :inclusion => {:in => [true, false]}
  validates_presence_of :calendar_id, :start_date, :end_date,
    :time_zone, :creator_id

  belongs_to :calendar
  belongs_to :creator, class_name: "User", foreign_key: :creator_id

  has_many :availability_statuses, dependent: :destroy

  def local_start_date
    self.start_date.in_time_zone(self.time_zone).iso8601
  end

  def local_end_date
    self.end_date.in_time_zone(self.time_zone).iso8601
  end

  def color
    self.event_color || self.calendar.color
  end

  def availability_status(user)
    self.availability_statuses.where(user_id: user.id).first
  end

  # COLORS = [
  #   "#0099FF",
  #   "#33CC33",
  #   "#CC9933",
  #   "#99CCFF",
  #   "#CC0000",
  #   "#FFFF33",
  #   "#330099",
  #   "#C0C0C0",
  #   "#E80000",
  #   "#9966CC",
  #   "#990000",
  #   "#009900",
  #   "#009999"
  # ]
end
