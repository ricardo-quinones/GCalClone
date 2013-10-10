class AddDescriptionToCalendarShares < ActiveRecord::Migration
  def change
    add_column :calendar_shares, :description, :text
  end
end
