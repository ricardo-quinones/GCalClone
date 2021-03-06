class UsersController < ApplicationController

  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.json {
        render json: @user.as_json(
          except: [:password_digest, :token],
          include: {
            availability_statuses: {},
            shares_of_users_availability: {
              only: [],
              methods: [:email]
            },
            availabilities_shared_with_user: {
              only: [:id, :color, :title],
              methods: [:owner_email]
            },
            calendars: {
              include: {
                :events => {
                  methods: [:color],
                  except: [:event_color]
                },
              },
              methods: [:emails_shared_with]
            },
            # these are calendars shared with the user
            calendar_shares: {
              except: [:user_id, :permissions],
              methods: [:owner_email, :calendar_time_zone, :can_edit_events]
            },
            manage_sharing_calendars: {
              include: {
                events: {
                  methods: [:color],
                  except: [:event_color]
                },
                users_shared_with: {
                  only: [:email]
                }
              },
              methods: [:owner_email, :owner_name, :emails_shared_with],
              except: [:owner_id]
            },
            make_event_changes_calendars: {
              include: {
                events: {
                  methods: [:color],
                  except: [:event_color]
                }
              },
              methods: [:owner_email, :owner_name],
              except: [:owner_id, :description, :title],
            },
            see_event_details_calendars: {
              include: {
                events: {
                  methods: [:color],
                  except: [:event_color]
                }
              },
              methods: [:owner_email, :owner_name],
              except: [:owner_id, :description, :title]
            }
          },
          methods: [:subscribed_user_availability_calendars]
        )
      }
    end
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])

    if @user.save
      @user.set_default_calendar_id
      sign_in @user
      redirect_to root_url
    else
      render :new
    end
  end

  def update
    @user = User.find(params[:id])

    if params[:user][:password].blank?
      if @user.update_without_password(params[:user])
        Time.zone = @user.time_zone
        render json: @user
      else
        render json: @user.errors.full_messages
      end
    else
      if @user.update_attributes(params[:user])
        Time.zone = @user.time_zone
        render json: @user
      else
        render json: @user.errors.full_messages
      end
    end
  end
end
