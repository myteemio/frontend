import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type IActivity = {
    id: string;
    url: string;
    name: string;
    description: string;
    image: string;
    price: number;
    persons: number;
    estimatedHours: number;
    category: string[];
    referralLink: string;
    address: {
      address1: string;
      zipcode: string;
      city: string;
      country: string;
    };
    location: {
      lat: number;
      long: number;
    };
};

export const useActivities = () => {
  const { data, error, isLoading } = useSWR<{activities: IActivity[]}>(`${apiUrl}/activities`, fetcher);
  return {
    activities: data,
    isLoading: isLoading,
    isError: error,
  };
};

export const useActivity = (activityUrl: string) => {
  const { data, error, isLoading } = useSWR<IActivity>(
    `${apiUrl}/activities/${activityUrl}`,
    fetcher
  );
  return {
    activity: data,
    isLoading: isLoading,
    isError: error,
  };
};
