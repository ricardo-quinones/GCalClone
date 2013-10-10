GCalClone::Application.routes.draw do
  root to: 'root#root'
  resource :root, only: [:root]

  resources :users, only: [:create, :new, :update, :show]
  resource :session, only: [:create, :new, :destroy]
  resources :events, except: [:show, :new, :edit]
  resources :calendars, except: [:show, :new, :edit]
  resources :calendar_shares, only: [:create, :update]
end