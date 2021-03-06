# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20131015191738) do

  create_table "availability_shares", :force => true do |t|
    t.integer  "availability_owner_id",      :null => false
    t.integer  "availability_subscriber_id", :null => false
    t.datetime "created_at",                 :null => false
    t.datetime "updated_at",                 :null => false
    t.string   "color"
    t.string   "title"
  end

  add_index "availability_shares", ["availability_owner_id"], :name => "index_availability_shares_on_availability_owner_id"
  add_index "availability_shares", ["availability_subscriber_id"], :name => "index_availability_shares_on_availability_subscriber_id"

  create_table "availability_statuses", :force => true do |t|
    t.integer  "user_id",                          :null => false
    t.integer  "event_id",                         :null => false
    t.string   "availability", :default => "busy"
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
  end

  add_index "availability_statuses", ["event_id"], :name => "index_availability_statuses_on_event_id"
  add_index "availability_statuses", ["user_id", "event_id"], :name => "index_availability_statuses_on_user_id_and_event_id", :unique => true
  add_index "availability_statuses", ["user_id"], :name => "index_availability_statuses_on_user_id"

  create_table "calendar_shares", :force => true do |t|
    t.integer  "calendar_id",                                      :null => false
    t.integer  "user_id",                                          :null => false
    t.string   "permissions", :default => "See all event details"
    t.datetime "created_at",                                       :null => false
    t.datetime "updated_at",                                       :null => false
    t.string   "title"
    t.text     "description"
    t.string   "color"
  end

  add_index "calendar_shares", ["calendar_id"], :name => "index_calendar_shares_on_calendar_id"
  add_index "calendar_shares", ["user_id", "calendar_id"], :name => "index_calendar_shares_on_user_id_and_calendar_id", :unique => true
  add_index "calendar_shares", ["user_id"], :name => "index_calendar_shares_on_user_id"

  create_table "calendars", :force => true do |t|
    t.integer  "owner_id",    :null => false
    t.string   "time_zone",   :null => false
    t.string   "title",       :null => false
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.string   "color"
  end

  add_index "calendars", ["owner_id"], :name => "index_calendars_on_owner_id"
  add_index "calendars", ["time_zone"], :name => "index_calendars_on_time_zone"
  add_index "calendars", ["title"], :name => "index_calendars_on_title"

  create_table "events", :force => true do |t|
    t.string   "title",       :default => ""
    t.datetime "start_date",                     :null => false
    t.datetime "end_date",                       :null => false
    t.string   "location"
    t.integer  "creator_id",                     :null => false
    t.integer  "calendar_id",                    :null => false
    t.boolean  "all_day",     :default => false
    t.string   "time_zone",                      :null => false
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.string   "description"
    t.string   "event_color"
  end

  add_index "events", ["creator_id"], :name => "index_events_on_creator_id"
  add_index "events", ["end_date"], :name => "index_events_on_end_date"
  add_index "events", ["start_date"], :name => "index_events_on_start_date"
  add_index "events", ["title"], :name => "index_events_on_title"

  create_table "users", :force => true do |t|
    t.string   "first_name",          :null => false
    t.string   "last_name",           :null => false
    t.string   "email",               :null => false
    t.string   "password_digest",     :null => false
    t.string   "time_zone",           :null => false
    t.string   "token",               :null => false
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
    t.integer  "default_calendar_id"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["password_digest"], :name => "index_users_on_password_digest"
  add_index "users", ["token"], :name => "index_users_on_token"

end
