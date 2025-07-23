CREATE MIGRATION m1ot6uy4np6yvh4bh74ldai6bbb2x5cmgwo45j2krji5qvxw4gfxdq
    ONTO m1r5gxh4kh54o5srkhf7u4rmgubtq5ilke4atyacn6xvqkptxn7c7q
{
  ALTER TYPE default::DevDependency {
      ALTER PROPERTY dependency_type {
          CREATE ANNOTATION std::description := 'on insert, set dependency_type to Dev';
      };
  };
  ALTER TYPE default::License {
      CREATE CONSTRAINT std::exclusive ON (.name);
  };
  ALTER TYPE default::PackageJson {
      CREATE CONSTRAINT std::exclusive ON (.repository_id) {
          CREATE ANNOTATION std::description := 'User can only have one PackageJson per repository';
      };
  };
  ALTER TYPE default::ProdDependency {
      ALTER PROPERTY dependency_type {
          CREATE ANNOTATION std::description := 'on insert, set dependency_type to Prod';
      };
  };
  ALTER TYPE default::Repository {
      ALTER LINK permissions {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
  ALTER TYPE default::User {
      CREATE CONSTRAINT std::exclusive ON (.user_id);
  };
};
