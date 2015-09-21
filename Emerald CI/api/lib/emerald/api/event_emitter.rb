require 'bunny'

module EventEmitter
  extend self

  def emit(payload)
    x.publish(payload, :routing_key => "events")
  end

  private

  def x
    @x ||= begin
             conn = Bunny.new ENV['RABBITMQ_URL']
             conn.start
             ch = conn.create_channel
             ch.direct('events', durable: true)
           end
  end
end
