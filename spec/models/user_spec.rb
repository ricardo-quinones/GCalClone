require 'spec_helper'

describe User do

  describe "valid user sign up" do
    subject(:valid_user) do
      User.new(
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
        password_confirmation:"password",
        time_zone: "America/New_York"
      )
    end

    it "should have email and password" do
      expect(valid_user).to be_valid
    end

    it "can have 1 or 2 names" do
      valid_user.name = "John"
      expect(valid_user).to be_valid
    end

    before { valid_user.save }

    it "should have a session token" do
      expect(valid_user.token).not_to be_nil
    end

    it "should have two calendars added by default" do
      expect(valid_user.calendars.length).to equal(2)
    end

    it "allows for updating without a password and last name to be blank" do
      user_params = { last_name: "", password: "", password_confirmation: "" }
      expect(valid_user.update_without_password(user_params)).to be_true
    end

    it "requires at first name on update" do
      user_params = {first_name: "" }
      expect(valid_user.update_attributes(user_params)).to be_false
    end
  end

  describe "invalid user sign up" do
    subject(:invalid_user) do
      User.new(
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
        password_confirmation:"password",
        time_zone: "America/New_York"
      )
    end

    it "doesn't allow middle names" do
      invalid_user.name = "John Michael Doe"
      expect(invalid_user).to be_invalid
    end

    it "doesn't allow names longer than 50 characters" do
      invalid_user.name = "#{"a" * 51} #{"b" * 51}"
      expect(invalid_user).to be_invalid
    end

    describe "requires email in correct format" do
      it do
        invalid_user.email = "johndoe"
        expect(invalid_user).to be_invalid
      end

      it do
        invalid_user.email = "johndoe@"
        expect(invalid_user).to be_invalid
      end

      it do
        invalid_user.email = "!@johndoe@"
        expect(invalid_user).to be_invalid
      end

      it do
        invalid_user.email = "johndoe@goofy"
        expect(invalid_user).to be_invalid
      end

      it do
        invalid_user.email = "johndoe@asdf!@#.com"
        expect(invalid_user).to be_invalid
      end
    end

    describe "verifies password and password confirmation" do
      it "requires password" do
        invalid_user.password = nil
        expect(invalid_user).to be_invalid
      end

      it "requires password confirmation" do
        invalid_user.password_confirmation = nil
        expect(invalid_user).to be_invalid
      end

      it "requires passwords to match" do
        invalid_user.password_confirmation = "not_password"
        expect(invalid_user).to be_invalid
      end

      it "disallows passwords shorter than 6 characters" do
        invalid_user.password = "passw"
        invalid_user.password_confirmation = "passw"
        expect(invalid_user).to be_invalid
      end
    end
  end
end