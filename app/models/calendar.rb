class Calendar < ActiveRecord::Base
  attr_accessible :description, :owner_id, :time_zone, :title, :color

  before_save :set_random_color
  validates_presence_of :owner_id, :time_zone, :title

  belongs_to :owner, class_name: "User", foreign_key: :owner_id

  has_many :events, dependent: :destroy
  has_many :calendar_shares, dependent: :destroy
  has_many :users_shared_with, through: :calendar_shares, source: :user

  def owner_email
    self.owner.email
  end

  def owner_name
    self.owner.full_name
  end

  def set_random_color
    self.color = COLORS.sample
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