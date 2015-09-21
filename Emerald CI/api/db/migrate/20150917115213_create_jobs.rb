class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.belongs_to :build
      t.integer :state, default: 0
      t.datetime :started_at
      t.datetime :finished_at
    end
  end
end

