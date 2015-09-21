module RequestHelper
  def json_response
    JSON.parse(last_response.body, symbolize_names: true)
  end
end

RSpec.configure do |config|
  config.include RequestHelper
end

