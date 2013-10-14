class AddColorColumnToCalendarShares < ActiveRecord::Migration
  def change
    add_column :calendar_shares, :color, :string
  end
end
