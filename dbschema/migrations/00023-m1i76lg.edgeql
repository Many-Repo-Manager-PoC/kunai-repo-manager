CREATE MIGRATION m1i76lgfs4m5idozdrgqmngq76fpryp6ip5vi2tjusej3yut33csgq
    ONTO m1wlj3gzvs2u3vfhtgncv2mdec4jzptttizjsrtkgfgai5ycwokjya
{
  ALTER TYPE default::Repository {
      DROP PROPERTY custom_properties;
  };
};
