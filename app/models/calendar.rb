class Calendar < ActiveRecord::Base
  attr_accessible :description, :owner_id, :time_zone, :title

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
end
