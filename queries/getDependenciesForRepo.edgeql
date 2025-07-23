# Get all dependencies by repository_id or package_json name
select Dependency {
  **
} filter (
  assert_exists(Repository.repository_id) ?= <optional int64>$repository_id 
  or assert_exists(Dependency.package_json.name) ?= <optional str>$package_json_name
);
