
# get packageJson by repoID
select PackageJson { **
} filter assert_exists(PackageJson.repository_id) ?= <optional int64>$repository_id;

# get packageJson by repo name
select PackageJson { **
} filter assert_exists(Repository.full_name) ?= <optional str>$name;

# return all packageJsons
select PackageJson { ** };

