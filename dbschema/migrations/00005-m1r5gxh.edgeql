CREATE MIGRATION m1r5gxh4kh54o5srkhf7u4rmgubtq5ilke4atyacn6xvqkptxn7c7q
    ONTO m1ndunpn4qhtc5w7pmsmdtflrnain73gorog62iphwq2exsbmlfrna
{
  ALTER TYPE default::Dependency {
      CREATE LINK package_json: default::PackageJson;
  };
};
