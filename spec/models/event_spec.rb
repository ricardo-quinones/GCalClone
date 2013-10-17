require 'spec_helper'

describe Event do

  let(:user) {double("User")}
  let(:calendar) {double("Calendar")}

  subject(:event) do
    user.stub(:id).and_return(1)
    calendar.stub(:id).and_return(1)

    Event.new(
      title: "Eat lunch with Becky",
      description: "This is a personal calendar",
      location: "Panera",
      time_zone: "Eastern Time (US & Canada)",
      start_date: "2013-10-17 13:00 -0400",
      end_date: "2013-10-17 14:10 -0400",
      creator_id: user.id,
      calendar_id: calendar.id
    )
  end

  it "should be valid" do
    expect(event).to be_valid
  end

  it "should be valid without a description" do
    event.description = nil
    expect(event).to be_valid
  end

  it "is not a valid date range" do
    event.start_date = "2013-10-17 14:00 -0400"
    event.end_date = "2013-10-17 13:00 -0400"
    expect(event).to be_invalid
  end

  it "should have a calendar_id" do
    event.calendar_id = nil
    expect(event).to be_invalid
  end

  it "should have a creator_id" do
    event.creator_id = nil
    expect(event).to be_invalid
  end

  it "should have a time zone" do
    event.time_zone  = nil
    expect(event).to be_invalid
  end
end