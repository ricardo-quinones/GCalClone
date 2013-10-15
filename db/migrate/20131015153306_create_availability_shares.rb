class CreateAvailabilityShares < ActiveRecord::Migration
  def change
    create_table :availability_shares do |t|
      t.integer :availability_owner_id, null: false
      t.integer :availability_subscriber_id, null: false

      t.timestamps
    end
    add_index :availability_shares, :availability_owner_id
    add_index :availability_shares, :availability_subscriber_id
  end
end
