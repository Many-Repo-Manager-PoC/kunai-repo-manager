CREATE MIGRATION m1cngqvmmu7ajp2mrmxv4ueop7v4tshysd6c4tbk7iiafks2tfmuja
    ONTO m1inuy5cb5wokt4rca22o47pklzpb4ywfysvir4p24p4teyyyvjb6a
{
  ALTER TYPE default::Dependency {
      SET ABSTRACT;
      ALTER INDEX ON (.repository_id) SET OWNED;
      CREATE INDEX ON (.package_json);
  };
  ALTER TYPE default::PackageJson {
      ALTER LINK dependencies {
          ON SOURCE DELETE DELETE TARGET;
      };
      ALTER LINK dev_dependencies {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
};
