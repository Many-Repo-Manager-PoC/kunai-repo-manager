CREATE MIGRATION m1do4bzjvgjp7z2egvppv3olbb4jhuhtgadmrpthe7pbw6gtfxjuua
    ONTO m1i76lgfs4m5idozdrgqmngq76fpryp6ip5vi2tjusej3yut33csgq
{
  ALTER TYPE default::DevDependency {
      CREATE CONSTRAINT std::exclusive ON ((.dependency_type, .name, .repository)) {
          CREATE ANNOTATION std::description := 'Dependency must be unique per repository';
      };
  };
  ALTER TYPE default::ProdDependency {
      CREATE CONSTRAINT std::exclusive ON ((.dependency_type, .name, .repository)) {
          CREATE ANNOTATION std::description := 'Dependency must be unique per repository';
      };
  };
};
