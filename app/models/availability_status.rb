class AvailabilityStatus < ActiveRecord::Base
  attr_accessible :event_id, :availability, :user_id

  attr_accessible :event_id, :availability, :user_id

  validates :user_id, uniqueness: { scope: :event_id }
  validates_presence_of :event_id, :user_id
  validates_inclusion_of :availability, in: %w(free busy)

  belongs_to :event
  belongs_to :user

  def self.update_statuses(updated_user_ids, calendar)
    old_user_ids = calendar.users_shared_with.map(&:id)
    users_to_delete = old_user_ids - updated_user_ids
    users_to_add = updated_user_ids - old_user_ids

    AvailabilityStatus
      .joins(:event)
      .where("availability_statuses.user_id IN (?)", users_to_delete)
      .where("events.calendar_id = ?", calendar.id)
      .destroy_all

    calendar.events.each do |event|
      new_statuses = users_to_add.map { |user_id| AvailabilityStatus.new(availability: "free", user_id: user_id) }
      event.availability_statuses << new_statuses
    end
  end
end