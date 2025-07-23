CREATE MIGRATION m16xlh67us7bzmnmkbrmococ3k62tt5elsr5esdcwu4vkeyedxqxaq
    ONTO m17wthmtl7b2kbied6oktbrzowblghi5mzi2kfzzrfaqjrzyz5ihua
{
  ALTER TYPE default::Dependency {
      ALTER LINK package_json {
          SET REQUIRED USING (<default::PackageJson>{{}});
      };
  };
  ALTER TYPE default::PackageJson {
      ALTER LINK dev_dependencies {
          USING (.<package_json[IS default::DevDependency]);
          RESET ON SOURCE DELETE;
      };
      ALTER LINK dependencies {
          USING (.<package_json[IS default::ProdDependency]);
          RESET ON SOURCE DELETE;
      };
  };
};
