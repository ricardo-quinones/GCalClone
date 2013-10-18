class AvailabilityStatusesController < ApplicationController

  def update
    @availability_status = AvailabilityStatus.find(params[:id])

    if @availability_status.update_attributes(params[:availability_status])
      render json: @availability_status
    else
      render json: @availability_status.errors.full_messages
    end
  end
end
