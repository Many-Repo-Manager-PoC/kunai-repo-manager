CREATE MIGRATION m1uwp3zwdwutidni5fhe2powchijz2wveaf5byfmzk7crujjeqmyka
    ONTO m12qhy7yc2rmsoyeavj5grjpgrdoeh374ujjqotskczmzw2dc4s6oa
{
  ALTER TYPE default::Repository {
      ALTER PROPERTY repository_id {
          SET TYPE std::str USING (<std::str>.repository_id);
      };
  };
};
