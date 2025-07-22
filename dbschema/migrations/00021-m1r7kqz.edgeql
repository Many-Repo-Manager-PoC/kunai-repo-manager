CREATE MIGRATION m1r7kqzybbcybnnfpkyupk3jbebd5mfrgazklwh2pbvyd3oda2cu5q
    ONTO m1g3nilzd6chcvp65b2cr3j2voorgc6at3owhftde2m6xrvmu34s7q
{
  CREATE SCALAR TYPE default::Visibility EXTENDING enum<public, private>;
  CREATE TYPE default::CodeOfConduct EXTENDING default::Timestamped {
      CREATE PROPERTY node_id: std::str;
      CREATE CONSTRAINT std::exclusive ON (.node_id);
      CREATE REQUIRED LINK repository: default::Repository;
      CREATE PROPERTY key: std::str;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY spdx_id: std::str;
      CREATE PROPERTY url: std::str;
  };
  ALTER TYPE default::Repository {
      CREATE LINK code_of_conduct: default::CodeOfConduct;
  };
  ALTER TYPE default::License {
      ALTER PROPERTY spdx_id {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY url {
          RESET OPTIONALITY;
      };
  };
  CREATE TYPE default::Organization EXTENDING default::Timestamped {
      CREATE REQUIRED PROPERTY login: std::str;
      CREATE CONSTRAINT std::exclusive ON (.login);
      CREATE PROPERTY organization_id: std::int64;
      CREATE CONSTRAINT std::exclusive ON (.organization_id);
      CREATE INDEX ON (.login);
      CREATE INDEX ON (.organization_id);
      CREATE REQUIRED PROPERTY avatar_url: std::str;
      CREATE PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY events_url: std::str;
      CREATE REQUIRED PROPERTY followers_url: std::str;
      CREATE REQUIRED PROPERTY following_url: std::str;
      CREATE REQUIRED PROPERTY gists_url: std::str;
      CREATE REQUIRED PROPERTY gravatar_id: std::str;
      CREATE REQUIRED PROPERTY html_url: std::str;
      CREATE PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY node_id: std::str;
      CREATE REQUIRED PROPERTY organizations_url: std::str;
      CREATE REQUIRED PROPERTY received_events_url: std::str;
      CREATE REQUIRED PROPERTY repos_url: std::str;
      CREATE REQUIRED PROPERTY role_type: std::str;
      CREATE REQUIRED PROPERTY site_admin: std::bool;
      CREATE PROPERTY starred_at: std::str;
      CREATE REQUIRED PROPERTY starred_url: std::str;
      CREATE REQUIRED PROPERTY subscriptions_url: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
      CREATE PROPERTY user_view_type: std::str;
  };
  ALTER TYPE default::Repository {
      CREATE LINK organization: default::Organization;
  };
  ALTER TYPE default::Permissions {
      ALTER LINK user {
          ON SOURCE DELETE DELETE TARGET;
      };
      CREATE CONSTRAINT std::exclusive ON (.user);
      CREATE LINK repository: default::Repository {
          ON SOURCE DELETE DELETE TARGET;
      };
      CREATE CONSTRAINT std::exclusive ON (.repository);
  };
  ALTER TYPE default::Repository {
      DROP LINK permissions;
  };
  CREATE TYPE default::SecurityAndAnalysis EXTENDING default::Timestamped {
      CREATE REQUIRED LINK repository: default::Repository;
      CREATE CONSTRAINT std::exclusive ON (.repository);
      CREATE PROPERTY advanced_security_status: std::str;
      CREATE PROPERTY code_security_status: std::str;
      CREATE PROPERTY dependabot_security_updates_status: std::str;
      CREATE PROPERTY secret_scanning_ai_detection_status: std::str;
      CREATE PROPERTY secret_scanning_non_provider_patterns_status: std::str;
      CREATE PROPERTY secret_scanning_push_protection_status: std::str;
      CREATE PROPERTY secret_scanning_status: std::str;
  };
  ALTER TYPE default::Repository {
      CREATE LINK security_and_analysis: default::SecurityAndAnalysis;
  };
  ALTER TYPE default::Repository {
      CREATE LINK user: default::User;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY anonymous_access_enabled: std::bool;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY auto_init: std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY custom_properties: std::json;
      ALTER PROPERTY description {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY has_downloads {
          SET default := true;
      };
      ALTER PROPERTY has_issues {
          SET default := true;
          RESET OPTIONALITY;
      };
      ALTER PROPERTY has_projects {
          SET default := true;
          RESET OPTIONALITY;
      };
      ALTER PROPERTY has_wiki {
          SET default := true;
          RESET OPTIONALITY;
      };
      ALTER PROPERTY homepage {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY is_template {
          SET default := false;
      };
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY merge_commit_message: std::str;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY merge_commit_title: std::str;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY network_count: std::int64;
      ALTER PROPERTY private {
          SET default := false;
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY squash_merge_commit_message: std::str;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY squash_merge_commit_title: std::str;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY subscribers_count: std::int64;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY team_id: std::int64;
  };
  ALTER TYPE default::Repository {
      CREATE PROPERTY temp_clone_token: std::str;
      ALTER PROPERTY visibility {
          SET TYPE default::Visibility;
      };
  };
};
