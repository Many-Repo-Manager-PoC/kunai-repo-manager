select assert_single(Repository { **
}) filter (
  assert_exists(Repository.repository_id) ?= <optional int64>$repository_id or
  assert_exists(Repository.full_name) ?= <optional str>$name or
  assert_exists(Repository.name) ?= <optional str>$name
);

