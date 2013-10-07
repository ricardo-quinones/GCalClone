class Event < ActiveRecord::Base
  attr_accessible :all_day, :end_date, :location, :owner_id, :start_date, :title

  validates_presence_of :owner_id, :start_date, :end_date, :time_zone

  belongs_to :user, class_name: "User", foreign_key: :owner_id
end
