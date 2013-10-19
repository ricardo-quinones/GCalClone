class CalendarsController < ApplicationController

  before_filter :must_be_owner, only: [:destroy]
  before_filter :must_have_permission, only: [:update]

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

        unless params[:calendar_shares].nil?
          attrs = params[:calendar_shares].values.map(&:values)
          updated_user_ids = User.where(email: attrs.map { |el| el[0] }).map(&:id)
          AvailabilityStatus.update_statuses(updated_user_ids, @calendar)

          @calendar.calendar_shares = CalendarShare.build_from_emails(params)
        end
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

  def is_not_owner?
    current_user.id != Calendar.find(params[:id]).owner_id
  end

  def must_be_owner
    if is_not_owner?
      head :ok
    end
  end

  def must_have_permission
    @calendar = Calendar.find(params[:id])
    check_if_has_permission = CalendarShare
                                .where(calendar_id: @calendar.id)
                                .where(user_id: current_user.id)
                                .where(permissions: "Make changes AND manage sharing")
    if check_if_has_permission.empty? && is_not_owner?
      render json: @event.as_json(
        methods: [:color],
        except: [:event_color]
      )
    end
  end
end