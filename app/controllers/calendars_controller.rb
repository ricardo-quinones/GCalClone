class CalendarsController < ApplicationController

  before_filter :must_be_owner

  respond_to :json
  respond_to :html, only: [:index]

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
      render json: @calendar.as_json(include: [:calendar_shares], methods: [:emails_shared_with])
    end
  end

  def update
    begin
      Calendar.transaction do
        @calendar = Calendar.find(params[:id])
        @calendar.update_attributes(params[:calendar])
        @calendar.calendar_shares = CalendarShare.build_from_emails(params)
      end
      raise "Invalid input" unless @calendar.errors.full_messages.empty?
    rescue
      render json: @calendar.errors.full_messages, status: 422
    else
      render json: @calendar.as_json(include: [:calendar_shares], methods: [:emails_shared_with])
    end
  end

  def destroy
    @calendar = Calendar.find(params[:id])
    @calendar.destroy
    render json: @calendar
  end

  private

  def must_be_owner
    @calendar = Calendar.find(params[:id])
    unless current_user.id == @calendar.owner_id
      head :ok
    end
  end
end
