export type PlayerPosition = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
export type PositionType = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  nameAr: string;
  nationality: string;
  nationalityAr: string;
  year: number;
  position: PlayerPosition;
  positionType: PositionType;
  rating: number;
  flag: string;
}

export function getPositionType(pos: PlayerPosition): PositionType {
  if (pos === 'GK') return 'GK';
  if (pos === 'CB' || pos === 'LB' || pos === 'RB') return 'DEF';
  if (pos === 'CDM' || pos === 'CM' || pos === 'CAM') return 'MID';
  return 'FWD';
}

const rawPlayers: Omit<Player, 'id' | 'positionType'>[] = [
  // =================== GK ===================
  { name: 'Lev Yashin', nameAr: 'ليف ياشين', nationality: 'USSR', nationalityAr: 'الاتحاد السوفيتي', year: 1966, position: 'GK', rating: 98, flag: '🇷🇺' },
  { name: 'Gordon Banks', nameAr: 'غوردون بانكس', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'GK', rating: 95, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Dino Zoff', nameAr: 'دينو زوف', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 1982, position: 'GK', rating: 94, flag: '🇮🇹' },
  { name: 'Peter Shilton', nameAr: 'بيتر شيلتون', nationality: 'England', nationalityAr: 'إنجلترا', year: 1986, position: 'GK', rating: 91, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Sepp Maier', nameAr: 'سيب ماير', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'GK', rating: 93, flag: '🇩🇪' },
  { name: 'Peter Schmeichel', nameAr: 'بيتر شمايخل', nationality: 'Denmark', nationalityAr: 'الدنمارك', year: 1998, position: 'GK', rating: 90, flag: '🇩🇰' },
  { name: 'Oliver Kahn', nameAr: 'أوليفر كان', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2002, position: 'GK', rating: 93, flag: '🇩🇪' },
  { name: 'Gianluigi Buffon', nameAr: 'جانلويجي بوفون', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'GK', rating: 94, flag: '🇮🇹' },
  { name: 'Iker Casillas', nameAr: 'إيكر كاسياس', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'GK', rating: 93, flag: '🇪🇸' },
  { name: 'Manuel Neuer', nameAr: 'مانويل نوير', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'GK', rating: 93, flag: '🇩🇪' },
  { name: 'Hugo Lloris', nameAr: 'هوغو يوريس', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'GK', rating: 89, flag: '🇫🇷' },
  { name: 'Emiliano Martinez', nameAr: 'إيميليانو مارتينيز', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'GK', rating: 91, flag: '🇦🇷' },
  { name: 'Ubaldo Fillol', nameAr: 'أوبالدو فييول', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1978, position: 'GK', rating: 86, flag: '🇦🇷' },
  { name: 'Thibaut Courtois', nameAr: 'تيبو كورتوا', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'GK', rating: 90, flag: '🇧🇪' },
  { name: 'Alisson Becker', nameAr: 'أليسون بيكر', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'GK', rating: 91, flag: '🇧🇷' },
  { name: 'Claudio Taffarel', nameAr: 'كلاوديو تافاريل', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1994, position: 'GK', rating: 86, flag: '🇧🇷' },
  { name: 'Antonio Carbajal', nameAr: 'أنطونيو كارباخال', nationality: 'Mexico', nationalityAr: 'المكسيك', year: 1954, position: 'GK', rating: 82, flag: '🇲🇽' },

  // =================== DEF ===================
  { name: 'Franz Beckenbauer', nameAr: 'فرانز بيكنباور', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'CB', rating: 97, flag: '🇩🇪' },
  { name: 'Bobby Moore', nameAr: 'بوبي مور', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'CB', rating: 95, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Paolo Maldini', nameAr: 'باولو مالديني', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 1994, position: 'CB', rating: 96, flag: '🇮🇹' },
  { name: 'Daniel Passarella', nameAr: 'دانييل باساريلا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1978, position: 'CB', rating: 90, flag: '🇦🇷' },
  { name: 'Gaetano Scirea', nameAr: 'غاييتانو سكيريا', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 1982, position: 'CB', rating: 89, flag: '🇮🇹' },
  { name: 'Carlos Alberto', nameAr: 'كارلوس ألبيرتو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'RB', rating: 93, flag: '🇧🇷' },
  { name: 'Nilton Santos', nameAr: 'نيلتون سانتوس', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1958, position: 'LB', rating: 90, flag: '🇧🇷' },
  { name: 'Cafu', nameAr: 'كافو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'RB', rating: 93, flag: '🇧🇷' },
  { name: 'Roberto Carlos', nameAr: 'روبيرتو كارلوس', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'LB', rating: 93, flag: '🇧🇷' },
  { name: 'Fabio Cannavaro', nameAr: 'فابيو كانافارو', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CB', rating: 92, flag: '🇮🇹' },
  { name: 'Sergio Ramos', nameAr: 'سيرخيو راموس', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'CB', rating: 90, flag: '🇪🇸' },
  { name: 'Carles Puyol', nameAr: 'كارليس بويول', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'CB', rating: 89, flag: '🇪🇸' },
  { name: 'Philipp Lahm', nameAr: 'فيليب لام', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'RB', rating: 90, flag: '🇩🇪' },
  { name: 'Jerome Boateng', nameAr: 'جيروم بواتينغ', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CB', rating: 88, flag: '🇩🇪' },
  { name: 'Mats Hummels', nameAr: 'ماتس هوملز', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CB', rating: 89, flag: '🇩🇪' },
  { name: 'Raphael Varane', nameAr: 'رافاييل فاران', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'CB', rating: 89, flag: '🇫🇷' },
  { name: 'Benjamin Pavard', nameAr: 'بنجامين بافار', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'RB', rating: 84, flag: '🇫🇷' },
  { name: 'Theo Hernandez', nameAr: 'تيو هيرنانديز', nationality: 'France', nationalityAr: 'فرنسا', year: 2022, position: 'LB', rating: 87, flag: '🇫🇷' },
  { name: 'Virgil van Dijk', nameAr: 'فيرخيل فان دايك', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 2022, position: 'CB', rating: 90, flag: '🇳🇱' },
  { name: 'Achraf Hakimi', nameAr: 'أشرف حكيمي', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'RB', rating: 87, flag: '🇲🇦' },
  { name: 'Ruben Dias', nameAr: 'روبن دياز', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'CB', rating: 89, flag: '🇵🇹' },
  { name: 'Joao Cancelo', nameAr: 'جواو كانسيلو', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'RB', rating: 87, flag: '🇵🇹' },
  { name: 'Marcelo', nameAr: 'مارسيلو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'LB', rating: 88, flag: '🇧🇷' },
  { name: 'Dani Alves', nameAr: 'داني ألفيس', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'RB', rating: 88, flag: '🇧🇷' },
  { name: 'Lucio', nameAr: 'لوسيو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CB', rating: 88, flag: '🇧🇷' },
  { name: 'Thiago Silva', nameAr: 'تياغو سيلفا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'CB', rating: 90, flag: '🇧🇷' },
  { name: 'Maicon', nameAr: 'ميكون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2010, position: 'RB', rating: 88, flag: '🇧🇷' },
  { name: 'Jorge Luiz Brito', nameAr: 'لوسيو 94', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1994, position: 'CB', rating: 85, flag: '🇧🇷' },
  { name: 'Berti Vogts', nameAr: 'بيرتي فوغتس', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'RB', rating: 86, flag: '🇩🇪' },
  { name: 'Hans-Georg Schwarzenbeck', nameAr: 'شوارتسنبيك', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'CB', rating: 84, flag: '🇩🇪' },
  { name: 'Vincent Kompany', nameAr: 'فنسان كومباني', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'CB', rating: 88, flag: '🇧🇪' },
  { name: 'Toby Alderweireld', nameAr: 'توبي ألدرويرلد', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'CB', rating: 86, flag: '🇧🇪' },
  { name: 'Ivan Strinic', nameAr: 'إيفان ستريبنيتش', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'LB', rating: 80, flag: '🇭🇷' },
  { name: 'Dejan Lovren', nameAr: 'ديان لوفرن', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'CB', rating: 82, flag: '🇭🇷' },
  { name: 'Jordi Alba', nameAr: 'خوردي ألبا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'LB', rating: 87, flag: '🇪🇸' },
  { name: 'Giorgio Chiellini', nameAr: 'جيورجيو كييليني', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CB', rating: 89, flag: '🇮🇹' },
  { name: 'Alessandro Nesta', nameAr: 'أليساندرو نيستا', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CB', rating: 88, flag: '🇮🇹' },
  { name: 'Danielle De Rossi', nameAr: 'دانييلي دي روسي', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CB', rating: 84, flag: '🇮🇹' },
  { name: 'Pepe', nameAr: 'بيبي', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2014, position: 'CB', rating: 85, flag: '🇵🇹' },
  { name: 'Naldo', nameAr: 'نالدو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CB', rating: 82, flag: '🇧🇷' },
  { name: 'Manuel Amoros', nameAr: 'مانويل أموروس', nationality: 'France', nationalityAr: 'فرنسا', year: 1982, position: 'RB', rating: 81, flag: '🇫🇷' },
  { name: 'Marius Tresor', nameAr: 'ماريوس تريسور', nationality: 'France', nationalityAr: 'فرنسا', year: 1982, position: 'CB', rating: 83, flag: '🇫🇷' },
  { name: 'Sofyan Amrabat', nameAr: 'صفيان أمرابط', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CDM', rating: 83, flag: '🇲🇦' },
  { name: 'Nayef Aguerd', nameAr: 'نايف أكرد', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CB', rating: 82, flag: '🇲🇦' },
  { name: 'Romain Saiss', nameAr: 'رومان سايس', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CB', rating: 82, flag: '🇲🇦' },
  { name: 'Oscar Ruggeri', nameAr: 'أوسكار روغيري', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CB', rating: 85, flag: '🇦🇷' },
  { name: 'Jose Luis Brown', nameAr: 'خوسيه لويس براون', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CB', rating: 82, flag: '🇦🇷' },
  { name: 'Sergio Batista', nameAr: 'سيرخيو باتيستا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CB', rating: 80, flag: '🇦🇷' },
  { name: 'Nicolas Otamendi', nameAr: 'نيكولاس أوتامندي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CB', rating: 85, flag: '🇦🇷' },
  { name: 'Lisandro Martinez', nameAr: 'ليساندرو مارتينيز', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CB', rating: 85, flag: '🇦🇷' },
  { name: 'Son Heung-min', nameAr: 'سون هيونغ مين', nationality: 'South Korea', nationalityAr: 'كوريا الجنوبية', year: 2022, position: 'LW', rating: 88, flag: '🇰🇷' },
  { name: 'Kim Min-jae', nameAr: 'كيم مين جاي', nationality: 'South Korea', nationalityAr: 'كوريا الجنوبية', year: 2022, position: 'CB', rating: 84, flag: '🇰🇷' },

  // =================== MID ===================
  { name: 'Zinedine Zidane', nameAr: 'زين الدين زيدان', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'CAM', rating: 97, flag: '🇫🇷' },
  { name: 'Johan Cruyff', nameAr: 'يوهان كرويف', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'CAM', rating: 98, flag: '🇳🇱' },
  { name: 'Diego Maradona', nameAr: 'دييغو مارادونا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CAM', rating: 99, flag: '🇦🇷' },
  { name: 'Michel Platini', nameAr: 'ميشيل بلاتيني', nationality: 'France', nationalityAr: 'فرنسا', year: 1982, position: 'CAM', rating: 93, flag: '🇫🇷' },
  { name: 'Lothar Matthaus', nameAr: 'لوثار ماتيوس', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1990, position: 'CM', rating: 93, flag: '🇩🇪' },
  { name: 'Ronaldinho', nameAr: 'رونالدينيو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CAM', rating: 93, flag: '🇧🇷' },
  { name: 'Xavi Hernandez', nameAr: 'تشافي هيرنانديز', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'CM', rating: 92, flag: '🇪🇸' },
  { name: 'Andres Iniesta', nameAr: 'أندريس إينيستا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'CM', rating: 93, flag: '🇪🇸' },
  { name: 'Sergio Busquets', nameAr: 'سيرخيو بوسكيتس', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'CDM', rating: 90, flag: '🇪🇸' },
  { name: 'Luka Modric', nameAr: 'لوكا مودريتش', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'CM', rating: 92, flag: '🇭🇷' },
  { name: 'Ivan Rakitic', nameAr: 'إيفان راكيتيتش', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'CM', rating: 87, flag: '🇭🇷' },
  { name: 'Marcelo Brozovic', nameAr: 'مارسيلو بروزوفيتش', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'CDM', rating: 85, flag: '🇭🇷' },
  { name: 'Kevin De Bruyne', nameAr: 'كيفن دي بروين', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2022, position: 'CAM', rating: 92, flag: '🇧🇪' },
  { name: 'Eden Hazard', nameAr: 'إيدن هازار', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'CM', rating: 89, flag: '🇧🇪' },
  { name: 'Axel Witsel', nameAr: 'أكسيل ويتسيل', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'CDM', rating: 84, flag: '🇧🇪' },
  { name: 'Paul Pogba', nameAr: 'بول بوغبا', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'CM', rating: 86, flag: '🇫🇷' },
  { name: 'N Golo Kante', nameAr: 'نغولو كانتي', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'CDM', rating: 90, flag: '🇫🇷' },
  { name: 'Blaise Matuidi', nameAr: 'بليز ماتويدي', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'CM', rating: 83, flag: '🇫🇷' },
  { name: 'Antoine Griezmann', nameAr: 'أنطوان غريزمان', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'CAM', rating: 89, flag: '🇫🇷' },
  { name: 'Mesut Ozil', nameAr: 'ميسوت أوزيل', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CAM', rating: 88, flag: '🇩🇪' },
  { name: 'Toni Kroos', nameAr: 'توني كروس', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CM', rating: 91, flag: '🇩🇪' },
  { name: 'Thomas Muller', nameAr: 'توماس مولر', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CAM', rating: 89, flag: '🇩🇪' },
  { name: 'Andrea Pirlo', nameAr: 'أندريا بيرلو', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CDM', rating: 92, flag: '🇮🇹' },
  { name: 'Gennaro Gattuso', nameAr: 'جيناريو جاتوسو', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CDM', rating: 83, flag: '🇮🇹' },
  { name: 'Francesco Totti', nameAr: 'فرانشيسكو توتي', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CAM', rating: 88, flag: '🇮🇹' },
  { name: 'Rivelino', nameAr: 'ريفيلينو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'CM', rating: 89, flag: '🇧🇷' },
  { name: 'Gerson', nameAr: 'جيرسون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'CM', rating: 87, flag: '🇧🇷' },
  { name: 'Clodoaldo', nameAr: 'كلودالدو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'CDM', rating: 85, flag: '🇧🇷' },
  { name: 'Falcao', nameAr: 'فالكاو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1982, position: 'CM', rating: 88, flag: '🇧🇷' },
  { name: 'Socrates', nameAr: 'سقراط', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1982, position: 'CAM', rating: 89, flag: '🇧🇷' },
  { name: 'Zico', nameAr: 'زيكو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1982, position: 'CAM', rating: 90, flag: '🇧🇷' },
  { name: 'Neymar Jr', nameAr: 'نيمار جونيور', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'CAM', rating: 92, flag: '🇧🇷' },
  { name: 'Casemiro', nameAr: 'كاسيميرو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'CDM', rating: 89, flag: '🇧🇷' },
  { name: 'Lucas Paqueta', nameAr: 'لوكاس باكيتا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'CAM', rating: 85, flag: '🇧🇷' },
  { name: 'Rivaldo', nameAr: 'ريفالدو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CAM', rating: 90, flag: '🇧🇷' },
  { name: 'Roberto Falcao', nameAr: 'روبيرتو فالكاو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1994, position: 'CM', rating: 83, flag: '🇧🇷' },
  { name: 'Mauro Tassotti', nameAr: 'ماورو تاسوتي', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 1994, position: 'CM', rating: 80, flag: '🇮🇹' },
  { name: 'Jorge Valdano', nameAr: 'خورخي فالدانو', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CAM', rating: 83, flag: '🇦🇷' },
  { name: 'Hector Enrique', nameAr: 'هيكتور انريكي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CM', rating: 80, flag: '🇦🇷' },
  { name: 'Bernardo Silva', nameAr: 'برناردو سيلفا', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'CM', rating: 88, flag: '🇵🇹' },
  { name: 'Bruno Fernandes', nameAr: 'برونو فيرنانديز', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'CAM', rating: 88, flag: '🇵🇹' },
  { name: 'Joao Moutinho', nameAr: 'جواو موتينيو', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2014, position: 'CM', rating: 84, flag: '🇵🇹' },
  { name: 'Gavi', nameAr: 'غافي', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2022, position: 'CM', rating: 86, flag: '🇪🇸' },
  { name: 'Pedri', nameAr: 'بيدري', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2022, position: 'CM', rating: 87, flag: '🇪🇸' },
  { name: 'Jude Bellingham', nameAr: 'جود بيلينغهام', nationality: 'England', nationalityAr: 'إنجلترا', year: 2022, position: 'CM', rating: 88, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Declan Rice', nameAr: 'ديكلان رايس', nationality: 'England', nationalityAr: 'إنجلترا', year: 2022, position: 'CDM', rating: 85, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Yaya Toure', nameAr: 'يايا توري', nationality: 'Ivory Coast', nationalityAr: 'ساحل العاج', year: 2014, position: 'CM', rating: 87, flag: '🇨🇮' },
  { name: 'Claude Makelele', nameAr: 'كلود ماكيليلي', nationality: 'France', nationalityAr: 'فرنسا', year: 2006, position: 'CDM', rating: 87, flag: '🇫🇷' },
  { name: 'Hidetoshi Nakata', nameAr: 'هيدوتوشي ناكاتا', nationality: 'Japan', nationalityAr: 'اليابان', year: 2002, position: 'CM', rating: 82, flag: '🇯🇵' },
  { name: 'Park Ji-sung', nameAr: 'باك جي سونغ', nationality: 'South Korea', nationalityAr: 'كوريا الجنوبية', year: 2010, position: 'CM', rating: 83, flag: '🇰🇷' },
  { name: 'Federico Valverde', nameAr: 'فيديريكو فالفيردي', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 2022, position: 'CM', rating: 88, flag: '🇺🇾' },
  { name: 'Florian Wirtz', nameAr: 'فلوريان ويرتس', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2026, position: 'CAM', rating: 88, flag: '🇩🇪' },
  { name: 'Jamal Musiala', nameAr: 'جمال موسيالا', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2026, position: 'CAM', rating: 88, flag: '🇩🇪' },
  { name: 'Hakim Ziyech', nameAr: 'حكيم زياش', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CAM', rating: 83, flag: '🇲🇦' },
  { name: 'Amine Harit', nameAr: 'أمين حارث', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CAM', rating: 80, flag: '🇲🇦' },

  // =================== FWD ===================
  { name: 'Pelé', nameAr: 'بيليه', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'ST', rating: 99, flag: '🇧🇷' },
  { name: 'Ronaldo Nazário', nameAr: 'رونالدو نازاريو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'ST', rating: 98, flag: '🇧🇷' },
  { name: 'Lionel Messi', nameAr: 'ليونيل ميسي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'RW', rating: 99, flag: '🇦🇷' },
  { name: 'Kylian Mbappe', nameAr: 'كيليان مبابي', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'ST', rating: 95, flag: '🇫🇷' },
  { name: 'Cristiano Ronaldo', nameAr: 'كريستيانو رونالدو', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2006, position: 'ST', rating: 96, flag: '🇵🇹' },
  { name: 'Eusebio', nameAr: 'يوسيبيو', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 1966, position: 'ST', rating: 95, flag: '🇵🇹' },
  { name: 'Marco van Basten', nameAr: 'ماركو فان باستن', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1990, position: 'ST', rating: 94, flag: '🇳🇱' },
  { name: 'Hristo Stoichkov', nameAr: 'هريستو ستويتشكوف', nationality: 'Bulgaria', nationalityAr: 'بلغاريا', year: 1994, position: 'ST', rating: 88, flag: '🇧🇬' },
  { name: 'Romario', nameAr: 'روماريو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1994, position: 'ST', rating: 93, flag: '🇧🇷' },
  { name: 'Bebeto', nameAr: 'بيبيتو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1994, position: 'ST', rating: 88, flag: '🇧🇷' },
  { name: 'Thierry Henry', nameAr: 'تييري هنري', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'ST', rating: 93, flag: '🇫🇷' },
  { name: 'David Trezeguet', nameAr: 'دافيد تريزيغيه', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'ST', rating: 86, flag: '🇫🇷' },
  { name: 'Miroslav Klose', nameAr: 'ميروسلاف كلوزه', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'ST', rating: 89, flag: '🇩🇪' },
  { name: 'David Villa', nameAr: 'دافيد فييا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'ST', rating: 89, flag: '🇪🇸' },
  { name: 'Fernando Torres', nameAr: 'فيرناندو توريس', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'ST', rating: 87, flag: '🇪🇸' },
  { name: 'Pedro', nameAr: 'بيدرو', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'LW', rating: 83, flag: '🇪🇸' },
  { name: 'Jairzinho', nameAr: 'جايرزينيو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'RW', rating: 91, flag: '🇧🇷' },
  { name: 'Tostao', nameAr: 'توستاو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'ST', rating: 90, flag: '🇧🇷' },
  { name: 'Garrincha', nameAr: 'غارينشا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1962, position: 'RW', rating: 95, flag: '🇧🇷' },
  { name: 'Vava', nameAr: 'فافا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1958, position: 'ST', rating: 86, flag: '🇧🇷' },
  { name: 'Kempes', nameAr: 'كمبيس', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1978, position: 'ST', rating: 89, flag: '🇦🇷' },
  { name: 'Leopoldo Luque', nameAr: 'ليوبولدو لوكي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1978, position: 'ST', rating: 82, flag: '🇦🇷' },
  { name: 'Paolo Rossi', nameAr: 'باولو روسي', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 1982, position: 'ST', rating: 89, flag: '🇮🇹' },
  { name: 'Alessandro Del Piero', nameAr: 'أليساندرو ديل بييرو', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'ST', rating: 88, flag: '🇮🇹' },
  { name: 'Luca Toni', nameAr: 'لوكا توني', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'ST', rating: 85, flag: '🇮🇹' },
  { name: 'Gary Lineker', nameAr: 'غاري لينيكر', nationality: 'England', nationalityAr: 'إنجلترا', year: 1986, position: 'ST', rating: 87, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Geoff Hurst', nameAr: 'جيف هيرست', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'ST', rating: 86, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Davor Suker', nameAr: 'دافور سوكر', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 1998, position: 'ST', rating: 85, flag: '🇭🇷' },
  { name: 'Andrej Kramaric', nameAr: 'أندريه كراماريتش', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'ST', rating: 82, flag: '🇭🇷' },
  { name: 'Luis Figo', nameAr: 'لويس فيغو', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2002, position: 'RW', rating: 91, flag: '🇵🇹' },
  { name: 'Diogo Jota', nameAr: 'دييغو خوتا', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'LW', rating: 84, flag: '🇵🇹' },
  { name: 'Cristiano Ronaldo 22', nameAr: 'كريستيانو رونالدو 22', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'ST', rating: 91, flag: '🇵🇹' },
  { name: 'Didier Drogba', nameAr: 'ديدييه دروغبا', nationality: 'Ivory Coast', nationalityAr: 'ساحل العاج', year: 2010, position: 'ST', rating: 88, flag: '🇨🇮' },
  { name: 'Samuel Etoo', nameAr: 'صاموئيل إيتو', nationality: 'Cameroon', nationalityAr: 'الكاميرون', year: 2010, position: 'ST', rating: 88, flag: '🇨🇲' },
  { name: 'Wayne Rooney', nameAr: 'واين روني', nationality: 'England', nationalityAr: 'إنجلترا', year: 2010, position: 'ST', rating: 87, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Arjen Robben', nameAr: 'أرين روبن', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 2014, position: 'RW', rating: 89, flag: '🇳🇱' },
  { name: 'Robin van Persie', nameAr: 'روبن فان بيرسي', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 2014, position: 'ST', rating: 88, flag: '🇳🇱' },
  { name: 'Wesley Sneijder', nameAr: 'ويسلي سنايدر', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 2010, position: 'CAM', rating: 88, flag: '🇳🇱' },
  { name: 'Romelu Lukaku', nameAr: 'روميلو لوكاكو', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'ST', rating: 87, flag: '🇧🇪' },
  { name: 'Dries Mertens', nameAr: 'دريس مارتينز', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'ST', rating: 85, flag: '🇧🇪' },
  { name: 'Vinicius Jr', nameAr: 'فينيسيوس جونيور', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'LW', rating: 90, flag: '🇧🇷' },
  { name: 'Richarlison', nameAr: 'ريتشارليسون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'ST', rating: 85, flag: '🇧🇷' },
  { name: 'Bukayo Saka', nameAr: 'بوكايو ساكا', nationality: 'England', nationalityAr: 'إنجلترا', year: 2022, position: 'RW', rating: 86, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Phil Foden', nameAr: 'فيل فودن', nationality: 'England', nationalityAr: 'إنجلترا', year: 2022, position: 'LW', rating: 87, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Harry Kane', nameAr: 'هاري كين', nationality: 'England', nationalityAr: 'إنجلترا', year: 2022, position: 'ST', rating: 89, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Mohamed Salah', nameAr: 'محمد صلاح', nationality: 'Egypt', nationalityAr: 'مصر', year: 2018, position: 'RW', rating: 88, flag: '🇪🇬' },
  { name: 'Sadio Mane', nameAr: 'ساديو ماني', nationality: 'Senegal', nationalityAr: 'السنغال', year: 2022, position: 'LW', rating: 87, flag: '🇸🇳' },
  { name: 'Luis Suarez', nameAr: 'لويس سواريز', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 2014, position: 'ST', rating: 90, flag: '🇺🇾' },
  { name: 'Edinson Cavani', nameAr: 'إيدينسون كافاني', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 2018, position: 'ST', rating: 86, flag: '🇺🇾' },
  { name: 'Darwin Nunez', nameAr: 'داروين نونييز', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 2022, position: 'ST', rating: 85, flag: '🇺🇾' },
  { name: 'Angel Di Maria', nameAr: 'أنخيل دي ماريا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'RW', rating: 87, flag: '🇦🇷' },
  { name: 'Julian Alvarez', nameAr: 'خوليان ألفاريز', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'ST', rating: 86, flag: '🇦🇷' },
  { name: 'Lautaro Martinez', nameAr: 'لاوتارو مارتينيز', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'ST', rating: 88, flag: '🇦🇷' },
  { name: 'Lamine Yamal', nameAr: 'لامين يامال', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2026, position: 'RW', rating: 89, flag: '🇪🇸' },
  { name: 'Robert Lewandowski', nameAr: 'روبرت ليفاندوفسكي', nationality: 'Poland', nationalityAr: 'بولندا', year: 2022, position: 'ST', rating: 91, flag: '🇵🇱' },
  { name: 'Youssef En-Nesyri', nameAr: 'يوسف النصيري', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'ST', rating: 83, flag: '🇲🇦' },
  { name: 'Sofiane Boufal', nameAr: 'سفيان بوفال', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'LW', rating: 82, flag: '🇲🇦' },
  { name: 'Christian Pulisic', nameAr: 'كريستيان بوليسيتش', nationality: 'USA', nationalityAr: 'الولايات المتحدة', year: 2022, position: 'LW', rating: 82, flag: '🇺🇸' },
  { name: 'Jorge Campos', nameAr: 'خورخي كامبوس', nationality: 'Mexico', nationalityAr: 'المكسيك', year: 1994, position: 'GK', rating: 81, flag: '🇲🇽' },
  { name: 'Hugo Sanchez', nameAr: 'هوغو سانشيز', nationality: 'Mexico', nationalityAr: 'المكسيك', year: 1986, position: 'ST', rating: 84, flag: '🇲🇽' },
  { name: 'Just Fontaine', nameAr: 'جوست فونتين', nationality: 'France', nationalityAr: 'فرنسا', year: 1958, position: 'ST', rating: 87, flag: '🇫🇷' },
  { name: 'Raymond Kopa', nameAr: 'ريموند كوبا', nationality: 'France', nationalityAr: 'فرنسا', year: 1958, position: 'CAM', rating: 86, flag: '🇫🇷' },
  { name: 'Sandor Kocsis', nameAr: 'ساندور كوتشيش', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'ST', rating: 88, flag: '🇭🇺' },
  { name: 'Ferenc Puskas', nameAr: 'فيرنتس بوشكاش', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'ST', rating: 91, flag: '🇭🇺' },
  { name: 'Nandor Hidegkuti', nameAr: 'ناندور هيديغكوتي', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'CAM', rating: 88, flag: '🇭🇺' },
  { name: 'Zoltan Czibor', nameAr: 'زولتان تشيبور', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'LW', rating: 86, flag: '🇭🇺' },
  { name: 'Jozsef Zakarias', nameAr: 'يوزسيف زاكاریاس', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'CDM', rating: 82, flag: '🇭🇺' },
];

export const PLAYERS: Player[] = rawPlayers.map((p, i) => ({
  ...p,
  id: `player_${i}`,
  positionType: getPositionType(p.position),
}));

export function getPlayersByPositionType(positionType: PositionType): Player[] {
  return PLAYERS.filter(p => p.positionType === positionType);
}

export interface Squad {
  nationality: string;
  nationalityAr: string;
  year: number;
  flag: string;
  players: Player[];
}

export function generateRandomSquadForPosition(positionType: PositionType): Squad {
  const pool = PLAYERS.filter(p => p.positionType === positionType).sort(() => Math.random() - 0.5).slice(0, 6);
  const sample = pool[0];
  return {
    nationality: sample?.nationality || 'Legends',
    nationalityAr: sample?.nationalityAr || 'أبطال',
    year: sample?.year || 0,
    flag: sample?.flag || '⭐',
    players: pool,
  };
}

// NEW: Generate a full national team squad from a random nationality+year combination
export function generateFullNationalTeamSquad(): Squad {
  // Get all unique nationality+year combos that have ≥2 players
  interface Combo { nationality: string; nationalityAr: string; year: number; flag: string; count: number; }
  const comboMap = new Map<string, Combo>();

  for (const p of PLAYERS) {
    const key = `${p.nationality}|${p.year}`;
    const existing = comboMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      comboMap.set(key, { nationality: p.nationality, nationalityAr: p.nationalityAr, year: p.year, flag: p.flag, count: 1 });
    }
  }

  // Also count players within ±4 years for fallback
  const allCombos = Array.from(comboMap.values());
  const goodCombos = allCombos.filter(c => c.count >= 2);

  // Pick from good combos first, then any
  const pool = goodCombos.length > 0 ? goodCombos : allCombos;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Special 10% chance: World Legends pack
  if (Math.random() < 0.10) {
    const legends = PLAYERS.filter(p => p.rating >= 90).sort(() => Math.random() - 0.5).slice(0, 10);
    return { nationality: 'World Legends', nationalityAr: 'أبطال العالم', year: 0, flag: '⭐', players: legends };
  }

  for (const combo of shuffled.slice(0, 15)) {
    // Try exact year match
    let players = PLAYERS.filter(p => p.nationality === combo.nationality && p.year === combo.year);

    // Extend to ±4 years if fewer than 3 players
    if (players.length < 3) {
      const extra = PLAYERS.filter(p =>
        p.nationality === combo.nationality &&
        Math.abs(p.year - combo.year) <= 4 &&
        !players.some(tp => tp.id === p.id)
      );
      players = [...players, ...extra];
    }

    if (players.length >= 2) {
      return {
        nationality: combo.nationality,
        nationalityAr: combo.nationalityAr,
        year: combo.year,
        flag: combo.flag,
        players: players.sort((a, b) => b.rating - a.rating),
      };
    }
  }

  // Fallback: legends
  const legends = PLAYERS.filter(p => p.rating >= 90).sort(() => Math.random() - 0.5).slice(0, 8);
  return { nationality: 'World Legends', nationalityAr: 'أبطال العالم', year: 0, flag: '⭐', players: legends };
}
