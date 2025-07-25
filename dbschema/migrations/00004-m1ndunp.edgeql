CREATE MIGRATION m1ndunpn4qhtc5w7pmsmdtflrnain73gorog62iphwq2exsbmlfrna
    ONTO m1s4amr6bijcbksbxjps3o5we2s353uk75hnqlaqktul3lgw625pxa
{
  CREATE SCALAR TYPE default::DependencyType EXTENDING enum<Dev, Prod>;
  ALTER TYPE default::Dependency {
      CREATE REQUIRED PROPERTY dependency_type: default::DependencyType {
          SET REQUIRED USING (<default::DependencyType>{default::DependencyType.Prod});
      };
  };
  ALTER TYPE default::Timestamped {
      DROP PROPERTY data_updated_at;
  };
  CREATE ABSTRACT TYPE default::RepositoryID {
      CREATE REQUIRED PROPERTY repository_id: std::int64;
  };
  ALTER TYPE default::Dependency EXTENDING default::RepositoryID LAST;
  ALTER TYPE default::Timestamped {
      CREATE PROPERTY last_updated: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::Dependency {
      ALTER PROPERTY repository_id {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Dependency {
      CREATE ANNOTATION std::description := "Dependencies are the packages that a package depends on. We get these from a repository's package.json file.";
  };
  CREATE TYPE default::DevDependency EXTENDING default::Dependency {
      ALTER PROPERTY dependency_type {
          SET OWNED;
          SET TYPE default::DependencyType;
          CREATE REWRITE
              INSERT 
              USING (default::DependencyType.Dev);
      };
  };
  ALTER TYPE default::PackageJson {
      DROP INDEX ON (.repository_id);
      EXTENDING default::RepositoryID LAST;
      ALTER LINK dev_dependencies {
          RESET OPTIONALITY;
          SET TYPE (default::Dependency | default::DevDependency);
      };
  };
  CREATE TYPE default::ProdDependency EXTENDING default::Dependency {
      ALTER PROPERTY dependency_type {
          SET OWNED;
          SET TYPE default::DependencyType;
          CREATE REWRITE
              INSERT 
              USING (default::DependencyType.Prod);
      };
  };
  ALTER TYPE default::PackageJson {
      ALTER LINK dependencies {
          RESET OPTIONALITY;
          SET TYPE (default::ProdDependency | default::Dependency);
      };
      ALTER PROPERTY repository_id {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
  ALTER TYPE default::Repository {
      DROP INDEX ON (.repository_id);
      EXTENDING default::RepositoryID LAST;
      ALTER PROPERTY repository_id {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
  ALTER TYPE default::RepositoryID {
      CREATE INDEX ON (.repository_id);
  };
  ALTER TYPE default::Dependency {
      ALTER INDEX ON (.repository_id) DROP OWNED;
      CREATE INDEX ON (.dependency_type);
      ALTER PROPERTY repository_id {
          DROP OWNED;
          RESET TYPE;
      };
  };
  ALTER TYPE default::PackageJson {
      CREATE INDEX ON (.name);
  };
  ALTER TYPE default::Repository {
      CREATE INDEX ON (.name);
      CREATE INDEX ON (.owner);
      CREATE INDEX ON (.license);
      CREATE INDEX ON (.full_name);
      ALTER PROPERTY archive_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY assignees_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY blobs_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY branches_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY clone_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY collaborators_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY comments_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY commits_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY compare_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY git_commits_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY git_refs_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY git_tags_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY git_url {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Repository {
      ALTER PROPERTY merges_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY milestones_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY mirror_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY pulls_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY releases_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY stargazers_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY statuses_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY subscribers_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY subscription_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY svn_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY tags_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY teams_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY trees_url {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::User {
      CREATE INDEX ON (.login);
      CREATE INDEX ON (.user_id);
      ALTER PROPERTY email {
          SET REQUIRED USING (<std::str>{'testemail@aol.com'});
      };
      ALTER PROPERTY events_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY followers_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY following_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY gists_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY gravatar_id {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY html_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY name {
          SET REQUIRED USING (<std::str>{'hello name'});
      };
      ALTER PROPERTY node_id {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY organizations_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY received_events_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY repos_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY starred_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY subscriptions_url {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY url {
          RESET OPTIONALITY;
      };
  };
};
