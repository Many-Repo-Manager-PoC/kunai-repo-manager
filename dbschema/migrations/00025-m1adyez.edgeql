CREATE MIGRATION m1adyezyfuihhq4rmpc3qdzbeaxrev2anbjem4o7v5b2p6bv5jhy6q
    ONTO m1snemmxm46yg3xhhfugtm6rctn5duup3ylieq5vvez7xfa75u7fza
{
  ALTER TYPE default::CodeOfConduct {
      DROP CONSTRAINT std::exclusive ON (.node_id);
      ALTER PROPERTY node_id {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::License {
      DROP CONSTRAINT std::exclusive ON (.name);
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Organization {
      DROP CONSTRAINT std::exclusive ON (.login);
      DROP CONSTRAINT std::exclusive ON (.organization_id);
      ALTER PROPERTY login {
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER PROPERTY organizations_url {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      DROP CONSTRAINT std::exclusive ON (.user_id);
      ALTER PROPERTY user_id {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
