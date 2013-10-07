module SessionsHelper
  def sign_in(user)
    user.reset_token!
    session[:token] = user.token
    self.current_user = user
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    @current_user ||= User.find_by_token(session[:token])
  end

  def signed_in?
    !!current_user
  end

  def sign_out_user
    self.current_user = nil
    session.delete(:token)
  end

  def current_user?(user)
    @current_user == user
  end

  def store_location
    session[:return_to] = request.url
  end

  def redirect_back_or(default)
    redirect_to(session[:return_to] || default)
    session.delete(:return_to)
  end
end
