class UsersController < ApplicationController

  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.json {
        render json: @user.as_json(except: [:password_digest, :token])
      }
    end
  end

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

    if params[:user][:password].blank?
      if @user.update_without_password(params[:user])
        render json: @user
      else
        render json: @user.errors.full_messages
      end
    else
      if @user.update_attributes(params[:user])
        render json: @user
      else
        render json: @user.errors.full_messages
      end
    end
  end
end
