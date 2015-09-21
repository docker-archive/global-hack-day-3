$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'lib'))
ENV['GITHUB_VERIFIER_SECRET'] = ENV['SESSION_SECRET']
ENV['WARDEN_GITHUB_VERIFIER_SECRET'] = ENV['SESSION_SECRET']
require 'sidekiq'
require 'emerald/api/event_emitter'
Sidekiq.configure_server do |config|
  config.redis = { :namespace => 'emeraldci' }
end
Sidekiq.configure_client do |config|
  config.redis = { :namespace => 'emeraldci', :size => 1 }
end

