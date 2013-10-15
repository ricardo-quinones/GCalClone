class CreateAvailabilityStatuses < ActiveRecord::Migration
  def change
    create_table :availability_statuses do |t|
      t.integer :user_id, null: false
      t.integer :event_id, null: false
      t.string :availability, default: "busy"

      t.timestamps
    end
    add_index :availability_statuses, :event_id
    add_index :availability_statuses, :user_id
    add_index :availability_statuses, [:user_id, :event_id], unique: true
  end
end
