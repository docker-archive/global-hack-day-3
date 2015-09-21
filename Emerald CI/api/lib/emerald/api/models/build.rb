class Build < ActiveRecord::Base
  has_many :jobs
  belongs_to :project

  validates :short_description, presence: true
  validates :description, presence: true

  default_scope { order('created_at DESC') }

  before_validation(on: :create) do
    self.short_description = self.description.split("\n").first[0..68]
  end

  def project_id
    self.project.id
  end

  def latest_job
    latest_job = jobs.first
    return nil if latest_job.nil?
    latest_job.serialize_json
  end

  def serialize_json
    self.as_json(methods: [:latest_job, :project_id])
  end

  after_create do
    EventEmitter.emit({
      event_type: :new,
      type: :build,
      data: self.serialize_json
    }.to_json)
  end
end

