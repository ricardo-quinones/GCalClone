class EventsController < ApplicationController
  respond_to :json
  respond_to :html, only: [:index]

  def index
    @events = Event.all_by_owner_id(current_user.id)
    respond_to do |format|
      format.json {
        render json: @event.as_json()
      }
    end
  end

  def create
    @event = Event.new(params[:event])

    if @event.save
      render json: @event
    else
      render json: @event.errors.full_messages, status: 422
    end
  end

  def update
    @event = Event.find(param[:event])

    if @event.update_attributes
      render json: @event
    else
      render json: @event.errors.full_messages
    end
  end

  def destroy
    Event.find(params[:id]).destroy
    head :ok #possibly need something else
  end
end
