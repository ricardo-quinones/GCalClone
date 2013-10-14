class RenameColorColumnForEvents < ActiveRecord::Migration
  def change
    rename_column :events, :color, :event_color
  end
end
