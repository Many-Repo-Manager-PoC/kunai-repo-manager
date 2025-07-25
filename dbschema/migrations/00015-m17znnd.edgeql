CREATE MIGRATION m17znndgw6x2vejbsaa3oy4i3rgivepuqlwdtd322ko2n3xtz6aniq
    ONTO m1sgonzrpqcdh3l3d37xfxjqatnmt5zrfwtpktmemuyw7c6bqmgpjq
{
  ALTER TYPE default::RepositoryID {
      DROP INDEX ON (.repository);
  };
  ALTER TYPE default::Dependency {
      ALTER LINK repository {
          SET OWNED;
      };
  };
  ALTER TYPE default::PackageJson {
      DROP CONSTRAINT std::exclusive ON (.repository_id);
      ALTER LINK repository {
          SET OWNED;
      };
  };
  ALTER TYPE default::Repository {
      ALTER PROPERTY repository_id {
          SET OWNED;
      };
  };
  ALTER TYPE default::RepositoryID {
      DROP PROPERTY repository_id;
  };
  ALTER TYPE default::Dependency DROP EXTENDING default::RepositoryID;
  ALTER TYPE default::FilePath {
      ALTER LINK repository {
          SET OWNED;
      };
      DROP EXTENDING default::RepositoryID;
  };
  ALTER TYPE default::RepositoryID {
      DROP LINK repository;
  };
  ALTER TYPE default::PackageJson DROP EXTENDING default::RepositoryID;
  ALTER TYPE default::Repository DROP EXTENDING default::RepositoryID;
  ALTER TYPE default::Dependency {
      ALTER LINK repository {
          RESET readonly;
          SET SINGLE;
          SET REQUIRED;
          SET TYPE default::Repository;
      };
  };
  ALTER TYPE default::Repository {
      CREATE LINK all_dependencies := (.<repository[IS default::Dependency]);
  };
  ALTER TYPE default::PackageJson {
      ALTER LINK repository {
          RESET readonly;
          SET SINGLE;
          SET REQUIRED;
          SET TYPE default::Repository;
      };
  };
  ALTER TYPE default::FilePath {
      ALTER LINK repository {
          RESET readonly;
          SET SINGLE;
          SET REQUIRED;
          SET TYPE default::Repository;
      };
  };
  ALTER TYPE default::Repository {
      CREATE LINK all_file_paths := (.<repository[IS default::FilePath]);
  };
  ALTER TYPE default::PackageJson {
      CREATE CONSTRAINT std::exclusive ON (.repository) {
          CREATE ANNOTATION std::description := 'User can only have one PackageJson per repository';
      };
  };
  ALTER TYPE default::Repository {
      CREATE LINK package_json := (.<repository[IS default::PackageJson]);
      ALTER PROPERTY repository_id {
          RESET readonly;
          RESET CARDINALITY;
          SET REQUIRED;
          SET TYPE std::int64;
      };
  };
  DROP TYPE default::RepositoryID;
};
