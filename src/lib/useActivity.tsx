import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useActivities = () => {
  const { data, error, isLoading } = useSWR(`${apiUrl}/activities`, fetcher);
  return {
    activities: data,
    isLoading: isLoading,
    isError: error,
  };
};

export const useActivity = (activityUrl: string) => {
  const { data, error, isLoading } = useSWR(`${apiUrl}/activities/${activityUrl}`, fetcher);
  return {
    activity: data,
    isLoading: isLoading,
    isError: error,
  };
};
