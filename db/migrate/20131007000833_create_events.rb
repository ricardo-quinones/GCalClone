class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title
      t.datetime :start_date
      t.datetime :end_date
      t.string :location
      t.integer :owner_id
      t.boolean :all_day

      t.timestamps
    end
  end
end
