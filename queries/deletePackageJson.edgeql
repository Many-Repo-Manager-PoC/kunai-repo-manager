with DeletedPackageJson := (
    delete PackageJson 
    filter .repository.repository_id = <int64>$repository_id
),
DeletedDependencies := (
    delete Dependency 
    filter .package_json.repository.repository_id = <int64>$repository_id
)
select {
    deleted_package_json := DeletedPackageJson {**},
    deleted_dependencies := DeletedDependencies {**}
};
