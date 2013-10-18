class AvailabilityShare < ActiveRecord::Base
  attr_accessible :availability_owner_id, :availability_subscriber_id, :color, :title

  before_save :set_random_color, unless: :persisted?
  before_save :save_default_title, unless: :persisted?

  validates_presence_of :availability_owner_id, :availability_subscriber_id
  validates :availability_subscriber_id, uniqueness: { scope: :availability_owner_id }

  belongs_to :owner, class_name: "User", foreign_key: :availability_owner_id
  belongs_to :subscriber, class_name: "User", foreign_key: :availability_subscriber_id

  def set_random_color
    self.color = Calendar.colors.sample
  end

  def save_default_title
    self.title = self.owner.full_name
  end

  def email
    self.subscriber.email
  end

  def owner_email
    self.owner.email
  end
end