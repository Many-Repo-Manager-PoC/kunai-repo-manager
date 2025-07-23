CREATE MIGRATION m1wlj3gzvs2u3vfhtgncv2mdec4jzptttizjsrtkgfgai5ycwokjya
    ONTO m1r7kqzybbcybnnfpkyupk3jbebd5mfrgazklwh2pbvyd3oda2cu5q
{
  ALTER TYPE default::Dependency {
      ALTER LINK package_json {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
