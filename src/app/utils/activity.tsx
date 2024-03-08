import { IActivity } from '@/lib/useActivity';

export function getActivitySearchOptions(activities: IActivity[]) {
  let cities: string[] = [];
  let activityNames: string[] = [];
  let activityPrices: number[] = [];

  activities.forEach((activity) => {
    if (activity.address.city && !cities.includes(activity.address.city)) {
      cities.push(activity.address.city);
    }
    if (activity.name && !activityNames.includes(activity.name)) {
      activityNames.push(activity.name);
    }
    if(activity.price && !activityPrices.includes(activity.price)){
      activityPrices.push(activity.price);
    }

  });
  return { cities, activityNames, activityPrices };
}
