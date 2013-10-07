class Calendar < ActiveRecord::Base
  attr_accessible :description, :owner_id, :time_zone, :title

  validates_presence_of :owner_id, :time_zone, :title

  belongs_to :owner, class_name: "User", foreign_key: :owner_id

  has_many :events, dependent: :destroy
end
