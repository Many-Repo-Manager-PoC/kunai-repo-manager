with 
  NewPackageJson := (
    insert PackageJson {
      name := <str>$name,
      package_version := <str>$package_version,
      repository := (
        select Repository
        filter .name = <str>$repository
        limit 1
      )
    }
    unless conflict on .repository 
    else (
      update PackageJson
      filter .repository.name = <str>$repository
      set {
        name := <str>$name,
        package_version := <str>$package_version,
        repository := (
          select Repository
          filter .name = <str>$repository
          limit 1
        ),
      }
    )
  ),

  InsertProdDependencies := (
    for dependency in array_unpack(<array<tuple<name: str, dependency_version: str>>>$dependencies)
    union (
      insert ProdDependency {
        name := <str>dependency.name,
        dependency_version := <str>dependency.dependency_version,
        package_json := NewPackageJson,
        repository := NewPackageJson.repository,
      }
      unless conflict on (.dependency_type, .name, .repository)
      else (
        update ProdDependency
        filter .name = <str>dependency.name
          and .repository = NewPackageJson.repository
        set {
          dependency_version := <str>dependency.dependency_version,
        }
      )
    )
  ),

  InsertDevDependencies := (
    for dev_dependency in array_unpack(<array<tuple<name: str, dependency_version: str>>>$dev_dependencies)
    union (
      insert DevDependency {
        name := <str>dev_dependency.name,
        dependency_version := <str>dev_dependency.dependency_version,
        package_json := NewPackageJson,
        repository := NewPackageJson.repository,
      }
      unless conflict on (.dependency_type, .name, .repository)
      else (
        update DevDependency
        filter .name = <str>dev_dependency.name
          and .repository = NewPackageJson.repository
        set {
          dependency_version := <str>dev_dependency.dependency_version,
        }
      )
    )
  )

select NewPackageJson { ** };
