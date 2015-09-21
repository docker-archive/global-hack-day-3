# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150917115215) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "builds", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "commit"
    t.string   "short_description"
    t.text     "description"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "github_repos", force: :cascade do |t|
    t.string  "full_name"
    t.integer "github_repo_id"
    t.integer "github_user_id"
  end

  create_table "jobs", force: :cascade do |t|
    t.integer  "build_id"
    t.integer  "state",       default: 0
    t.datetime "started_at"
    t.datetime "finished_at"
  end

  create_table "logs", force: :cascade do |t|
    t.integer "job_id"
    t.string  "content"
  end

  create_table "projects", force: :cascade do |t|
    t.string  "type",           null: false
    t.string  "name",           null: false
    t.string  "git_url",        null: false
    t.integer "github_repo_id"
  end

end
