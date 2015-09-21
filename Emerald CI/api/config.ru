#\ -s puma
require './config/environment'
require 'emerald/api'

use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :patch, :put, :delete]
  end
end
run Emerald::API::App

