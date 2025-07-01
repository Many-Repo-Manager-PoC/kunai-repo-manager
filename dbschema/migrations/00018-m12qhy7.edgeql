CREATE MIGRATION m12qhy7yc2rmsoyeavj5grjpgrdoeh374ujjqotskczmzw2dc4s6oa
    ONTO m1oopizvdh5qv2u6w7qncu4aoqktqnbtcnkbrbb6l4xm7cxyal2qia
{
  ALTER TYPE default::Repository {
      ALTER LINK license {
          RESET OPTIONALITY;
      };
  };
};
