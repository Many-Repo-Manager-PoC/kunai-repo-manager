with 
  NewPackageJson := (insert PackageJson {
    name := <str>$name,
    package_version := <str>$package_version,
    repository := <Repository>$repository,
  }),

  

select NewPackageJson {*};


# InsertProdDependencies := (
#     for dependency in <array<tuple<name: str, dependency_version: str>>>$dependencies
#     union (
#       insert ProdDependency {
#         name := dependency.name,
#         dependency_version := dependency.dependency_version,
#         package_json := NewPackageJson,
#       }
#     )
#   ),

#   InsertDevDependencies := (
#     for dev_dependency in <array<tuple<name: str, dev_dependency_version: str>>>$dev_dependencies
#     union (
#       insert DevDependency {
#         name := dev_dependency.name,
#         dev_dependency_version := dev_dependency.dev_dependency_version,
#         package_json := NewPackageJson,
#       }
#     )
#   )