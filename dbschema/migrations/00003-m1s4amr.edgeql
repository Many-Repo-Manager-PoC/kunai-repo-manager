CREATE MIGRATION m1s4amr6bijcbksbxjps3o5we2s353uk75hnqlaqktul3lgw625pxa
    ONTO m1umkppqub3ofa62h43lrressunalrtp4odgwzntxk6b7bcuyz2loa
{
  CREATE ABSTRACT TYPE default::Timestamped {
      CREATE REQUIRED PROPERTY data_updated_at: std::datetime {
          SET default := (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::Dependency EXTENDING default::Timestamped LAST;
  ALTER TYPE default::PackageJson EXTENDING default::Timestamped LAST;
  ALTER TYPE default::License EXTENDING default::Timestamped LAST;
  ALTER TYPE default::Permissions EXTENDING default::Timestamped LAST;
  ALTER TYPE default::User EXTENDING default::Timestamped LAST;
  ALTER TYPE default::Repository EXTENDING default::Timestamped LAST;
};
