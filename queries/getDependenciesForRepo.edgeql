# Get all dependencies for a single repository by repository_id
select Dependency {
  **
} filter .repository.repository_id = <int64>$repository_id;
