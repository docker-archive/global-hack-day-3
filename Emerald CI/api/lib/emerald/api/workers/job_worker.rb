require_relative '../../../../config/environment'
require 'emerald/api'

require 'sidekiq'
require 'docker'
require 'emerald/api/models/job'

class JobWorker
  include Sidekiq::Worker

  def perform(job_id)
    job = Job.find(job_id)

    # this is async
    job.log_stream do |delivery_info, properties, payload|
      payload = JSON.parse(payload)
      log_line = payload['payload']['log'].strip
      job.logs.create(content: log_line) if !log_line.empty?
    end

    container = create_container(job)
    job.update!(
      state: :running,
      started_at: Time.now
    )
    container.start
    result = container.wait(3600) # allow jobs to take up to one hour
    statusCode = result['StatusCode']
    jobState = { 0 => :passed }.fetch(statusCode, :failed)
    job.update!(
      state: jobState,
      finished_at: Time.now
    )
  end

  def create_container(job)
    Docker::Image.create('fromImage' => 'emeraldci/environment') if !Docker::Image.exist?('emeraldci/environment')
    Docker::Container.create(
      'Cmd' => [job.build.project.git_url, job.build.commit],
      'Image' => 'emeraldci/environment',
      'Tty' => true,
      'OpenStdin' => true,
      'HostConfig' => {
        'Privileged' => true,
        'Binds' => ['/var/run/docker.sock:/var/run/docker.sock'],
        'LogConfig' => {
          'Type' => 'fluentd',
          'Config' => {
            'fluentd-address' => ENV['FLUENTD_URL'],
            'fluentd-tag' => "job.#{job.id}"
          }
        }
      }
    )
  end
end
