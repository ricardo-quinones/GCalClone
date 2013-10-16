class AddTitleToAvailabilityShares < ActiveRecord::Migration
  def change
    add_column :availability_shares, :title, :string
  end
end
