import { useSignal, useTask$ } from "@qwik.dev/core";
import {
  getRepoByName,
  getRepositories,
  getRepositoriesForAllTopics,
  getTemplateRepositories,
} from "~/actions/repository";

export const useGetRepositories = () => {
  const signal = useSignal<Awaited<ReturnType<typeof getRepositories>>>([]);
  useTask$(async () => {
    const result = await getRepositories();
    signal.value = result;
  });
  return signal;
};

export const useGetRepositoriesForAllTopics = () => {
  const signal = useSignal<
    Awaited<ReturnType<typeof getRepositoriesForAllTopics>>
  >([]);
  useTask$(async () => {
    const result = await getRepositoriesForAllTopics();
    signal.value = result;
  });
  return signal;
};

export const useGetRepoByName = (repoName: string) => {
  const signal = useSignal<Awaited<ReturnType<typeof getRepoByName>>>(null);
  useTask$(async () => {
    const result = await getRepoByName(repoName);
    signal.value = result;
  });
  return signal;
};

export const useGetTemplateRepositories = () => {
  const signal =
    useSignal<Awaited<ReturnType<typeof getTemplateRepositories>>>();
  useTask$(async () => {
    const result = await getTemplateRepositories();
    signal.value = result;
  });
  return signal;
};
