class AvailabilityStatus < ActiveRecord::Base
  attr_accessible :event_id, :availability, :user_id

  attr_accessible :event_id, :availability, :user_id

  validates :user_id, uniqueness: { scope: :event_id }
  validates_presence_of :event_id, :user_id
  validates_inclusion_of :availability, in: %w(free busy)

  belongs_to :event
  belongs_to :user
end