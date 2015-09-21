require 'sinatra/activerecord'
require 'sinatra/activerecord/rake'

namespace :db do
  task :load_config do
    require_relative 'config/environment'
    require 'emerald/api'
  end
end

begin
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
  task default: :spec
rescue LoadError
  puts 'rspec tasks could not be loaded'
end
