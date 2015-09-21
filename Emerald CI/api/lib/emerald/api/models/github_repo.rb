class GithubRepo < ActiveRecord::Base
  def serialize_json
    as_json(only: [:github_repo_id, :full_name])
  end
end

