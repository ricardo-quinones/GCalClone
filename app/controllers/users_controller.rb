class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])

    if @user.save
      sign_in @user
      redirect_to root_url
    else
      render :new
    end
  end

  def update
    @user = User.find(params[:id])

    if @user.update_attributes(params[:user])
      render json: @user
    else
      render json: @user.errors.full_messages
    end
  end
end
