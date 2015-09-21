require 'uri'

class Project < ActiveRecord::Base
  has_many :builds

  validates :git_url, format: { with: URI::regexp, message: 'is not a valid URL' }, presence: true

  def latest_build
    latest_build = builds.first
    return nil if latest_build.nil?
    latest_build.serialize_json
  end

  def serialize_json
    self.as_json(only: [:id, :name, :type, :git_url], methods: :latest_build)
  end
end

