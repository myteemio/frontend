import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const tempURL = 'http://localhost:3001';

export const useActivities = () => {
  const { data, error, isLoading } = useSWR(`${tempURL}/api/activities`, fetcher);
  return {
    activities: data,
    isLoading: isLoading,
    isError: error,
  };
};

export const useActivity = (activityUrl: string) => {
  const { data, error, isLoading } = useSWR(`${tempURL}/api/activities/${activityUrl}`, fetcher);
  return {
    activity: data,
    isLoading: isLoading,
    isError: error,
  };
}
