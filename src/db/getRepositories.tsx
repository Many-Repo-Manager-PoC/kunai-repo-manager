import { routeLoader$ } from "@builder.io/qwik-city";
import metadata from "./metadata.json";
import type { Octokit } from "octokit";
import { OCTOKIT_CLIENT } from "../routes/plugin@octokit";

// gets all repos from the given owner and given list of repos in metadata.json
// eslint-disable-next-line qwik/loader-location
export const useGetRepos = routeLoader$(async (event) => {
  try {
    const octokit: Octokit = event.sharedMap.get(OCTOKIT_CLIENT);
    console.log(octokit);
    
    // Set initial state in shared map
    event.sharedMap.set('repos', metadata.repositories);
    
    const repositories = await Promise.all(
      metadata.repositories.map(async (repoName) => {
        const { data } = await octokit.rest.repos.get({
          owner: metadata.owner,
          repo: repoName
        });
        return data;
      })
    );
    return repositories;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
});