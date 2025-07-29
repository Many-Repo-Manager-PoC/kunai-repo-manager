with 
  NewPackageJson := (insert PackageJson {
    name := <str>$name,
    package_version := <str>$package_version,
    repository := <Repository>$repository,
  }),
  InsertProdDependencies := (
    for  dependency in array_unpack(<array<tuple<name: str, dependency_version: str>>>$dependencies)
    union (
      insert ProdDependency {
        name := <str>dependency.name,
        dependency_version := <str>dependency.dependency_version,
        package_json := NewPackageJson,
        repository := <Repository>$repository,
      }
    )
  ),
  InsertDevDependencies := (
    for  dev_dependency in array_unpack(<array<tuple<name: str, dev_dependency_version: str>>>$dev_dependencies)
    union (
      insert DevDependency {
        name := <str>dev_dependency.name,
        dependency_version := <str>dev_dependency.dev_dependency_version,
        package_json := NewPackageJson,
        repository := <Repository>$repository,
      }
    )
  )
select NewPackageJson {**};


