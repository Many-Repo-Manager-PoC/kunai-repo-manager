# get Dependency by dependency type
select Dependency { **
} filter assert_exists(Dependency.dependency_type) ?= <optional DependencyType>$dependency_type;

# get packageJson by dependency name
select Dependency { **
} filter assert_exists(Dependency.name) ?= <optional str>$name;

# get packageJson by dependency version
select Dependency { **
} filter assert_exists(Dependency.dependency_version) ?= <optional str>$dependency_version;

select Dependency { ** };

# This is all one query, but it's split up for readability. All filters are optional. 
# If no filters are provided, all Dependencies will be returned.
