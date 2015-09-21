class CreateGithubRepos < ActiveRecord::Migration
  def change
    create_table :github_repos do |t|
      t.string :full_name
      t.integer :github_repo_id
      t.integer :github_user_id
    end
  end
end

