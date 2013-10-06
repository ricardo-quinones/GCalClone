GCalClone::Application.routes.draw do
  root to: 'root#root'
  resource :only, root: [:root]

  resources :users, only: [:create, :new, :update]
  resource :session, only: [:create, :new, :destroy]
end