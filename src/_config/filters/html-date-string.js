import { DateTime } from "luxon";

export function htmlDateString(dateObj) {
  // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
}
