import { HighlightedDay } from "@/components/DatePicker/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export function findInsertIndex(dates: HighlightedDay[], newDate: Dayjs) {
    let low = 0;
    let high = dates.length;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const midDate = dayjs((dates[mid].formattedDate));
      if (midDate.isBefore(newDate)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }