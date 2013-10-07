class Event < ActiveRecord::Base
  attr_accessible :all_day, :end_date, :location,
    :start_date, :title, :calendar_id, :creator_id

  validates_presence_of :calendar_id, :start_date, :end_date,
    :time_zone, :creator_id

  belongs_to :calendar
  belongs_to :creator, class_name: "User", foreign_key: :creator_id
end
