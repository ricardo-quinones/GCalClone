require 'spec_helper'

describe CalendarShare do
  let(:user) do
    User.new(
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      password_confirmation:"password",
      time_zone: "America/New_York"
    )
  end

  before { user.save }

  let(:calendar) do
    Calendar.new(
      title: "Personal",
      description: "This is a personal calendar",
      time_zone: "Eastern Time (US & Canada)",
      owner_id: user.id
    )
  end

  before{ calendar.save }

  subject(:calendar_share) do
    CalendarShare.new(
      permissions: "See all event details",
      calendar_id: calendar.id,
      user_id: user.id
    )
  end

  it "should be valid" do
    expect(calendar_share).to be_valid
  end

  before do
    calendar.stub(:owner).and_return(user)
    user.stub(:full_name).and_return("John Doe")
    calendar_share.save
  end

  it "should save a default title" do
    expect(calendar_share.title).to_not be_nil
  end

  it "should save a default description" do
    expect(calendar_share.description).to_not be_nil
  end

  it "should save a random color" do
    expect(calendar_share.color).to_not be_nil
  end

  it "can't edit events" do
    expect(calendar_share.can_edit_events).to be_false
  end

  it "can edit events" do
    calendar_share.permissions = "Make changes to events"
    expect(calendar_share.can_edit_events).to be_true
  end
end