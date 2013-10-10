class CalendarsController < ApplicationController
  respond_to :json
  respond_to :html, only: [:index]

  def index
    @calendars = Calendar.find_all_by_owner_id(current_user.id)
    respond_to do |format|
      format.json {
        render json: @calendars.as_json(include: { :events => {
          methods: [:local_start_date, :local_end_date],
          except: [:start_date, :end_date]
        }})
      }
    end
  end

  def create
    @calendar = Calendar.new(params[:calendar])
    @calendar.owner_id = current_user.id

    if @calendar.save
      render json: @calendar
    else
      render json: @calendar.errors.full_messages, status: 422
    end
  end

  def update
    @calendar = Calendar.find(params[:id])

    if @calendar.update_attributes(params[:calendar])
      render json: @calendar
    else
      render json: @calendar.errors.full_messages, status: 422
    end
  end

  def destroy
    @calendar = Calendar.find(params[:id])
    @calendar.destroy
    render json: @calendar
  end
end
