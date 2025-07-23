CREATE MIGRATION m1oopizvdh5qv2u6w7qncu4aoqktqnbtcnkbrbb6l4xm7cxyal2qia
    ONTO m1eucqyfeadpsnsizlcm327fs6acwe6w3macnjwfbjtqd7bit3ik3q
{
  ALTER TYPE default::Permissions {
      CREATE LINK user: default::User;
  };
};
