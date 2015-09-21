class CreateBuilds < ActiveRecord::Migration
  def change
    create_table :builds do |t|
      t.belongs_to :project
      t.string :commit
      t.string :short_description
      t.text :description

      t.timestamps null: false
    end
  end
end

