class AvailabilityShare < ActiveRecord::Base
  attr_accessible :availability_owner_id, :availability_subscriber_id, :color, :title

  before_save :set_random_color, unless: :persisted?
  before_save :save_default_title, unless: :persisted?

  validates_presence_of :availability_owner_id, :availability_subscriber_id
  validates :availability_subscriber_id, uniqueness: { scope: :availability_owner_id }

  belongs_to :availability_owner, class_name: "User", foreign_key: :availability_owner_id
  belongs_to :availability_subscriber, class_name: "User", foreign_key: :availability_subscriber_id

  def set_random_color
    self.color = COLORS.sample
  end

  def save_default_title
    self.title = self.availability_subscriber.full_name
  end

  def email
    self.availability_subscriber.email
  end

  COLORS = [
    "#0099FF",
    "#33CC33",
    "#CC9933",
    "#99CCFF",
    "#CC0000",
    "#FFFF33",
    "#330099",
    "#C0C0C0",
    "#E80000",
    "#9966CC",
    "#990000",
    "#009900",
    "#009999"
  ]
end
