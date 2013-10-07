class CalendarsController < ApplicationController
  respond_to :json
  respond_to :html, only: [:index]

  def index
    @calendars = Calendar.find_all_by_owner_id(current_user.id)
    respond_to do |format|
      format.json {
        render json: @calendars.as_json(include: [:events])
      }
    end
  end

  def create
    @calendar = Calendar.new(params[:calendar])

    if @calendar.save
      render json: @calendar
    else
      render json: @calendar.errors.full_messages, staus: 422
    end
  end

  def update
    @calendar = Calendar.find(params[:id])

    if @calendar.update_attributes
      render json: @calendar
    else
      render json: @calendar.errors.full_messages, status: 422
    end
  end

  def destroy
    Calendar.find(params[:id]).destroy
    head :ok #maybe something else
  end
end