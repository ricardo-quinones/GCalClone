class CreateCalendars < ActiveRecord::Migration
  def change
    create_table :calendars do |t|
      t.integer :owner_id, null: false
      t.string :time_zone, null: false
      t.string :title, null: false
      t.text :description

      t.timestamps
    end
    add_index :calendars, :owner_id
    add_index :calendars, :time_zone
    add_index :calendars, :title
  end
end
