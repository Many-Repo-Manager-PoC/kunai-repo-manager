CREATE MIGRATION m1i5erjzrnv77kuptbj6dratf5vjthxmg2bhabjewjejamspfe5alq
    ONTO m16xlh67us7bzmnmkbrmococ3k62tt5elsr5esdcwu4vkeyedxqxaq
{
  ALTER TYPE default::Dependency {
      ALTER INDEX ON (.repository_id) DROP OWNED;
  };
  ALTER TYPE default::FilePath {
      ALTER INDEX ON (.repository_id) DROP OWNED;
  };
};
