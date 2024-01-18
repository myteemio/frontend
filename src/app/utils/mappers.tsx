export function calenderWeekDayMapper(day: string) {
  switch (day) {
    case 'Mon':
      return 'man.';
    case 'Tue':
      return 'tir.';
    case 'Wed':
      return 'ons.';
    case 'Thu':
      return 'tor.';
    case 'Fri':
      return 'fre.';
    case 'Sat':
      return 'lør.';
    case 'Sun':
      return 'søn.';
    default:
      return '';
  }
}

export function calenderMonthMapper(month: string) {
    switch (month) {
        case 'Jan':
            return 'JAN.';
        case 'Feb':
            return 'FEB.';
        case 'Mar':
            return 'MAR.';
        case 'Apr':
            return 'APR.';
        case 'May':
            return 'MAJ.';
        case 'Jun':
            return 'JUN.';
        case 'Jul':
            return 'JUL.';
        case 'Aug':
            return 'AUG.';
        case 'Sep':
            return 'SEP.';
        case 'Oct':
            return 'OKT.';
        case 'Nov':
            return 'NOV.';
        case 'Dec':
            return 'DEC.';
    }
}