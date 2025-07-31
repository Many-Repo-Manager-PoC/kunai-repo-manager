export class Routes {
  public static readonly root = () => `/`;
  public static readonly createRepos = () => `/createRepositories/`;
  public static readonly allRepos = () => `/allRepositories/`;
  public static readonly repoDetails = (
    repoOwner?: string | null,
    repoName?: string | null,
  ) => `${this.allRepos()}${repoOwner}/${repoName}/`;
  public static readonly componentCopy = (
    repoOwner?: string | null,
    repoName?: string | null,
  ) => `${this.repoDetails(repoOwner, repoName)}componentCopy/`;
  public static readonly dashboard = () => `/dashboard/`;
  public static readonly designSystemSync = () => `/designSystemSync/`;
}
