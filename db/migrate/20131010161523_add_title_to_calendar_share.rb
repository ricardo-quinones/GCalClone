class AddTitleToCalendarShare < ActiveRecord::Migration
  def change
    add_column :calendar_shares, :title, :string
  end
end
