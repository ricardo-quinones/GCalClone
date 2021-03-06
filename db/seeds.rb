# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

time_zone = "America/Los_Angeles"
Time.zone = time_zone

# Calendar.create(owner_id: 1, title: "Personal",
#   description: "My personal calendar", time_zone: time_zone)
#
# Calendar.create(owner_id: 1, title: "Work",
# description: "My work calendar", time_zone: time_zone)

start_date = '26-10-2013 9:00'
end_date = '26-10-2013 14:00'

Event.create(calendar_id: 9, creator_id: 1, start_date: start_date, end_date: end_date, time_zone: time_zone, title: "Another All day event")

