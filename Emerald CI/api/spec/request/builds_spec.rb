require 'emerald/api/workers/job_worker'

RSpec.describe do
  before do
    @user = make_user('login' => 'flower-pot')
    login_as @user
    @project = FactoryGirl.create(:project)
  end

  describe '[POST] /projects/:id/builds/trigger/github' do
    it 'enqueues a job to execute the build' do
      webhook_payload = {
        head_commit: {
          id: 'sha123',
          message: 'Test message'
        }
      }.to_json

      expect {
        post "/api/v1/projects/#{@project.id}/builds/trigger/github", webhook_payload, 'CONTENT_TYPE' => 'application/json'
      }.to change { JobWorker.jobs.size }.by(1)

      job = Job.last
      expect(json_response).to eq ({
        id: job.id,
        build_id: job.build.id,
        project_id: job.build.project.id,
        state: 'not_running',
        started_at: nil,
        finished_at: nil
      })
    end
  end
end
