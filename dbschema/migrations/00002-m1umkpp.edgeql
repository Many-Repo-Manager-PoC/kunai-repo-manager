CREATE MIGRATION m1umkppqub3ofa62h43lrressunalrtp4odgwzntxk6b7bcuyz2loa
    ONTO m1yrxqtcmpx2cr3v3u74powyqvadit2saldwat2iupvitwab6z4nva
{
  ALTER TYPE default::Dependency {
      CREATE REQUIRED PROPERTY repository_id: std::int64 {
          SET REQUIRED USING (<std::int64>'1');
      };
      CREATE INDEX ON (.repository_id);
  };
};
