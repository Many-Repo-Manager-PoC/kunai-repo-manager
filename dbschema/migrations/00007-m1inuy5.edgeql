CREATE MIGRATION m1inuy5cb5wokt4rca22o47pklzpb4ywfysvir4p24p4teyyyvjb6a
    ONTO m1ot6uy4np6yvh4bh74ldai6bbb2x5cmgwo45j2krji5qvxw4gfxdq
{
  CREATE SCALAR TYPE default::FileType EXTENDING enum<PNG, JPG, JPEG, GIF, SVG, PSD, JSON, MD, TXT, LOG, ZIP, GEL, TOML, YML, YAML, JSONC, WOFF2, CSS, TS, TSX, JS, EDGEQL, XML, PDF, CSV, SQL, HTML>;
  CREATE TYPE default::FilePath EXTENDING default::Timestamped, default::RepositoryID {
      CREATE ANNOTATION std::description := 'A file path is a path to a file in a repository.';
      ALTER INDEX ON (.repository_id) SET OWNED;
      CREATE REQUIRED PROPERTY file_name: std::str;
      CREATE REQUIRED PROPERTY file_type: default::FileType;
      CREATE REQUIRED PROPERTY path: std::str;
  };
};
