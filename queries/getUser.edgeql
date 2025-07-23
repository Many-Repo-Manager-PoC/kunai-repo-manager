select User { **
} filter assert_exists(User.user_id) ?= <optional int64>$user_id;

select User { **
} filter assert_exists(User.login) ?= <optional str>$login;

# This is all one query, but it's split up for readability. All filters are optional. 
# If no filters are provided, all Users will be returned.
