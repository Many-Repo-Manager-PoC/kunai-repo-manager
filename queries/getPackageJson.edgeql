
# get packageJson by repoID
select assert_single(
  PackageJson { ** }
  filter assert_exists(PackageJson.repository_id) ?= <optional int64>$repository_id
);

# get packageJson by repo name
select assert_single(
  PackageJson { ** }
  filter assert_exists(Repository.full_name) ?= <optional str>$name
);

# This is all one query, but it's split up for readability. All filters are optional. 
