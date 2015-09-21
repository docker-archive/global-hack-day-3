require 'faye/websocket'
require 'thread'
require 'bunny'
require 'json'
require 'erb'

module Emerald
  module API
    class LogStream
      KEEPALIVE_TIME = 15 # in seconds
      ROUTE_REGEX = /\/api\/v1\/jobs\/(\d+)\/logs/

      def initialize(app)
        @app = app
        conn = Bunny.new ENV['RABBITMQ_URL']
        conn.start
        @ch = conn.create_channel
        @x = @ch.direct('logs', durable: true)
      end

      def call(env)
        route = env['PATH_INFO']
        if Faye::WebSocket.websocket?(env) && !!(ROUTE_REGEX =~ route)
          ws = Faye::WebSocket.new(env, nil, { ping: KEEPALIVE_TIME })
          job_id = route.scan(ROUTE_REGEX).first.first

          ws.on :open do |event|
            q = @ch.queue('', auto_delete: true).bind(@x, routing_key: "job.#{job_id}")
            q.subscribe do |delivery_info, properties, payload|
              payload = JSON.parse(payload)
              log_line = payload['payload']['log'].strip
              if !log_line.empty?
                log = Log.new(content: log_line)
                payload['payload']['log'] = log.html_log_line
                ws.send(payload.to_json)
              end
            end
          end

          ws.on :close do |event|
            ws = nil
          end

          # Return async Rack response
          ws.rack_response
        else
          @app.call(env)
        end
      end
    end
  end
end
