require 'docker'
require 'slack-notifier'

puts(ENV["SLACK_URL"])

notifier = Slack::Notifier.new(ENV["SLACK_URL"])

puts "Booting"

Docker::Event.stream do |event|
	container = Docker::Container.get(event.id)
	hostname = container.json["Config"]["Hostname"]

	#puts "hostname: #{container.json}"
	container_name = container.json["Name"]
	puts "name: #{container_name}"

        pcontainer = {id: hostname, name: "C1", image:"Ubuntu 14.04"}

	if event.status == "stop"
		#pevent = {level: "warning", description: "Stopped"}
		notifier.ping "Container #{hostname} was Stopped"
		puts "Notifying Slack"
	elsif event.status == "start"
		#pevent = {level: "good", description: "Started"
		notifier.ping "Container #{hostname} was Started"
		puts "Notifying Slack"
	end

	#DockerNotifier.notify(qevent, qcontainer)
end

class DockerNotifier

	def self.notify(event, container)
		notifier = Slack::Notifier.new "https://hooks.slack.com/services/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"

		message = {
			fallback: "Container #{container[:id]} was #{event[:description]}",
			color: "#{event[:level]}",
			fields: [
				{
					title: "Name",
					value: "#{container[:name]}",
					short: false
				},
				{
					title: "Image",
					value: "#{container[:image]}",
					short: false
				}
			]
		}
		notifier.ping "Container #{container[:id]} was #{event[:description]}", attachments: [message]
	end

end