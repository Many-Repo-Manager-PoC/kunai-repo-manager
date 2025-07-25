CREATE MIGRATION m17gt525r25kgqwvsfrplorpfr4utsbnmynwfdhvqm7fpzpxv7zaiq
    ONTO m1i5erjzrnv77kuptbj6dratf5vjthxmg2bhabjewjejamspfe5alq
{
  ALTER TYPE default::RepositoryID {
      DROP INDEX ON (.repository_id);
      CREATE REQUIRED LINK repository: default::Repository {
          SET REQUIRED USING (<default::Repository>{(SELECT
              default::Repository 
          LIMIT
              1
          )});
      };
  };
  ALTER TYPE default::RepositoryID {
      CREATE INDEX ON (.repository);
  };
};
