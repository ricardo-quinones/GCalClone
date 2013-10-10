class CalendarSharesController < ApplicationController

  def create
    @calendar_share = CalendarShare.new(params[:calendar_share])

    if @calendar_share.save
      render json: @calendar_share
    else
      render json: @calendar_share.errors.full_messages, status: 422
    end
  end

  def update
    @calendar_share = CalendarShare.find(params[:id])

    if @calendar_share.update_attributes(params[:calendar_share])
      render json: @calendar_share
    else
      render json: @calendar_share.errors.full_messages, status: 422
    end
  end

  def destroy
    @calendar_share = CalendarShare.find(params[:id])
    @calendar_share.destroy
    render json: @calendar_share
  end

end
