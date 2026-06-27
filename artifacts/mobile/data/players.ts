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

const POS_TYPE_ORDER: Record<PositionType, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

const rawPlayers: Omit<Player, 'id' | 'positionType'>[] = [
  // ===================== GK =====================
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
  { name: 'Marcos', nameAr: 'ماركوس', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'GK', rating: 85, flag: '🇧🇷' },
  { name: 'Felix', nameAr: 'فيليكس', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'GK', rating: 83, flag: '🇧🇷' },
  { name: 'Nery Pumpido', nameAr: 'نيري بومبيدو', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'GK', rating: 84, flag: '🇦🇷' },
  { name: 'Fabien Barthez', nameAr: 'فابيان بارتيز', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'GK', rating: 89, flag: '🇫🇷' },
  { name: 'Roman Weidenfeller', nameAr: 'رومان فايدنفيلر', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'GK', rating: 82, flag: '🇩🇪' },
  { name: 'Antonio Carbajal', nameAr: 'أنطونيو كارباخال', nationality: 'Mexico', nationalityAr: 'المكسيك', year: 1954, position: 'GK', rating: 82, flag: '🇲🇽' },
  { name: 'Roque Maspoli', nameAr: 'روكي ماسبولي', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'GK', rating: 83, flag: '🇺🇾' },
  { name: 'Gyula Grosics', nameAr: 'غيولا غروشيتش', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'GK', rating: 86, flag: '🇭🇺' },
  { name: 'Jan Jongbloed', nameAr: 'يان يونغبلود', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'GK', rating: 83, flag: '🇳🇱' },
  { name: 'Yassine Bono', nameAr: 'ياسين بونو', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'GK', rating: 86, flag: '🇲🇦' },
  { name: 'Jorge Campos', nameAr: 'خورخي كامبوس', nationality: 'Mexico', nationalityAr: 'المكسيك', year: 1994, position: 'GK', rating: 81, flag: '🇲🇽' },
  { name: 'Dida', nameAr: 'ديدا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2006, position: 'GK', rating: 85, flag: '🇧🇷' },
  { name: 'Edwin van der Sar', nameAr: 'إدوين فان دير سار', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1998, position: 'GK', rating: 88, flag: '🇳🇱' },

  // ===================== DEF =====================
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
  { name: 'Thiago Silva', nameAr: 'تياغو سيلفا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'CB', rating: 90, flag: '🇧🇷' },
  { name: 'Dani Alves', nameAr: 'داني ألفيس', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'RB', rating: 88, flag: '🇧🇷' },
  { name: 'Marcelo', nameAr: 'مارسيلو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'LB', rating: 88, flag: '🇧🇷' },
  { name: 'Lucio', nameAr: 'لوسيو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CB', rating: 88, flag: '🇧🇷' },
  { name: 'Giorgio Chiellini', nameAr: 'جيورجيو كييليني', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CB', rating: 89, flag: '🇮🇹' },
  { name: 'Alessandro Nesta', nameAr: 'أليساندرو نيستا', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CB', rating: 88, flag: '🇮🇹' },
  { name: 'Berti Vogts', nameAr: 'بيرتي فوغتس', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'RB', rating: 86, flag: '🇩🇪' },
  { name: 'Hans-Georg Schwarzenbeck', nameAr: 'شوارتسنبيك', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'CB', rating: 84, flag: '🇩🇪' },
  { name: 'Lilian Thuram', nameAr: 'ليليان ثورام', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'RB', rating: 88, flag: '🇫🇷' },
  { name: 'Marcel Desailly', nameAr: 'مارسيل ديسايي', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'CB', rating: 88, flag: '🇫🇷' },
  { name: 'Laurent Blanc', nameAr: 'لوران بلان', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'CB', rating: 87, flag: '🇫🇷' },
  { name: 'Bixente Lizarazu', nameAr: 'بيكسانت ليزاراز', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'LB', rating: 86, flag: '🇫🇷' },
  { name: 'Fabio Grosso', nameAr: 'فابيو غروسو', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'LB', rating: 83, flag: '🇮🇹' },
  { name: 'Gianluca Zambrotta', nameAr: 'جانلوكا زامبروتا', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'RB', rating: 85, flag: '🇮🇹' },
  { name: 'Jordi Alba', nameAr: 'خوردي ألبا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'LB', rating: 87, flag: '🇪🇸' },
  { name: 'Joan Capdevila', nameAr: 'خوان كابديفيلا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'LB', rating: 80, flag: '🇪🇸' },
  { name: 'Raul Albiol', nameAr: 'راؤول ألبيول', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'CB', rating: 82, flag: '🇪🇸' },
  { name: 'Alvaro Arbeloa', nameAr: 'ألفارو أربيلوا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'RB', rating: 80, flag: '🇪🇸' },
  { name: 'Per Mertesacker', nameAr: 'بر مرتيساكر', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CB', rating: 84, flag: '🇩🇪' },
  { name: 'Erik Durm', nameAr: 'إيريك دورم', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'LB', rating: 78, flag: '🇩🇪' },
  { name: 'Samuel Umtiti', nameAr: 'صامويل أومتيتي', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'CB', rating: 85, flag: '🇫🇷' },
  { name: 'Djibril Sidibe', nameAr: 'جيبريل سيديبي', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'RB', rating: 82, flag: '🇫🇷' },
  { name: 'Lucas Hernandez', nameAr: 'لوكاس هيرنانديز', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'LB', rating: 84, flag: '🇫🇷' },
  { name: 'Cristian Romero', nameAr: 'كريستيان روميرو', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CB', rating: 86, flag: '🇦🇷' },
  { name: 'Nicolas Tagliafico', nameAr: 'نيكولاس تاغلياكيو', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'LB', rating: 82, flag: '🇦🇷' },
  { name: 'Nahuel Molina', nameAr: 'ناهويل مولينا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'RB', rating: 83, flag: '🇦🇷' },
  { name: 'Nicolas Otamendi', nameAr: 'نيكولاس أوتامندي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CB', rating: 85, flag: '🇦🇷' },
  { name: 'Lisandro Martinez', nameAr: 'ليساندرو مارتينيز', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CB', rating: 85, flag: '🇦🇷' },
  { name: 'Nayef Aguerd', nameAr: 'نايف أكرد', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CB', rating: 82, flag: '🇲🇦' },
  { name: 'Romain Saiss', nameAr: 'رومان سايس', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CB', rating: 82, flag: '🇲🇦' },
  { name: 'Jawad El Yamiq', nameAr: 'جواد الياميق', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CB', rating: 79, flag: '🇲🇦' },
  { name: 'Noussair Mazraoui', nameAr: 'نصير مزراوي', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'RB', rating: 82, flag: '🇲🇦' },
  { name: 'Badr Benoun', nameAr: 'بدر بنون', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CB', rating: 78, flag: '🇲🇦' },
  { name: 'Roque Junior', nameAr: 'روكي جونيور', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CB', rating: 82, flag: '🇧🇷' },
  { name: 'Edilson', nameAr: 'إيديلسون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'RB', rating: 80, flag: '🇧🇷' },
  { name: 'Junior', nameAr: 'جونيور', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1982, position: 'LB', rating: 84, flag: '🇧🇷' },
  { name: 'Maicon', nameAr: 'ميكون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2010, position: 'RB', rating: 88, flag: '🇧🇷' },
  { name: 'Ruud Krol', nameAr: 'رود كرول', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'LB', rating: 86, flag: '🇳🇱' },
  { name: 'Wim Suurbier', nameAr: 'ويم سوربير', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'RB', rating: 82, flag: '🇳🇱' },
  { name: 'Wim Rijsbergen', nameAr: 'ويم ريسبرغن', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'CB', rating: 80, flag: '🇳🇱' },
  { name: 'Barry Hulshoff', nameAr: 'باري هولشوف', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'CB', rating: 80, flag: '🇳🇱' },
  { name: 'Bobby Charlton', nameAr: 'بوبي تشارلتون', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'CM', rating: 91, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Jack Charlton', nameAr: 'جاك تشارلتون', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'CB', rating: 82, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'George Cohen', nameAr: 'جورج كوهين', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'RB', rating: 80, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Ray Wilson', nameAr: 'راي ويلسون', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'LB', rating: 80, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Paul Breitner', nameAr: 'بول برايتنر', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'LB', rating: 86, flag: '🇩🇪' },
  { name: 'Oscar Ruggeri', nameAr: 'أوسكار روغيري', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CB', rating: 85, flag: '🇦🇷' },
  { name: 'Jose Luis Brown', nameAr: 'خوسيه لويس براون', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CB', rating: 82, flag: '🇦🇷' },
  { name: 'Julio Olarticoechea', nameAr: 'خوليو أولارتيكوتشيا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'LB', rating: 80, flag: '🇦🇷' },
  { name: 'Nestor Clausen', nameAr: 'نيستور كلاوسن', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CB', rating: 79, flag: '🇦🇷' },
  { name: 'Brito', nameAr: 'بريتو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'CB', rating: 81, flag: '🇧🇷' },
  { name: 'Piazza', nameAr: 'بياتزا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'CB', rating: 80, flag: '🇧🇷' },
  { name: 'Everaldo', nameAr: 'إيفيرالدو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'LB', rating: 81, flag: '🇧🇷' },
  { name: 'Vincent Kompany', nameAr: 'فنسان كومباني', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'CB', rating: 88, flag: '🇧🇪' },
  { name: 'Toby Alderweireld', nameAr: 'توبي ألدرويرلد', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'CB', rating: 86, flag: '🇧🇪' },
  { name: 'Dejan Lovren', nameAr: 'ديان لوفرن', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'CB', rating: 82, flag: '🇭🇷' },
  { name: 'Ivan Strinic', nameAr: 'إيفان ستريبنيتش', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'LB', rating: 79, flag: '🇭🇷' },
  { name: 'Pepe', nameAr: 'بيبي', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2014, position: 'CB', rating: 85, flag: '🇵🇹' },
  { name: 'Marius Tresor', nameAr: 'ماريوس تريسور', nationality: 'France', nationalityAr: 'فرنسا', year: 1982, position: 'CB', rating: 83, flag: '🇫🇷' },
  { name: 'Manuel Amoros', nameAr: 'مانويل أموروس', nationality: 'France', nationalityAr: 'فرنسا', year: 1982, position: 'RB', rating: 81, flag: '🇫🇷' },
  { name: 'Obdulio Varela', nameAr: 'أوبدوليو فاريلا', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'CDM', rating: 85, flag: '🇺🇾' },
  { name: 'Matias Gonzalez', nameAr: 'ماتياس غونزاليس', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'CB', rating: 79, flag: '🇺🇾' },
  { name: 'Schubert Gambetta', nameAr: 'شوبرت غامبيتا', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'RB', rating: 77, flag: '🇺🇾' },
  { name: 'Victor Rodriguez Andrade', nameAr: 'فيكتور رودريغيز أندريدي', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'CM', rating: 80, flag: '🇺🇾' },
  { name: 'Gyula Lorant', nameAr: 'غيولا لورانت', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'CB', rating: 80, flag: '🇭🇺' },
  { name: 'Mihaly Lantos', nameAr: 'ميهالي لانتوس', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'LB', rating: 79, flag: '🇭🇺' },
  { name: 'Kim Min-jae', nameAr: 'كيم مين جاي', nationality: 'South Korea', nationalityAr: 'كوريا الجنوبية', year: 2022, position: 'CB', rating: 84, flag: '🇰🇷' },
  { name: 'Danielle De Rossi', nameAr: 'دانييلي دي روسي', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CM', rating: 84, flag: '🇮🇹' },

  // ===================== MID =====================
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
  { name: 'Marco Antonio', nameAr: 'ماركو أنطونيو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'CM', rating: 82, flag: '🇧🇷' },
  { name: 'Falcao', nameAr: 'فالكاو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1982, position: 'CM', rating: 88, flag: '🇧🇷' },
  { name: 'Socrates', nameAr: 'سقراط', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1982, position: 'CAM', rating: 89, flag: '🇧🇷' },
  { name: 'Zico', nameAr: 'زيكو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1982, position: 'CAM', rating: 90, flag: '🇧🇷' },
  { name: 'Neymar Jr', nameAr: 'نيمار جونيور', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2014, position: 'CAM', rating: 92, flag: '🇧🇷' },
  { name: 'Casemiro', nameAr: 'كاسيميرو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'CDM', rating: 89, flag: '🇧🇷' },
  { name: 'Lucas Paqueta', nameAr: 'لوكاس باكيتا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'CAM', rating: 85, flag: '🇧🇷' },
  { name: 'Rivaldo', nameAr: 'ريفالدو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CAM', rating: 90, flag: '🇧🇷' },
  { name: 'Edmilson', nameAr: 'إيدميلسون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CDM', rating: 83, flag: '🇧🇷' },
  { name: 'Kleberson', nameAr: 'كليبرسون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CM', rating: 80, flag: '🇧🇷' },
  { name: 'Juninho Paulista', nameAr: 'جونينيو باوليستا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CM', rating: 81, flag: '🇧🇷' },
  { name: 'Gilberto Silva', nameAr: 'جيلبرتو سيلفا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CDM', rating: 84, flag: '🇧🇷' },
  { name: 'Johan Neeskens', nameAr: 'يوهان نيسكنز', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'CM', rating: 87, flag: '🇳🇱' },
  { name: 'Wim van Hanegem', nameAr: 'ويم فان هانيغم', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'CM', rating: 84, flag: '🇳🇱' },
  { name: 'Willem Jansen', nameAr: 'ويليم يانسن', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'CM', rating: 81, flag: '🇳🇱' },
  { name: 'Arie Haan', nameAr: 'آري هان', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'CDM', rating: 82, flag: '🇳🇱' },
  { name: 'Wesley Sneijder', nameAr: 'ويسلي سنايدر', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 2010, position: 'CAM', rating: 88, flag: '🇳🇱' },
  { name: 'Martin Peters', nameAr: 'مارتن بيترز', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'CM', rating: 83, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Nobby Stiles', nameAr: 'نوبي ستايلز', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'CDM', rating: 80, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Alan Ball', nameAr: 'ألان بول', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'CM', rating: 82, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Wolfgang Overath', nameAr: 'وولفغانغ أوفيرات', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'CM', rating: 86, flag: '🇩🇪' },
  { name: 'Rainer Bonhof', nameAr: 'راينر بونهوف', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'CM', rating: 83, flag: '🇩🇪' },
  { name: 'Patrick Vieira', nameAr: 'باتريك فييرا', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'CM', rating: 90, flag: '🇫🇷' },
  { name: 'Emmanuel Petit', nameAr: 'إيمانويل بيتي', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'CDM', rating: 85, flag: '🇫🇷' },
  { name: 'Youri Djorkaeff', nameAr: 'يوري جوركاف', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'CAM', rating: 86, flag: '🇫🇷' },
  { name: 'Robert Pires', nameAr: 'روبيرت بيريس', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'LW', rating: 86, flag: '🇫🇷' },
  { name: 'Jorge Burruchaga', nameAr: 'خورخي بوروتشاغا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CM', rating: 84, flag: '🇦🇷' },
  { name: 'Sergio Batista', nameAr: 'سيرخيو باتيستا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CDM', rating: 80, flag: '🇦🇷' },
  { name: 'Jorge Valdano', nameAr: 'خورخي فالدانو', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CAM', rating: 83, flag: '🇦🇷' },
  { name: 'Hector Enrique', nameAr: 'هيكتور انريكي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'CM', rating: 80, flag: '🇦🇷' },
  { name: 'Rodrigo De Paul', nameAr: 'رودريغو دي بول', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CDM', rating: 84, flag: '🇦🇷' },
  { name: 'Alexis Mac Allister', nameAr: 'ألكسيس ماك أليستر', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CM', rating: 84, flag: '🇦🇷' },
  { name: 'Enzo Fernandez', nameAr: 'إنزو فيرنانديز', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'CM', rating: 82, flag: '🇦🇷' },
  { name: 'Marcos Acuna', nameAr: 'ماركوس أكونيا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'LB', rating: 82, flag: '🇦🇷' },
  { name: 'Sofyan Amrabat', nameAr: 'صفيان أمرابط', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CDM', rating: 83, flag: '🇲🇦' },
  { name: 'Azzedine Ounahi', nameAr: 'عزيدين أوناحي', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CM', rating: 80, flag: '🇲🇦' },
  { name: 'Abdelhamid Sabiri', nameAr: 'عبد الحميد صابري', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CM', rating: 79, flag: '🇲🇦' },
  { name: 'Hakim Ziyech', nameAr: 'حكيم زياش', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'CAM', rating: 83, flag: '🇲🇦' },
  { name: 'Bastian Schweinsteiger', nameAr: 'باستيان شفاينشتايغر', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CDM', rating: 88, flag: '🇩🇪' },
  { name: 'Mario Gotze', nameAr: 'ماريو غوتزه', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CAM', rating: 86, flag: '🇩🇪' },
  { name: 'Sami Khedira', nameAr: 'سامي خضيرة', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'CM', rating: 84, flag: '🇩🇪' },
  { name: 'Corentin Tolisso', nameAr: 'كورانتان توليسو', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'CM', rating: 82, flag: '🇫🇷' },
  { name: 'David Silva', nameAr: 'دافيد سيلفا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'CAM', rating: 89, flag: '🇪🇸' },
  { name: 'Simone Perrotta', nameAr: 'سيموني بيروتا', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CM', rating: 80, flag: '🇮🇹' },
  { name: 'Mauro Camoranesi', nameAr: 'ماورو كاموراننسي', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'CM', rating: 81, flag: '🇮🇹' },
  { name: 'Jozsef Bozsik', nameAr: 'يوجيف بوجيك', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'CM', rating: 85, flag: '🇭🇺' },
  { name: 'Jozsef Zakarias', nameAr: 'يوزسيف زاكاریاس', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'CDM', rating: 82, flag: '🇭🇺' },
  { name: 'Eusebio Tejera', nameAr: 'يوسيبيو تيخيرا', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'CM', rating: 78, flag: '🇺🇾' },
  { name: 'Bernardo Silva', nameAr: 'برناردو سيلفا', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'CM', rating: 88, flag: '🇵🇹' },
  { name: 'Bruno Fernandes', nameAr: 'برونو فيرنانديز', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'CAM', rating: 88, flag: '🇵🇹' },
  { name: 'Gavi', nameAr: 'غافي', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2022, position: 'CM', rating: 86, flag: '🇪🇸' },
  { name: 'Pedri', nameAr: 'بيدري', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2022, position: 'CM', rating: 87, flag: '🇪🇸' },
  { name: 'Jude Bellingham', nameAr: 'جود بيلينغهام', nationality: 'England', nationalityAr: 'إنجلترا', year: 2022, position: 'CM', rating: 88, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Declan Rice', nameAr: 'ديكلان رايس', nationality: 'England', nationalityAr: 'إنجلترا', year: 2022, position: 'CDM', rating: 85, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Yaya Toure', nameAr: 'يايا توري', nationality: 'Ivory Coast', nationalityAr: 'ساحل العاج', year: 2014, position: 'CM', rating: 87, flag: '🇨🇮' },
  { name: 'Claude Makelele', nameAr: 'كلود ماكيليلي', nationality: 'France', nationalityAr: 'فرنسا', year: 2006, position: 'CDM', rating: 87, flag: '🇫🇷' },
  { name: 'Park Ji-sung', nameAr: 'باك جي سونغ', nationality: 'South Korea', nationalityAr: 'كوريا الجنوبية', year: 2010, position: 'CM', rating: 83, flag: '🇰🇷' },
  { name: 'Federico Valverde', nameAr: 'فيديريكو فالفيردي', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 2022, position: 'CM', rating: 88, flag: '🇺🇾' },
  { name: 'Florian Wirtz', nameAr: 'فلوريان ويرتس', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2026, position: 'CAM', rating: 88, flag: '🇩🇪' },
  { name: 'Jamal Musiala', nameAr: 'جمال موسيالا', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2026, position: 'CAM', rating: 88, flag: '🇩🇪' },
  { name: 'Just Fontaine', nameAr: 'جوست فونتين', nationality: 'France', nationalityAr: 'فرنسا', year: 1958, position: 'ST', rating: 87, flag: '🇫🇷' },
  { name: 'Raymond Kopa', nameAr: 'ريموند كوبا', nationality: 'France', nationalityAr: 'فرنسا', year: 1958, position: 'CAM', rating: 86, flag: '🇫🇷' },
  { name: 'Nandor Hidegkuti', nameAr: 'ناندور هيديغكوتي', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'CAM', rating: 88, flag: '🇭🇺' },

  // ===================== FWD =====================
  { name: 'Pelé', nameAr: 'بيليه', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'ST', rating: 99, flag: '🇧🇷' },
  { name: 'Ronaldo Nazario', nameAr: 'رونالدو نازاريو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'ST', rating: 98, flag: '🇧🇷' },
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
  { name: 'Stephane Guivarc\'h', nameAr: 'ستيفان غيفارش', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'ST', rating: 78, flag: '🇫🇷' },
  { name: 'Miroslav Klose', nameAr: 'ميروسلاف كلوزه', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'ST', rating: 89, flag: '🇩🇪' },
  { name: 'David Villa', nameAr: 'دافيد فييا', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'ST', rating: 89, flag: '🇪🇸' },
  { name: 'Fernando Torres', nameAr: 'فيرناندو توريس', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'ST', rating: 87, flag: '🇪🇸' },
  { name: 'Pedro', nameAr: 'بيدرو', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'LW', rating: 83, flag: '🇪🇸' },
  { name: 'Jesus Navas', nameAr: 'خيسوس نافاس', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2010, position: 'RW', rating: 81, flag: '🇪🇸' },
  { name: 'Jairzinho', nameAr: 'جايرزينيو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'RW', rating: 91, flag: '🇧🇷' },
  { name: 'Tostao', nameAr: 'توستاو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'ST', rating: 90, flag: '🇧🇷' },
  { name: 'Paulo Cesar', nameAr: 'باولو سيزار', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'LW', rating: 83, flag: '🇧🇷' },
  { name: 'Edu', nameAr: 'إيدو', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1970, position: 'RW', rating: 80, flag: '🇧🇷' },
  { name: 'Garrincha', nameAr: 'غارينشا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1962, position: 'RW', rating: 95, flag: '🇧🇷' },
  { name: 'Vava', nameAr: 'فافا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 1958, position: 'ST', rating: 86, flag: '🇧🇷' },
  { name: 'Kempes', nameAr: 'كمبيس', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1978, position: 'ST', rating: 89, flag: '🇦🇷' },
  { name: 'Leopoldo Luque', nameAr: 'ليوبولدو لوكي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1978, position: 'ST', rating: 82, flag: '🇦🇷' },
  { name: 'Paolo Rossi', nameAr: 'باولو روسي', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 1982, position: 'ST', rating: 89, flag: '🇮🇹' },
  { name: 'Alessandro Del Piero', nameAr: 'أليساندرو ديل بييرو', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'ST', rating: 88, flag: '🇮🇹' },
  { name: 'Luca Toni', nameAr: 'لوكا توني', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'ST', rating: 85, flag: '🇮🇹' },
  { name: 'Alberto Gilardino', nameAr: 'ألبيرتو جيلاردينو', nationality: 'Italy', nationalityAr: 'إيطاليا', year: 2006, position: 'ST', rating: 80, flag: '🇮🇹' },
  { name: 'Gary Lineker', nameAr: 'غاري لينيكر', nationality: 'England', nationalityAr: 'إنجلترا', year: 1986, position: 'ST', rating: 87, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Geoff Hurst', nameAr: 'جيف هيرست', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'ST', rating: 86, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Roger Hunt', nameAr: 'روجر هانت', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'ST', rating: 82, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Jimmy Greaves', nameAr: 'جيمي غريفز', nationality: 'England', nationalityAr: 'إنجلترا', year: 1966, position: 'ST', rating: 84, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Davor Suker', nameAr: 'دافور سوكر', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 1998, position: 'ST', rating: 85, flag: '🇭🇷' },
  { name: 'Andrej Kramaric', nameAr: 'أندريه كراماريتش', nationality: 'Croatia', nationalityAr: 'كرواتيا', year: 2018, position: 'ST', rating: 82, flag: '🇭🇷' },
  { name: 'Luis Figo', nameAr: 'لويس فيغو', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2002, position: 'RW', rating: 91, flag: '🇵🇹' },
  { name: 'Cristiano Ronaldo 2022', nameAr: 'كريستيانو رونالدو 22', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'ST', rating: 91, flag: '🇵🇹' },
  { name: 'Diogo Jota', nameAr: 'دييغو خوتا', nationality: 'Portugal', nationalityAr: 'البرتغال', year: 2022, position: 'LW', rating: 84, flag: '🇵🇹' },
  { name: 'Didier Drogba', nameAr: 'ديدييه دروغبا', nationality: 'Ivory Coast', nationalityAr: 'ساحل العاج', year: 2010, position: 'ST', rating: 88, flag: '🇨🇮' },
  { name: 'Samuel Etoo', nameAr: 'صاموئيل إيتو', nationality: 'Cameroon', nationalityAr: 'الكاميرون', year: 2010, position: 'ST', rating: 88, flag: '🇨🇲' },
  { name: 'Wayne Rooney', nameAr: 'واين روني', nationality: 'England', nationalityAr: 'إنجلترا', year: 2010, position: 'ST', rating: 87, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Arjen Robben', nameAr: 'أرين روبن', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 2014, position: 'RW', rating: 89, flag: '🇳🇱' },
  { name: 'Robin van Persie', nameAr: 'روبن فان بيرسي', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 2014, position: 'ST', rating: 88, flag: '🇳🇱' },
  { name: 'Johnny Rep', nameAr: 'جوني ريب', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'ST', rating: 83, flag: '🇳🇱' },
  { name: 'Rob Rensenbrink', nameAr: 'روب رينسينبرينك', nationality: 'Netherlands', nationalityAr: 'هولندا', year: 1974, position: 'LW', rating: 84, flag: '🇳🇱' },
  { name: 'Romelu Lukaku', nameAr: 'روميلو لوكاكو', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'ST', rating: 87, flag: '🇧🇪' },
  { name: 'Dries Mertens', nameAr: 'دريس مارتينز', nationality: 'Belgium', nationalityAr: 'بلجيكا', year: 2018, position: 'ST', rating: 85, flag: '🇧🇪' },
  { name: 'Vinicius Jr', nameAr: 'فينيسيوس جونيور', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'LW', rating: 90, flag: '🇧🇷' },
  { name: 'Richarlison', nameAr: 'ريتشارليسون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2022, position: 'ST', rating: 85, flag: '🇧🇷' },
  { name: 'Denilson', nameAr: 'دينيلسون', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'LW', rating: 80, flag: '🇧🇷' },
  { name: 'Vampeta', nameAr: 'فامبيتا', nationality: 'Brazil', nationalityAr: 'البرازيل', year: 2002, position: 'CM', rating: 79, flag: '🇧🇷' },
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
  { name: 'Paulo Dybala', nameAr: 'باولو ديبالا', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 2022, position: 'RW', rating: 86, flag: '🇦🇷' },
  { name: 'Youssef En-Nesyri', nameAr: 'يوسف النصيري', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'ST', rating: 83, flag: '🇲🇦' },
  { name: 'Sofiane Boufal', nameAr: 'سفيان بوفال', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'LW', rating: 82, flag: '🇲🇦' },
  { name: 'Abde Ezzalzouli', nameAr: 'عبده الزلزولي', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'LW', rating: 79, flag: '🇲🇦' },
  { name: 'Walid Cheddira', nameAr: 'وليد الشديرة', nationality: 'Morocco', nationalityAr: 'المغرب', year: 2022, position: 'ST', rating: 79, flag: '🇲🇦' },
  { name: 'Andre Schurrle', nameAr: 'أندريه شورلي', nationality: 'Germany', nationalityAr: 'ألمانيا', year: 2014, position: 'LW', rating: 82, flag: '🇩🇪' },
  { name: 'Olivier Giroud', nameAr: 'أوليفييه جيرو', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'ST', rating: 84, flag: '🇫🇷' },
  { name: 'Florian Thauvin', nameAr: 'فلوريان توفان', nationality: 'France', nationalityAr: 'فرنسا', year: 2018, position: 'RW', rating: 82, flag: '🇫🇷' },
  { name: 'Kylian Mbappe 2022', nameAr: 'كيليان مبابي 22', nationality: 'France', nationalityAr: 'فرنسا', year: 2022, position: 'ST', rating: 97, flag: '🇫🇷' },
  { name: 'Lamine Yamal', nameAr: 'لامين يامال', nationality: 'Spain', nationalityAr: 'إسبانيا', year: 2026, position: 'RW', rating: 89, flag: '🇪🇸' },
  { name: 'Robert Lewandowski', nameAr: 'روبرت ليفاندوفسكي', nationality: 'Poland', nationalityAr: 'بولندا', year: 2022, position: 'ST', rating: 91, flag: '🇵🇱' },
  { name: 'Son Heung-min', nameAr: 'سون هيونغ مين', nationality: 'South Korea', nationalityAr: 'كوريا الجنوبية', year: 2022, position: 'LW', rating: 88, flag: '🇰🇷' },
  { name: 'Christian Pulisic', nameAr: 'كريستيان بوليسيتش', nationality: 'USA', nationalityAr: 'الولايات المتحدة', year: 2022, position: 'LW', rating: 82, flag: '🇺🇸' },
  { name: 'Hugo Sanchez', nameAr: 'هوغو سانشيز', nationality: 'Mexico', nationalityAr: 'المكسيك', year: 1986, position: 'ST', rating: 84, flag: '🇲🇽' },
  { name: 'Sandor Kocsis', nameAr: 'ساندور كوتشيش', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'ST', rating: 88, flag: '🇭🇺' },
  { name: 'Ferenc Puskas', nameAr: 'فيرنتس بوشكاش', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'ST', rating: 91, flag: '🇭🇺' },
  { name: 'Zoltan Czibor', nameAr: 'زولتان تشيبور', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'LW', rating: 86, flag: '🇭🇺' },
  { name: 'Sandor Toth', nameAr: 'ساندور توث', nationality: 'Hungary', nationalityAr: 'المجر', year: 1954, position: 'RW', rating: 82, flag: '🇭🇺' },
  { name: 'Gerd Muller', nameAr: 'غيرد مولر', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'ST', rating: 95, flag: '🇩🇪' },
  { name: 'Bernd Holzenbein', nameAr: 'بيرند هولتسنباين', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'LW', rating: 82, flag: '🇩🇪' },
  { name: 'Uli Hoeness', nameAr: 'أولي هوينيس', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'ST', rating: 82, flag: '🇩🇪' },
  { name: 'Jupp Heynckes', nameAr: 'يوب هاينكس', nationality: 'West Germany', nationalityAr: 'ألمانيا الغربية', year: 1974, position: 'ST', rating: 81, flag: '🇩🇪' },
  { name: 'Alcides Ghiggia', nameAr: 'ألسيدس غيغيا', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'RW', rating: 85, flag: '🇺🇾' },
  { name: 'Juan Schiaffino', nameAr: 'خوان شيافينو', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'CAM', rating: 88, flag: '🇺🇾' },
  { name: 'Omar Miguez', nameAr: 'عمر ميغيز', nationality: 'Uruguay', nationalityAr: 'أوروغواي', year: 1950, position: 'ST', rating: 82, flag: '🇺🇾' },
  { name: 'Abel Balbo', nameAr: 'أبيل بالبو', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1994, position: 'ST', rating: 81, flag: '🇦🇷' },
  { name: 'Pedro Pasculli', nameAr: 'بيدرو باسكولي', nationality: 'Argentina', nationalityAr: 'الأرجنتين', year: 1986, position: 'ST', rating: 78, flag: '🇦🇷' },
  { name: 'Robert Pires FWD', nameAr: 'روبيرت بيريس', nationality: 'France', nationalityAr: 'فرنسا', year: 2006, position: 'LW', rating: 84, flag: '🇫🇷' },
  { name: 'Christophe Dugarry', nameAr: 'كريستوف دوغاري', nationality: 'France', nationalityAr: 'فرنسا', year: 1998, position: 'ST', rating: 80, flag: '🇫🇷' },
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

function sortSquadPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) =>
    POS_TYPE_ORDER[a.positionType] - POS_TYPE_ORDER[b.positionType] ||
    b.rating - a.rating
  );
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

// Generate a full national team squad — shows ALL available players, sorted by position
export function generateFullNationalTeamSquad(excludeNationalities?: string[]): Squad {
  // 10% chance: World Legends pack
  if (Math.random() < 0.10) {
    const legends = PLAYERS.filter(p => p.rating >= 90).sort(() => Math.random() - 0.5).slice(0, 14);
    return { nationality: 'World Legends', nationalityAr: 'أبطال العالم', year: 0, flag: '⭐', players: sortSquadPlayers(legends) };
  }

  interface Combo { nationality: string; nationalityAr: string; year: number; flag: string; }
  const comboMap = new Map<string, Combo>();

  for (const p of PLAYERS) {
    if (excludeNationalities?.includes(p.nationality)) continue;
    const key = `${p.nationality}|${p.year}`;
    if (!comboMap.has(key)) {
      comboMap.set(key, { nationality: p.nationality, nationalityAr: p.nationalityAr, year: p.year, flag: p.flag });
    }
  }

  // Prefer combos where we have enough players for a complete team view
  const allCombos = Array.from(comboMap.values());
  const richCombos = allCombos.filter(c => {
    const exactCount = PLAYERS.filter(p => p.nationality === c.nationality && p.year === c.year).length;
    const nearbyCount = PLAYERS.filter(p => p.nationality === c.nationality && Math.abs(p.year - c.year) <= 4).length;
    return nearbyCount >= 5;
  });

  const pool = richCombos.length > 0 ? richCombos : allCombos;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  if (!selected) {
    const legends = PLAYERS.filter(p => p.rating >= 88).sort(() => Math.random() - 0.5).slice(0, 12);
    return { nationality: 'World Legends', nationalityAr: 'أبطال العالم', year: 0, flag: '⭐', players: sortSquadPlayers(legends) };
  }

  // Get ALL players from this nationality (across all years for small squads)
  let players = PLAYERS.filter(p => p.nationality === selected.nationality && p.year === selected.year);

  if (players.length < 8) {
    const extra = PLAYERS.filter(p =>
      p.nationality === selected.nationality &&
      Math.abs(p.year - selected.year) <= 8 &&
      !players.some(ep => ep.id === p.id)
    );
    players = [...players, ...extra];
  }

  return {
    nationality: selected.nationality,
    nationalityAr: selected.nationalityAr,
    year: selected.year,
    flag: selected.flag,
    players: sortSquadPlayers(players),
  };
}
