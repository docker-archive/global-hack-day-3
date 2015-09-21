require 'emerald/api/models/build'
require 'emerald/api/models/log'
require 'emerald/api/event_emitter'
require 'bunny'

class Job < ActiveRecord::Base
  has_many :logs
  belongs_to :build
  enum state: [ :not_running, :running, :passed, :failed ]

  validates :state, presence: true

  default_scope { order('started_at DESC') }

  def log_stream(&block)
    conn = Bunny.new ENV['RABBITMQ_URL']
    conn.start
    ch = conn.create_channel
    x = ch.direct('logs', durable: true)
    q = ch.queue('', auto_delete: true).bind(x, routing_key: "job.#{id}")
    q.subscribe(&block)
  end

  def build_id
    self.build.id
  end

  def project_id
    self.build.project.id
  end

  def serialize_json
    as_json(methods: [:build_id, :project_id])
  end

  after_create do
    EventEmitter.emit({
      event_type: :new,
      type: :job,
      data: serialize_json
    }.to_json)
  end

  after_update do
    EventEmitter.emit({
      event_type: :update,
      type: :job,
      data: serialize_json
    }.to_json)
  end
end

