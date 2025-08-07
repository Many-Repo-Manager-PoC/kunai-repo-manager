CREATE MIGRATION m1snemmxm46yg3xhhfugtm6rctn5duup3ylieq5vvez7xfa75u7fza
    ONTO m1i76lgfs4m5idozdrgqmngq76fpryp6ip5vi2tjusej3yut33csgq
{
  ALTER TYPE default::Repository {
      DROP CONSTRAINT std::exclusive ON (.repository_id);
      DROP CONSTRAINT std::exclusive ON (.name);
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER PROPERTY repository_id {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
