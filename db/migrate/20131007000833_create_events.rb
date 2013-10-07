class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title, default: ""
      t.datetime :start_date, null: false
      t.datetime :end_date, null: false
      t.string :location
      t.integer :owner_id, null: false
      t.boolean :all_day, default: false
      t.string :time_zone, null: false

      t.timestamps
    end

    add_index :events, :owner_id, unique: true
    add_index :events, :title
    add_index :events, :start_date
    add_index :events, :end_date
  end
end
