class RootController < ApplicationController
  before_filter :sign_in_user

  def root
    @user = current_user
    @timezones = ActiveSupport::TimeZone.zones_map.to_json.html_safe
  end

  private

  def sign_in_user
    unless signed_in?
      store_location
      redirect_to new_session_url
    end
  end

  def correct_user?
    @user = User.find(params[:id])
    unless current_user?(user)
      redirect_to root_url
    end
  end
end
