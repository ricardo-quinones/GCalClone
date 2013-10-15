class AddColumnToAvailabilityShares < ActiveRecord::Migration
  def change
    add_column :availability_shares, :color, :string
  end
end
