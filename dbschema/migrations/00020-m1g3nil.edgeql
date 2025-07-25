CREATE MIGRATION m1g3nilzd6chcvp65b2cr3j2voorgc6at3owhftde2m6xrvmu34s7q
    ONTO m1uwp3zwdwutidni5fhe2powchijz2wveaf5byfmzk7crujjeqmyka
{
  ALTER TYPE default::Repository {
      ALTER PROPERTY repository_id {
          SET TYPE std::int64 USING (<std::int64>.repository_id);
      };
  };
};
