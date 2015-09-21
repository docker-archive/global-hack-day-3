require 'docker'
require 'slack-notifier'


notifier = Slack::Notifier.new(ENV["SLACK_URL"])

Docker::Event.stream do |event|
        puts event
        container = Docker::Container.get(event.id)
        if container 
        	hostname = container.json["Config"]["Hostname"]
	        if event.status && event.status == "stop"
	                notifier.ping "Container #{hostname} was Stopped"
	                puts "Container event.id} was Stopped"
	        elsif event.status && event.status == "start"
	                notifier.ping "Container #{hostname} was Started"
	                puts "Container event.id} was Started"
	        end
        end
end