class CalendarShare < ActiveRecord::Base
  attr_accessible :calendar_id, :user_id, :permissions, :title, :description

  before_save :save_default_title_and_description, :if => :new_record?

  validates :user_id, uniqueness: { scope: :calendar_id }
  validates_presence_of :user_id, :calendar_id

  belongs_to :user
  belongs_to :calendar

  def self.build_from_emails(params)
    attrs = params[:calendar_shares].values.map(&:values)
    user_ids = User.where(email: attrs.map { |el| el[0] }).map(&:id)

    new_params = attrs.map.with_index(0) do |el, i|
      hash = {};
      hash[:user_id] = user_ids[0]
      hash[:permissions] = el[1]
      hash
    end

    new_params.map { |new_attrs| CalendarShare.new(new_attrs) }
  end

  def save_default_title_and_description
    self.title = Calendar.find(self.calendar_id).owner_name
    self.description = Calendar.find(self.calendar_id).description
  end

  def owner_email
    self.calendar.owner_email
  end

  def calendar_time_zone
    Time.zone = self.calendar.time_zone
    Time.zone.to_s
  end
end
