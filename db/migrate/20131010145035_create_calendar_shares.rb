class CreateCalendarShares < ActiveRecord::Migration
  def change
    create_table :calendar_shares do |t|
      t.integer :calendar_id, null: false
      t.integer :user_id, null: false
      t.string :permissions, default: "See all event details"

      t.timestamps
    end
    add_index :calendar_shares, :calendar_id
    add_index :calendar_shares, :user_id
    add_index :calendar_shares, [:user_id, :calendar_id], unique: true
  end
end
