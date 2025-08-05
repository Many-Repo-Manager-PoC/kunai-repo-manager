CREATE MIGRATION m1lspa4puq7kkoabssxmksmib5ow4f45cqox25ktbue4oq4tgrmhxq
    ONTO m1kmac2tm5smdwmz6lcg6beztz3eroxo66unsbbwxkem2kzrqt7eba
{
  ALTER TYPE default::Organization {
      CREATE PROPERTY webhook_id: std::int64;
      CREATE INDEX ON (.webhook_id);
  };
  ALTER TYPE default::User {
      CREATE LINK organization: default::Organization;
  };
  ALTER TYPE default::Organization {
      CREATE LINK Users := (.<organization[IS default::User]);
      CREATE PROPERTY webhook_url: std::str;
  };
};
