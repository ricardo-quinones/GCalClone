class CalendarShare < ActiveRecord::Base
  attr_accessible :calendar_id, :user_id, :permissions, :title, :description

  validates :user_id, uniqueness: { scope: :calendar_id }
  validates_presence_of :user_id, :calendar_id

  belongs_to :user
  belongs_to :calendar
end
