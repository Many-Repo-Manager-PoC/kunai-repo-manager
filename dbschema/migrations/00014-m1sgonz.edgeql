CREATE MIGRATION m1sgonzrpqcdh3l3d37xfxjqatnmt5zrfwtpktmemuyw7c6bqmgpjq
    ONTO m15a5zn55pwuuczsfzqw23f5jfqq7323dg6kagmgupurmbxwtq3qpq
{
  ALTER TYPE default::DevDependency {
      DROP INDEX ON (.dependency_type);
  };
  ALTER TYPE default::DevDependency {
      DROP PROPERTY dependency_type;
  };
  ALTER TYPE default::ProdDependency {
      DROP INDEX ON (.dependency_type);
  };
  ALTER TYPE default::ProdDependency {
      DROP PROPERTY dependency_type;
  };
  ALTER TYPE default::Dependency {
      CREATE PROPERTY dependency_type: default::DependencyType;
      CREATE INDEX ON (.dependency_type);
  };
  ALTER TYPE default::DevDependency {
      ALTER PROPERTY dependency_type {
          SET default := (default::DependencyType.Dev);
          SET OWNED;
          SET TYPE default::DependencyType;
      };
  };
  ALTER TYPE default::ProdDependency {
      ALTER PROPERTY dependency_type {
          SET default := (default::DependencyType.Prod);
          SET OWNED;
          SET TYPE default::DependencyType;
      };
  };
};
