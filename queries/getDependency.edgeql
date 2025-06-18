# get Dependency by dependency type
select Dependency { **
} filter assert_exists(Dependency.dependency_type) ?= <optional DependencyType>$dependency_type;

# get packageJson by dependency repository_id
select Dependency { **
} filter assert_exists(Dependency.repository_id) ?= <optional int64>$repository_id;

# This is all one query, but it's split up for readability. All filters are optional. 

