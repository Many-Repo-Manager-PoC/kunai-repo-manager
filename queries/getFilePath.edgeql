
# get FilePath by repoID
select assert_single(
  FilePath { ** }
  filter assert_exists(Repository.repository_id) ?= <optional int64>$repository_id
  and FilePath.file_type = FileType.JSON
) limit 1;
