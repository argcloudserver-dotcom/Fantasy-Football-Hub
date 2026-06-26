export interface HistoricalTeam {
  id: string;
  name: string;
  nameAr: string;
  nationality: string;
  year: number;
  flag: string;
  rating: number;
}

export const HISTORICAL_TEAMS: HistoricalTeam[] = [
  { id: 'bra1970', name: 'Brazil 1970', nameAr: 'البرازيل 1970', nationality: 'Brazil', year: 1970, flag: '🇧🇷', rating: 96 },
  { id: 'bra2002', name: 'Brazil 2002', nameAr: 'البرازيل 2002', nationality: 'Brazil', year: 2002, flag: '🇧🇷', rating: 93 },
  { id: 'arg1986', name: 'Argentina 1986', nameAr: 'الأرجنتين 1986', nationality: 'Argentina', year: 1986, flag: '🇦🇷', rating: 94 },
  { id: 'arg2022', name: 'Argentina 2022', nameAr: 'الأرجنتين 2022', nationality: 'Argentina', year: 2022, flag: '🇦🇷', rating: 92 },
  { id: 'fra1998', name: 'France 1998', nameAr: 'فرنسا 1998', nationality: 'France', year: 1998, flag: '🇫🇷', rating: 92 },
  { id: 'fra2018', name: 'France 2018', nameAr: 'فرنسا 2018', nationality: 'France', year: 2018, flag: '🇫🇷', rating: 92 },
  { id: 'ger2014', name: 'Germany 2014', nameAr: 'ألمانيا 2014', nationality: 'Germany', year: 2014, flag: '🇩🇪', rating: 93 },
  { id: 'wger1974', name: 'W. Germany 1974', nameAr: 'ألمانيا الغربية 1974', nationality: 'West Germany', year: 1974, flag: '🇩🇪', rating: 91 },
  { id: 'spa2010', name: 'Spain 2010', nameAr: 'إسبانيا 2010', nationality: 'Spain', year: 2010, flag: '🇪🇸', rating: 93 },
  { id: 'ita1982', name: 'Italy 1982', nameAr: 'إيطاليا 1982', nationality: 'Italy', year: 1982, flag: '🇮🇹', rating: 90 },
  { id: 'ita2006', name: 'Italy 2006', nameAr: 'إيطاليا 2006', nationality: 'Italy', year: 2006, flag: '🇮🇹', rating: 88 },
  { id: 'ned1974', name: 'Netherlands 1974', nameAr: 'هولندا 1974', nationality: 'Netherlands', year: 1974, flag: '🇳🇱', rating: 92 },
  { id: 'eng1966', name: 'England 1966', nameAr: 'إنجلترا 1966', nationality: 'England', year: 1966, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 87 },
  { id: 'uru1950', name: 'Uruguay 1950', nameAr: 'أوروغواي 1950', nationality: 'Uruguay', year: 1950, flag: '🇺🇾', rating: 85 },
  { id: 'por2006', name: 'Portugal 2006', nameAr: 'البرتغال 2006', nationality: 'Portugal', year: 2006, flag: '🇵🇹', rating: 86 },
  { id: 'bel2018', name: 'Belgium 2018', nameAr: 'بلجيكا 2018', nationality: 'Belgium', year: 2018, flag: '🇧🇪', rating: 90 },
  { id: 'cro2018', name: 'Croatia 2018', nameAr: 'كرواتيا 2018', nationality: 'Croatia', year: 2018, flag: '🇭🇷', rating: 87 },
  { id: 'mor2022', name: 'Morocco 2022', nameAr: 'المغرب 2022', nationality: 'Morocco', year: 2022, flag: '🇲🇦', rating: 84 },
  { id: 'hun1954', name: 'Hungary 1954', nameAr: 'المجر 1954', nationality: 'Hungary', year: 1954, flag: '🇭🇺', rating: 88 },
  { id: 'bra1994', name: 'Brazil 1994', nameAr: 'البرازيل 1994', nationality: 'Brazil', year: 1994, flag: '🇧🇷', rating: 90 },
  { id: 'ger1990', name: 'Germany 1990', nameAr: 'ألمانيا 1990', nationality: 'Germany', year: 1990, flag: '🇩🇪', rating: 89 },
  { id: 'bra1958', name: 'Brazil 1958', nameAr: 'البرازيل 1958', nationality: 'Brazil', year: 1958, flag: '🇧🇷', rating: 93 },
  { id: 'uru2010', name: 'Uruguay 2010', nameAr: 'أوروغواي 2010', nationality: 'Uruguay', year: 2010, flag: '🇺🇾', rating: 84 },
  { id: 'mex1986', name: 'Mexico 1986', nameAr: 'المكسيك 1986', nationality: 'Mexico', year: 1986, flag: '🇲🇽', rating: 80 },
  { id: 'jpn2002', name: 'Japan 2002', nameAr: 'اليابان 2002', nationality: 'Japan', year: 2002, flag: '🇯🇵', rating: 78 },
  { id: 'sen2002', name: 'Senegal 2002', nameAr: 'السنغال 2002', nationality: 'Senegal', year: 2002, flag: '🇸🇳', rating: 80 },
];

export function getRandomHistoricalTeams(count: number, exclude: string[] = []): HistoricalTeam[] {
  const available = HISTORICAL_TEAMS.filter(t => !exclude.includes(t.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
