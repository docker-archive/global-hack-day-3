require 'emerald/api/models/project'

class GithubProject < Project
  validates :github_repo_id, presence: true
end

