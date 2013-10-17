require 'spec_helper'

describe AvailabilityShare do
  let(:owner) do
    User.new(
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      password_confirmation:"password",
      time_zone: "America/New_York"
    )
  end

  let(:subscriber) do
    User.new(
      name: "Ann Doe",
      email: "ann.doe@example.com",
      password: "password",
      password_confirmation:"password",
      time_zone: "America/New_York"
    )
  end

  before do
    owner.save
    subscriber.save
  end

  subject(:availability_share) do
    AvailabilityShare.new(
      availability_owner_id: owner.id,
      availability_subscriber_id: subscriber.id
    )
  end

  it "should be valid" do
    expect(availability_share).to be_valid
  end

  describe "should invalidate a share without user ids" do
    it do
      availability_share.availability_owner_id = nil
      expect(availability_share).to be_invalid
    end

    it do
      availability_share.availability_subscriber_id = nil
      expect(availability_share).to be_invalid
    end
  end

  before { availability_share.save }

  it "should save a default title" do
    expect(availability_share.title).to eq("John Doe")
  end

  it "should set a random color" do
    expect(availability_share.color).to_not be_nil
  end

  let(:other_share1) do
    AvailabilityShare.new(
      availability_owner_id: owner.id,
      availability_subscriber_id: subscriber.id
    )
  end

  it "should not let users share availability to same person" do
    expect(other_share1.save).to be_false
  end

  let(:other_share2) do
    AvailabilityShare.new(
      availability_owner_id: subscriber.id,
      availability_subscriber_id: owner.id
    )
  end

  it "should allow subscriber to share to owner" do
    expect(other_share2.save).to be_true
  end
end