module ActiveSupport
  class TimeZone

   def as_json(options=nil)
     { name:             name,
       identifier:       tzinfo.identifier,
       total_utc_offset: string_utc_offset }
   end

   def string_utc_offset
     num = tzinfo.current_period.utc_total_offset / 60 / 60
     string = "#{num.to_s[/\d/]}:00"
     string = "0#{string}" if string.length < 5
     num < 0 ? "-#{string}" : "+#{string}"
   end

  end
end