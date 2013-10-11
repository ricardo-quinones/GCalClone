class CalendarsController < ApplicationController
  respond_to :json
  respond_to :html, only: [:index]

  def index
    @calendars = Calendar.find_all_by_owner_id(current_user.id)
    respond_to do |format|
      format.json {
        render json: @calendars.as_json(
          include: {
            :events => {
              methods: [:local_start_date, :local_end_date],
              except: [:start_date, :end_date]
            },
            :users_shared_with => {
              only: [:email]
            }
          }
        )
      }
    end
  end

  def create
    begin
      Calendar.transaction do
        @calendar = Calendar.new(params[:calendar])
        @calendar.owner_id = current_user.id
        @calendar.save

        @calendar.calendar_shares = CalendarShare.build_from_emails(params)
      end
      raise "Invalid input" unless @calendar.persisted?
    rescue
      render json: @calendar.errors.full_messages, status: 422
    else
      render json: @calendar.as_json(include: [:calendar_shares])
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
