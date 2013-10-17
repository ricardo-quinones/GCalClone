require 'spec_helper'

describe Calendar do

  let(:user) { double("User")}

  subject(:calendar) do
    user.stub(:id).and_return(1)

    Calendar.new(
      title: "Personal",
      description: "This is a personal calendar",
      time_zone: "Eastern Time (US & Canada)",
      owner_id: user.id
    )
  end

  it "should be valid" do
    expect(calendar).to be_valid
  end

  before {calendar.save}

  it "should have random color set" do
    expect(calendar.color).to_not be_nil
  end
end