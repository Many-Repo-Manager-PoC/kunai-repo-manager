export const parseRepositoryFullName = (
  fullName: string,
): { owner: string; name: string } => {
  const [owner, name] = fullName.split("/");
  return { owner, name };
};
