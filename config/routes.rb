GCalClone::Application.routes.draw do
  root to: 'root#root'
  resource :root, only: [:root]

  resources :users, only: [:create, :new, :update]
  resource :session, only: [:create, :new, :destroy]
  resources :events, except: [:show, :new]
end