class EventsController < ApplicationController

  before_filter :must_have_permission, only: [:update, :destroy]

  respond_to :json
  respond_to :html, only: [:index]

  def index
    @events = Event.all_by_creator_id(current_user.id)
    respond_to do |format|
      format.json {
        render json: @event.as_json()
      }
    end
  end

  def create
    @event = Event.new(params[:cal_event])
    @event.creator_id = current_user.id

    if @event.save
      render json: @event.as_json(
        methods: [:local_start_date, :local_end_date, :color],
        except: [:start_date, :end_date, :event_color]
      )
    else
      render json: @event.errors.full_messages, status: 422
    end
  end

  def update
    @event = Event.find(params[:id])

    if @event.update_attributes(params[:cal_event])
      render json: @event.as_json(
        methods: [:local_start_date, :local_end_date, :color],
        except: [:start_date, :end_date, :event_color]
      )
    else
      render json: @event.errors.full_messages
    end
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    render json: @event
  end

  private

  def is_not_creator?
    current_user.id != Event.find(params[:id]).creator_id
  end

  def must_have_permission
    @event = Event.find(params[:id])
    check_if_has_permission = CalendarShare
                                .where(calendar_id: @event.calendar_id)
                                .where(user_id: current_user.id)
                                .where(permissions: ["Make changes AND manage sharing", "Make changes to events"])
    if check_if_has_permission.empty? && is_not_creator?
      render json: @event.as_json(
        methods: [:local_start_date, :local_end_date, :color],
        except: [:start_date, :end_date, :event_color]
      )
    end
  end
end
