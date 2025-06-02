// TODO: Can be extended to include more error codes
export type ErrorName =
  | "UNAUTHORIZED"
  | "GET_REPOSITORIES_ERROR"
  | "CREATE_WORKFLOW_DISPATCH_EVENT_ERROR"
  | "OCTOKIT_CLIENT_ERROR";

export type ErrorContext = {
  name: ErrorName;
  message: string;
};

export class ApplicationError extends Error {
  name: ErrorName;
  message: string;

  constructor(context: ErrorContext) {
    super(context.message);
    this.name = context.name;
    this.message = context.message;
  }
}
