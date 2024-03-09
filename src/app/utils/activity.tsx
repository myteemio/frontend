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
    if (activity.price >= 0 && !activityPrices.includes(activity.price)) {
      activityPrices.push(activity.price);
    }
  });
  return { cities, activityNames, activityPrices };
}

export function filterActivityByCity(activity: IActivity, cities: string[]) {
  return cities.length > 0 ? cities.includes(activity.address.city) : true;
}

export function filterActivityByName(activity: IActivity, search: string) {
  return search === '' ? activity : activity.name.toLowerCase().includes(search.toLowerCase());
}

export function filterActivityByPrice(activity: IActivity, activityPricesRange: number[], activityPriceMinMax: number[]) {
  return activityPricesRange.length === 0
    ? activity.price >= activityPriceMinMax[0] && activity.price <= activityPriceMinMax[1]
    : activity.price >= activityPricesRange[0] && activity.price <= activityPricesRange[1];
}
