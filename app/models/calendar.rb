class Calendar < ActiveRecord::Base
  attr_accessible :description, :owner_id, :time_zone, :title, :color

  before_save :set_random_color, unless: :persisted?
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
    self.color = Calendar.colors.sample
  end

  def emails_shared_with
  [].tap do |array|
      self.calendar_shares.each do |calendar_share|
        hash = Hash.new
        hash[:email] = calendar_share.user.email
        hash[:permissions] = calendar_share.permissions
        array << hash
      end
    end
  end

  def self.colors
    ["#0099FF", "#33CC33", "#CC9933", "#99CCFF", "#CC0000", "#FFFF33",
     "#330099", "#C0C0C0", "#E80000", "#9C99FF", "#990000", "#009900",
     "#009999", "#A9715D", "#CC6964", "#96E3BE", "#26AA61", "#B996FF",
     "#CB6EEA", "#F7D35F", "#5083EA", "#F97334", "#F9EB8C", "#B4DF65"]
  end
end