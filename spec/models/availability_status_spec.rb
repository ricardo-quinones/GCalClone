require 'spec_helper'

describe AvailabilityStatus do
  let(:user) do
    User.new(
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      password_confirmation:"password",
      time_zone: "America/New_York"
    )
  end

  let(:calendar) {double("Calendar")}

  let(:event) do
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

  before do
    user.save
    event.save
  end

  subject(:new_status) do
    AvailabilityStatus.new(
      event_id: event.id,
      user_id: user.id,
      availability: "free"
    )
  end

  it "should be valid" do
    expect(new_status).to be_valid
  end

  describe "it should be invalid" do
    it do
      new_status.event_id = nil
      expect(new_status).to be_invalid
    end

    it do
      new_status.user_id = nil
      expect(new_status).to be_invalid
    end

    it "requires either 'free/busy'" do
      new_status.availability = "gobbledy goop"
      expect(new_status).to be_invalid
    end
  end

  let(:other_status) do
    AvailabilityStatus.new(
      event_id: event.id,
      user_id: user.id,
      availability: "free"
    )
  end

  before { new_status.save }

  it "will invalidate setting status for same user and event combo" do
    expect(other_status.save).to be_false
  end
end