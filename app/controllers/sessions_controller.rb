class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.find_by_email(params[:user][:email].downcase)

    if @user && @user.authenticate(params[:user][:password])
      sign_in @user
      redirect_to root_url
    else
      flash.now[:error] = "Invalid email/password combination"
      render :new
    end
  end

  def destroy
    sign_out_user
    redirect_to new_session_url
  end
end
