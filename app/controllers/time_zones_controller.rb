class TimeZonesController < ApplicationController
  respond_to :json
  respond_to :html, only: [:index]

  def index
    @time_zones = TZInfo::Timezone.all.map(&:name)
    respond_to do |format|
      format.json { render @time_zones.to_json }
      format.html { render :index }
    end
  end
end
