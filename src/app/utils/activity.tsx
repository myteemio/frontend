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
    if (activity.price && !activityPrices.includes(activity.price)) {
      activityPrices.push(activity.price);
    }
  });
  return { cities, activityNames, activityPrices };
}

export function filterActivitiesByCity(activities: IActivity[], cities: string[]) {
  return activities.filter((activity) =>
    cities.length > 0 ? cities.includes(activity.address.city) : true
  );
}

export function filterActivitiesByName(activities: IActivity[], search: string) {
  return activities.filter((activity) =>
    search === '' ? activities : activity.name.toLowerCase().includes(search.toLowerCase())
  );
}

export function filterActivitiesByPrice(
  activities: IActivity[],
  activityPricesRange: number[],
  activityPriceMinMax: number[]
) {
  return activities.filter((activity) =>
    activityPricesRange.length === 0
      ? activity.price >= activityPriceMinMax[0] && activity.price <= activityPriceMinMax[1]
      : activity.price >= activityPricesRange[0] && activity.price <= activityPricesRange[1]
  );
}
