CREATE MIGRATION m1kmac2tm5smdwmz6lcg6beztz3eroxo66unsbbwxkem2kzrqt7eba
    ONTO m1do4bzjvgjp7z2egvppv3olbb4jhuhtgadmrpthe7pbw6gtfxjuua
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
  ALTER TYPE default::User {
      DROP CONSTRAINT std::exclusive ON (.user_id);
      ALTER PROPERTY user_id {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
