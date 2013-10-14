class AddDefaulCalendarColumnToUsers < ActiveRecord::Migration
  def change
    add_column :users, :default_calendar_id, :integer
  end
end
