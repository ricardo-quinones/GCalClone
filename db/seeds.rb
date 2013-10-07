# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

time_zone = User.find(2).time_zone

Calendar.create(owner_id: 2, title: "Work",
  description: "My work calendar", time_zone: time_zone)

