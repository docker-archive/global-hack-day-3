require 'emerald/api/models/plain_project'

FactoryGirl.define do
  factory :project, class: PlainProject do
    name 'test'
    git_url 'https://github.com/emerald-ci/ruby-example'
  end
end
