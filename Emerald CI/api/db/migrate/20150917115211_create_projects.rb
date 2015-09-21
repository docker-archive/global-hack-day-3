class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :type, null: false
      t.string :name, null: false
      t.string :git_url, null: false
      t.integer :github_repo_id
    end
  end
end

