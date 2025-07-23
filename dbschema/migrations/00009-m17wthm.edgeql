CREATE MIGRATION m17wthmtl7b2kbied6oktbrzowblghi5mzi2kfzzrfaqjrzyz5ihua
    ONTO m1cngqvmmu7ajp2mrmxv4ueop7v4tshysd6c4tbk7iiafks2tfmuja
{
  ALTER TYPE default::Dependency {
      DROP INDEX ON (.dependency_type);
  };
  ALTER TYPE default::DevDependency {
      ALTER PROPERTY dependency_type {
          DROP ANNOTATION std::description;
          DROP REWRITE
              INSERT ;
              DROP OWNED;
          };
      };
  ALTER TYPE default::ProdDependency {
      ALTER PROPERTY dependency_type {
          DROP ANNOTATION std::description;
          DROP REWRITE
              INSERT ;
              DROP OWNED;
          };
      };
  ALTER TYPE default::Dependency {
      DROP PROPERTY dependency_type;
  };
  ALTER TYPE default::DevDependency {
      CREATE REQUIRED PROPERTY dependency_type := (default::DependencyType.Dev);
  };
  ALTER TYPE default::DevDependency {
      CREATE INDEX ON (.dependency_type);
  };
  ALTER TYPE default::ProdDependency {
      CREATE REQUIRED PROPERTY dependency_type := (default::DependencyType.Prod);
  };
  ALTER TYPE default::ProdDependency {
      CREATE INDEX ON (.dependency_type);
  };
};
