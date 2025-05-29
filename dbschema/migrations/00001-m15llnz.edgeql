CREATE MIGRATION m15llnzggdw3iqlofgvtgazqodycqp6zv47o2cwavoihzwgrhfiq2a
    ONTO initial
{
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::CommitAuthor {
      CREATE PROPERTY login: std::str;
  };
  CREATE TYPE default::CommitAuthorData {
      CREATE PROPERTY date: std::str;
      CREATE PROPERTY name: std::str;
  };
  CREATE TYPE default::CommitData {
      CREATE LINK author: default::CommitAuthorData;
      CREATE PROPERTY message: std::str;
  };
  CREATE TYPE default::shaCommit {
      CREATE LINK author: default::CommitAuthor;
      CREATE LINK commitData: default::CommitData;
      CREATE PROPERTY html_url: std::str;
      CREATE PROPERTY sha: std::str;
  };
  CREATE TYPE default::CreationInfo {
      CREATE PROPERTY created: std::str;
      CREATE PROPERTY creators: array<std::str>;
  };
  CREATE TYPE default::Package {
      CREATE PROPERTY SPDXID: std::str;
      CREATE PROPERTY downloadLocation: std::str;
      CREATE PROPERTY externalRefs: array<std::json>;
      CREATE PROPERTY filesAnalyzed: std::bool;
      CREATE PROPERTY licenseConcluded: std::str;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY versionInfo: std::str;
  };
  CREATE TYPE default::SBOM {
      CREATE LINK creationInfo: default::CreationInfo;
      CREATE MULTI LINK packages: default::Package;
      CREATE PROPERTY SPDXID: std::str;
      CREATE PROPERTY dataLicense: std::str;
      CREATE PROPERTY documentNamespace: std::str;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY relationshipType: std::str;
      CREATE PROPERTY spdxVersion: std::str;
  };
  CREATE TYPE default::Relationship {
      CREATE PROPERTY relatedSpdxElement: std::str;
      CREATE PROPERTY relationshipType: std::str;
      CREATE PROPERTY spdxElementId: std::str;
  };
  CREATE TYPE default::Dependencies {
      CREATE MULTI LINK relationships: default::Relationship;
      CREATE LINK sbom: default::SBOM;
  };
  CREATE TYPE default::Dependency {
      CREATE LINK dependencies: default::Dependencies;
      CREATE PROPERTY error: std::str;
      CREATE PROPERTY repo: std::str;
  };
  CREATE TYPE default::License {
      CREATE PROPERTY name: std::str;
  };
  CREATE TYPE default::Owner {
      CREATE PROPERTY avatar_url: std::str;
      CREATE PROPERTY html_url: std::str;
      CREATE PROPERTY login: std::str;
      CREATE PROPERTY type: std::str;
  };
  CREATE TYPE default::Repo {
      CREATE LINK license: default::License;
      CREATE LINK owner: default::Owner;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY forks_count: std::int64;
      CREATE PROPERTY full_name: std::str;
      CREATE PROPERTY homepage: std::str;
      CREATE PROPERTY html_url: std::str;
      CREATE PROPERTY language: std::str;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY open_issues_count: std::int64;
      CREATE PROPERTY repo: std::str;
      CREATE PROPERTY repoOwner: std::str;
      CREATE PROPERTY stargazers_count: std::int64;
      CREATE PROPERTY topics: array<std::str>;
      CREATE PROPERTY updated_at: std::str;
      CREATE PROPERTY url: std::str;
      CREATE PROPERTY watchers_count: std::int64;
  };
  CREATE TYPE default::Member {
      CREATE PROPERTY avatar_url: std::str;
      CREATE PROPERTY html_url: std::str;
      CREATE PROPERTY login: std::str;
  };
  CREATE TYPE default::PackageJsonData {
      CREATE PROPERTY dependencies: std::json;
      CREATE PROPERTY devDependencies: std::json;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY version: std::str;
  };
  CREATE TYPE default::PackageJson {
      CREATE LINK packageJson: default::PackageJsonData;
      CREATE PROPERTY error: std::str;
      CREATE PROPERTY repo: std::str;
  };
};
