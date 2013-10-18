class AvailabilitySharesController < ApplicationController

  def create
    if params[:availability_shares].nil?
      emails = []
    else
      emails = params[:availability_shares].map { |email_hash| email_hash[:email] }
    end
    current_user.users_that_can_see_availability = User.where(email: emails)

    render json: current_user.users_that_can_see_availability.as_json(only: [:email])
  end

  def update
    @availability_share = AvailabilityShare.find(params[:id])

    if @availability_share.update_attributes(params[:availability_share])
      render json: @availability_share.as_json(
        only: [:id, :color, :title],
        methods: [:owner_email]
      )
    else
      render json: @availability_share.errors.full_messages
    end
  end
end
