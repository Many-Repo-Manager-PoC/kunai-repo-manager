CREATE MIGRATION m1eucqyfeadpsnsizlcm327fs6acwe6w3macnjwfbjtqd7bit3ik3q
    ONTO m17znndgw6x2vejbsaa3oy4i3rgivepuqlwdtd322ko2n3xtz6aniq
{
  ALTER TYPE default::Repository {
      CREATE CONSTRAINT std::exclusive ON (.name);
  };
};
