class Event < ActiveRecord::Base
  attr_accessible :all_day, :end_date, :location, :owner_id, :start_date, :title
end
