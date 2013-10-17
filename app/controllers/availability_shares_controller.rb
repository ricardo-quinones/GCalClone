class AvailabilitySharesController < ApplicationController

  def create
    emails = params[:availability_shares].map { |email_hash| email_hash[:email] }
    current_user.users_that_can_see_availability = User.where(email: emails)

    render json: current_user.users_that_can_see_availability.as_json(only: [:email])
  end
end
