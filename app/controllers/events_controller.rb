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
    begin
      Event.transaction do
        @event = Event.new(params[:cal_event])
        @event.creator_id = current_user.id
        @event.save

        new_statuses = @event.calendar.users_shared_with.map(&:id).map do |user_id|
          AvailabilityStatus.new(availability: "free", user_id: user_id)
        end

        @event.availability_statuses.create(
          availability: params[:availability],
          user_id: current_user.id
        )

        @event.availability_statuses << new_statuses
      end

      raise "Invalid input" unless @event.persisted?
    rescue
      render json: @event.errors.full_messages, status: 422
    else
      render json: @event.as_json(
        methods: [:color],
        except: [:event_color]
      )
    end
  end

  def update
    @event = Event.find(params[:id])
    calendar = @event.calendar
    @event.update_attributes(params[:cal_event])
    @event.availability_status(current_user)
      .update_attributes(availability: params[:availability])

    if @event.calendar_id != calendar
      @event.availability_statuses
        .where("availability_statuses.user_id != ?", current_user.id)
        .destroy_all

      new_statuses = @event.calendar.users_shared_with.map(&:id).map do |user_id|
        AvailabilityStatus.new(availability: "free", user_id: user_id)
      end
      @event.availability_statuses << new_statuses
    end

    render json: @event.as_json(
      methods: [:color],
      except: [:event_color]
    )
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
                                .where(permissions: [
                                  "Make changes AND manage sharing",
                                  "Make changes to events"
                                ])

    if check_if_has_permission.empty? && is_not_creator?
      render json: @event.as_json(
        methods: [:color],
        except: [:event_color]
      )
    end
  end
end
