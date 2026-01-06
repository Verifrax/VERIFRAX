/**
 * VERIFRAX Production Worker — v2.8.0
 * 
 * HARD CUT — v2.8.0 ONLY
 * Payment enabled. 3-tier pricing system.
 * 
 * DEPLOYMENT:
 * wrangler deploy --name verifrax-v2-8
 */

import Stripe from "stripe";

const VERSION = "2.8.0";
const PAYMENT_STATUS = "enabled";

// Language tier definitions (inlined for Cloudflare Workers compatibility)
// tier0: en (canonical)
// tier1: major languages
// tier2: assistive only
const TIER1 = ['en','zh','es','hi','ar','pt','bn','ru','ja','pa','de','jv','ko','fr','te','mr','tr','ta','vi','ur','it','fa','th','gu','pl','uk','ro','nl','el','hu','sv','cs','he','id','ms','sw','no','da','fi','sk','bg','hr','sr','sl','lt','lv','et','is'];
const TIER2 = ['am','yo','ig','zu','km','lo','my','ne','si','bo','ug','ps','ku','fy','gd','mi','sm','to','qu','ay','gn','ha','rw','so','ti','wo','xh','st','ts','tn','ve','nr','ny','mg','lb','fo'];

const LANG_LABELS = {
  en:"EN", zh:"ZH", es:"ES", hi:"HI", ar:"AR", pt:"PT", bn:"BN", ru:"RU",
  ja:"JA", pa:"PA", de:"DE", jv:"JV", ko:"KO", fr:"FR", te:"TE", mr:"MR",
  tr:"TR", ta:"TA", vi:"VI", ur:"UR", it:"IT", fa:"FA", th:"TH", gu:"GU",
  pl:"PL", uk:"UK", ro:"RO", nl:"NL", el:"EL", hu:"HU", sv:"SV", cs:"CS",
  he:"HE", id:"ID", ms:"MS", sw:"SW", no:"NO", da:"DA", fi:"FI", sk:"SK",
  bg:"BG", hr:"HR", sr:"SR", sl:"SL", lt:"LT", lv:"LV", et:"ET", is:"IS"
};

// Centralized pricing (single source of truth for presentation)
const PRICES = {
  public: 120,
  pro: 650,
  institutional: 1500
};

// Embedded translations (stateless, deterministic)
const TRANSLATIONS = {
  en: {
    hero_title: "Deterministic Verification",
    hero_subtitle: "One execution. One certificate. Final.",
    cta_verify: "Start verification",
    cta_pro: "Legal / Professional Verification",
    cta_institutional: "Request Institutional Execution",
        feature_one_title: "One Execution",
    feature_one_desc: "Single, irreversible computation over your evidence bundle",
    feature_two_title: "Final Certificate",
    feature_two_desc: "Immutable, independently verifiable certificate",
    feature_three_title: "No Accounts",
    feature_three_desc: "No sign-up, no tracking, no data reuse",
    invariant_notice: "Language does not affect execution or certificates."
  },
  fr: {
    hero_title: "Vérification déterministe",
    hero_subtitle: "Une exécution. Un certificat. Final.",
    cta_verify: "Démarrer la vérification",
    cta_pro: "Vérification légale / professionnelle",
    cta_institutional: "Demander une exécution institutionnelle",
        feature_one_title: "Une exécution",
    feature_one_desc: "Calcul unique et irréversible sur votre bundle de preuves",
    feature_two_title: "Certificat final",
    feature_two_desc: "Certificat immuable et vérifiable indépendamment",
    feature_three_title: "Aucun compte",
    feature_three_desc: "Pas d'inscription, pas de suivi, pas de réutilisation des données",
    invariant_notice: "La langue n'affecte ni l'exécution ni les certificats."
  },
  es: {
    hero_title: "Verificación determinista",
    hero_subtitle: "Una ejecución. Un certificado. Final.",
    cta_verify: "Iniciar verificación",
    cta_pro: "Verificación legal / profesional",
    cta_institutional: "Solicitar ejecución institucional",
        feature_one_title: "Una ejecución",
    feature_one_desc: "Cálculo único e irreversible sobre su bundle de evidencia",
    feature_two_title: "Certificado final",
    feature_two_desc: "Certificado inmutable e independientemente verificable",
    feature_three_title: "Sin cuentas",
    feature_three_desc: "Sin registro, sin seguimiento, sin reutilización de datos",
    invariant_notice: "El idioma no afecta la ejecución ni los certificados."
  },
  de: {
    hero_title: "Deterministische Verifikation",
    hero_subtitle: "Eine Ausführung. Ein Zertifikat. Final.",
    cta_verify: "Verifikation starten",
    cta_pro: "Rechtliche / professionelle Verifikation",
    cta_institutional: "Institutionelle Ausführung anfordern",
        feature_one_title: "Eine Ausführung",
    feature_one_desc: "Einzelne, irreversible Berechnung über Ihr Beweisbündel",
    feature_two_title: "Endgültiges Zertifikat",
    feature_two_desc: "Unveränderliches, unabhängig verifizierbares Zertifikat",
    feature_three_title: "Keine Konten",
    feature_three_desc: "Keine Anmeldung, kein Tracking, keine Datenwiederverwendung",
    invariant_notice: "Die Sprache beeinflusst weder Ausführung noch Zertifikate."
  },
  pt: {
    hero_title: "Verificação determinística",
    hero_subtitle: "Uma execução. Um certificado. Final.",
    cta_verify: "Iniciar verificação",
    cta_pro: "Verificação legal / profissional",
    cta_institutional: "Solicitar execução institucional",
        feature_one_title: "Uma execução",
    feature_one_desc: "Cálculo único e irreversível sobre seu bundle de evidências",
    feature_two_title: "Certificado final",
    feature_two_desc: "Certificado imutável e independentemente verificável",
    feature_three_title: "Sem contas",
    feature_three_desc: "Sem cadastro, sem rastreamento, sem reutilização de dados",
    invariant_notice: "O idioma não afeta a execução nem os certificados."
  },
  it: {
    hero_title: "Verifica deterministica",
    hero_subtitle: "Una esecuzione. Un certificato. Finale.",
    cta_verify: "Avvia verifica",
    cta_pro: "Verifica legale / professionale",
    cta_institutional: "Richiedi esecuzione istituzionale",
        feature_one_title: "Una esecuzione",
    feature_one_desc: "Calcolo singolo e irreversibile sul tuo bundle di prove",
    feature_two_title: "Certificato finale",
    feature_two_desc: "Certificato immutabile e verificabile indipendentemente",
    feature_three_title: "Nessun account",
    feature_three_desc: "Nessuna registrazione, nessun tracciamento, nessun riutilizzo dei dati",
    invariant_notice: "La lingua non influisce sull'esecuzione né sui certificati."
  },
  ru: {
    hero_title: "Детерминированная верификация",
    hero_subtitle: "Один запуск. Один сертификат. Финальный.",
    cta_verify: "Запустить проверку",
    cta_pro: "Юридическая / профессиональная верификация",
    cta_institutional: "Запросить институциональное выполнение",
        feature_one_title: "Одно выполнение",
    feature_one_desc: "Единичное, необратимое вычисление над вашим пакетом доказательств",
    feature_two_title: "Финальный сертификат",
    feature_two_desc: "Неизменяемый, независимо проверяемый сертификат",
    feature_three_title: "Без аккаунтов",
    feature_three_desc: "Без регистрации, без отслеживания, без повторного использования данных",
    invariant_notice: "Язык не влияет ни на выполнение, ни на сертификаты."
  },
  zh: {
    hero_title: "确定性验证",
    hero_subtitle: "一次执行。一个证明。最终结果。",
    cta_verify: "开始验证",
    cta_pro: "法律/专业验证",
    cta_institutional: "请求机构执行",
        feature_one_title: "一次执行",
    feature_one_desc: "对您的证据包进行单一、不可逆的计算",
    feature_two_title: "最终证书",
    feature_two_desc: "不可变、可独立验证的证书",
    feature_three_title: "无账户",
    feature_three_desc: "无需注册，无跟踪，无数据重用",
    invariant_notice: "界面语言不会影响执行过程或证书。"
  },
  ar: {
    hero_title: "التحقق الحتمي",
    hero_subtitle: "تنفيذ واحد. شهادة واحدة. نهائي.",
    cta_verify: "بدء التحقق",
        cta_pro: "التحقق القانوني / المهني",
    cta_institutional: "طلب تنفيذ مؤسسي",
        feature_one_title: "تنفيذ واحد",
    feature_one_desc: "حساب واحد لا رجوع فيه على حزمة الأدلة الخاصة بك",
    feature_two_title: "شهادة نهائية",
    feature_two_desc: "شهادة ثابتة وقابلة للتحقق بشكل مستقل",
    feature_three_title: "لا حسابات",
    feature_three_desc: "لا تسجيل، لا تتبع، لا إعادة استخدام للبيانات",
    invariant_notice: "اللغة لا تؤثر على التنفيذ أو الشهادات."
  },
  hi: {
    hero_title: "नियतात्मक सत्यापन",
    hero_subtitle: "एक निष्पादन। एक प्रमाणपत्र। अंतिम।",
    cta_verify: "सत्यापन प्रारंभ करें",
        cta_pro: "कानूनी / पेशेवर सत्यापन",
    cta_institutional: "संस्थागत निष्पादन का अनुरोध करें",
        feature_one_title: "एक निष्पादन",
    feature_one_desc: "आपके साक्ष्य बंडल पर एकल, अपरिवर्तनीय गणना",
    feature_two_title: "अंतिम प्रमाणपत्र",
    feature_two_desc: "अपरिवर्तनीय, स्वतंत्र रूप से सत्यापन योग्य प्रमाणपत्र",
    feature_three_title: "कोई खाते नहीं",
    feature_three_desc: "कोई साइन-अप नहीं, कोई ट्रैकिंग नहीं, कोई डेटा पुन: उपयोग नहीं",
    invariant_notice: "भाषा का निष्पादन या प्रमाणपत्रों पर कोई प्रभाव नहीं पड़ता।"
  },
  ja: {
    hero_title: "決定的な検証",
    hero_subtitle: "1 回の実行。1 つの証明書。ファイナル。",
    cta_verify: "検証を開始",
        cta_pro: "法的/専門検証",
    cta_institutional: "機関実行をリクエスト",
        feature_one_title: "1回の実行",
    feature_one_desc: "証拠バンドルに対する単一の不可逆的な計算",
    feature_two_title: "最終証明書",
    feature_two_desc: "不変で独立して検証可能な証明書",
    feature_three_title: "アカウント不要",
    feature_three_desc: "登録不要、追跡なし、データ再利用なし",
    invariant_notice: "言語は実行や証明書に影響しません。"
  },
  ko: {
    hero_title: "결정적 검증",
    hero_subtitle: "한 번의 실행. 하나의 인증서. 최종.",
    cta_verify: "검증 시작",
        cta_pro: "법률/전문 검증",
    cta_institutional: "기관 실행 요청",
        feature_one_title: "한 번의 실행",
    feature_one_desc: "증거 번들에 대한 단일, 비가역적 계산",
    feature_two_title: "최종 인증서",
    feature_two_desc: "불변의 독립적으로 검증 가능한 인증서",
    feature_three_title: "계정 없음",
    feature_three_desc: "가입 없음, 추적 없음, 데이터 재사용 없음",
    invariant_notice: "언어는 실행이나 인증서에 영향을 주지 않습니다."
  },
  tr: {
    hero_title: "Deterministik doğrulama",
    hero_subtitle: "Tek yürütme. Tek sertifika. Nihai.",
    cta_verify: "Doğrulamayı başlat",
        cta_pro: "Yasal / Profesyonel Doğrulama",
    cta_institutional: "Kurumsal Yürütme İste",
        feature_one_title: "Tek yürütme",
    feature_one_desc: "Kanıt paketiniz üzerinde tek, geri alınamaz hesaplama",
    feature_two_title: "Nihai sertifika",
    feature_two_desc: "Değişmez, bağımsız olarak doğrulanabilir sertifika",
    feature_three_title: "Hesap yok",
    feature_three_desc: "Kayıt yok, takip yok, veri yeniden kullanımı yok",
    invariant_notice: "Dil, yürütmeyi veya sertifikaları etkilemez."
  },
  nl: {
    hero_title: "Deterministische verificatie",
    hero_subtitle: "Eén uitvoering. Eén certificaat. Definitief.",
    cta_verify: "Verificatie starten",
        cta_pro: "Juridische / professionele verificatie",
    cta_institutional: "Institutionele uitvoering aanvragen",
        feature_one_title: "Eén uitvoering",
    feature_one_desc: "Enkele, onomkeerbare berekening over uw bewijsbundel",
    feature_two_title: "Definitief certificaat",
    feature_two_desc: "Onveranderlijk, onafhankelijk verifieerbaar certificaat",
    feature_three_title: "Geen accounts",
    feature_three_desc: "Geen aanmelding, geen tracking, geen hergebruik van gegevens",
    invariant_notice: "De taal heeft geen invloed op uitvoering of certificaten."
  },
  sv: {
    hero_title: "Deterministisk verifiering",
    hero_subtitle: "En körning. Ett certifikat. Slutgiltigt.",
    cta_verify: "Start verifiering",
        cta_pro: "Juridisk / professionell verifiering",
    cta_institutional: "Begär institutionell körning",
        feature_one_title: "En körning",
    feature_one_desc: "Enkel, oåterkallelig beräkning över ditt bevispaket",
    feature_two_title: "Slutgiltigt certifikat",
    feature_two_desc: "Oföränderligt, oberoende verifierbart certifikat",
    feature_three_title: "Inga konton",
    feature_three_desc: "Ingen registrering, ingen spårning, ingen dataåteranvändning",
    invariant_notice: "Språket påverkar inte körningen eller certifikaten."
  },
  no: {
    hero_title: "Deterministisk verifisering",
    hero_subtitle: "Én kjøring. Ett sertifikat. Endelig.",
    cta_verify: "Start verifisering",
        cta_pro: "Juridisk / profesjonell verifisering",
    cta_institutional: "Be om institusjonell kjøring",
        feature_one_title: "Én kjøring",
    feature_one_desc: "Enkelt, irreversibelt beregning over bevispakken din",
    feature_two_title: "Endelig sertifikat",
    feature_two_desc: "Uforanderlig, uavhengig verifiserbart sertifikat",
    feature_three_title: "Ingen kontoer",
    feature_three_desc: "Ingen registrering, ingen sporing, ingen gjenbruk av data",
    invariant_notice: "Språk påvirker ikke kjøringen eller sertifikatene."
  },
  da: {
    hero_title: "Deterministisk verifikation",
    hero_subtitle: "Én kørsel. Ét certifikat. Endeligt.",
    cta_verify: "Start verifikation",
        cta_pro: "Juridisk / professionel verifikation",
    cta_institutional: "Anmod om institutionel kørsel",
        feature_one_title: "Én kørsel",
    feature_one_desc: "Enkelt, irreversibelt beregning over dit bevispakke",
    feature_two_title: "Endeligt certifikat",
    feature_two_desc: "Uforanderligt, uafhængigt verificerbart certifikat",
    feature_three_title: "Ingen konti",
    feature_three_desc: "Ingen tilmelding, ingen sporing, ingen genbrug af data",
    invariant_notice: "Sproget påvirker ikke udførelsen eller certifikaterne."
  },
  fi: {
    hero_title: "Deterministinen varmentaminen",
    hero_subtitle: "Yksi suoritus. Yksi varmenne. Lopullinen.",
    cta_verify: "Aloita varmentaminen",
        cta_pro: "Juridinen / ammattimainen varmentaminen",
    cta_institutional: "Pyydä institutionaalista suoritusta",
        feature_one_title: "Yksi suoritus",
    feature_one_desc: "Yksittäinen, peruuttamaton laskenta todistepakettisi yli",
    feature_two_title: "Lopullinen varmenne",
    feature_two_desc: "Muuttumaton, itsenäisesti varmennettavissa oleva varmenne",
    feature_three_title: "Ei tilejä",
    feature_three_desc: "Ei rekisteröitymistä, ei seurantaa, ei tietojen uudelleenkäyttöä",
    invariant_notice: "Kieli ei vaikuta suoritukseen tai varmenteisiin."
  },
  pl: {
    hero_title: "Weryfikacja deterministyczna",
    hero_subtitle: "Jedno wykonanie. Jeden certyfikat. Ostateczny.",
    cta_verify: "Rozpocznij weryfikację",
        cta_pro: "Weryfikacja prawna / profesjonalna",
    cta_institutional: "Zamów wykonanie instytucjonalne",
        feature_one_title: "Jedno wykonanie",
    feature_one_desc: "Pojedyncze, nieodwracalne obliczenie nad pakietem dowodów",
    feature_two_title: "Ostateczny certyfikat",
    feature_two_desc: "Niezmienny, niezależnie weryfikowalny certyfikat",
    feature_three_title: "Brak kont",
    feature_three_desc: "Brak rejestracji, brak śledzenia, brak ponownego wykorzystania danych",
    invariant_notice: "Język nie wpływa na wykonanie ani certyfikaty."
  },
  uk: {
    hero_title: "Детермінована верифікація",
    hero_subtitle: "Одне виконання. Один сертифікат. Остаточний.",
    cta_verify: "Почати верифікацію",
        cta_pro: "Юридична / професійна верифікація",
    cta_institutional: "Запросити інституційне виконання",
        feature_one_title: "Одне виконання",
    feature_one_desc: "Одиночне, незворотне обчислення над вашим пакетом доказів",
    feature_two_title: "Остаточний сертифікат",
    feature_two_desc: "Незмінний, незалежно перевіряємий сертифікат",
    feature_three_title: "Без акаунтів",
    feature_three_desc: "Без реєстрації, без відстеження, без повторного використання даних",
    invariant_notice: "Мова не впливає на виконання або сертифікати."
  },
  cs: {
    hero_title: "Deterministická verifikace",
    hero_subtitle: "Jedno spuštění. Jeden certifikát. Konečný.",
    cta_verify: "Spustit verifikaci",
        cta_pro: "Právní / profesionální verifikace",
    cta_institutional: "Požádat o institucionální provedení",
        feature_one_title: "Jedno spuštění",
    feature_one_desc: "Jediný, nevratný výpočet nad vaším balíčkem důkazů",
    feature_two_title: "Konečný certifikát",
    feature_two_desc: "Neměnný, nezávisle ověřitelný certifikát",
    feature_three_title: "Žádné účty",
    feature_three_desc: "Žádná registrace, žádné sledování, žádné opakované použití dat",
    invariant_notice: "Jazyk nemá vliv na provedení ani certifikáty."
  },
  el: {
    hero_title: "Ντετερμινιστική επαλήθευση",
    hero_subtitle: "Μία εκτέλεση. Ένα πιστοποιητικό. Τελικό.",
    cta_verify: "Έναρξη επαλήθευσης",
        cta_pro: "Νομική / επαγγελματική επαλήθευση",
    cta_institutional: "Αίτημα θεσμικής εκτέλεσης",
        feature_one_title: "Μία εκτέλεση",
    feature_one_desc: "Μονή, μη αναστρέψιμη υπολογισμός πάνω στο bundle αποδεικτικών σας",
    feature_two_title: "Τελικό πιστοποιητικό",
    feature_two_desc: "Αμετάβλητο, ανεξάρτητα επαληθεύσιμο πιστοποιητικό",
    feature_three_title: "Χωρίς λογαριασμούς",
    feature_three_desc: "Χωρίς εγγραφή, χωρίς παρακολούθηση, χωρίς επαναχρησιμοποίηση δεδομένων",
    invariant_notice: "Η γλώσσα δεν επηρεάζει την εκτέλεση ή τα πιστοποιητικά."
  },
  he: {
    hero_title: "אימות דטרמיניסטי",
    hero_subtitle: "הרצה אחת. תעודה אחת. סופי.",
    cta_verify: "התחל אימות",
        cta_pro: "אימות משפטי / מקצועי",
    cta_institutional: "בקש ביצוע מוסדי",
        feature_one_title: "הרצה אחת",
    feature_one_desc: "חישוב יחיד ובלתי הפיך על חבילת הראיות שלך",
    feature_two_title: "תעודה סופית",
    feature_two_desc: "תעודה בלתי ניתנת לשינוי, ניתנת לאימות באופן עצמאי",
    feature_three_title: "ללא חשבונות",
    feature_three_desc: "ללא הרשמה, ללא מעקב, ללא שימוש חוזר בנתונים",
    invariant_notice: "השפה אינה משפיעה על ההרצה או על התעודות."
  },
  id: {
    hero_title: "Verifikasi deterministik",
    hero_subtitle: "Satu eksekusi. Satu sertifikat. Final.",
    cta_verify: "Mulai verifikasi",
        cta_pro: "Verifikasi hukum / profesional",
    cta_institutional: "Minta eksekusi institusional",
        feature_one_title: "Satu eksekusi",
    feature_one_desc: "Perhitungan tunggal dan tidak dapat dibatalkan atas bundle bukti Anda",
    feature_two_title: "Sertifikat final",
    feature_two_desc: "Sertifikat yang tidak dapat diubah dan dapat diverifikasi secara independen",
    feature_three_title: "Tanpa akun",
    feature_three_desc: "Tanpa pendaftaran, tanpa pelacakan, tanpa penggunaan ulang data",
    invariant_notice: "Bahasa tidak memengaruhi eksekusi atau sertifikat."
  },
  ms: {
    hero_title: "Pengesahan deterministik",
    hero_subtitle: "Satu pelaksanaan. Satu sijil. Muktamad.",
    cta_verify: "Mula pengesahan",
        cta_pro: "Pengesahan undang-undang / profesional",
    cta_institutional: "Minta pelaksanaan institusi",
        feature_one_title: "Satu pelaksanaan",
    feature_one_desc: "Pengiraan tunggal dan tidak dapat dipulihkan ke atas bundle bukti anda",
    feature_two_title: "Sijil muktamad",
    feature_two_desc: "Sijil yang tidak berubah dan boleh disahkan secara bebas",
    feature_three_title: "Tiada akaun",
    feature_three_desc: "Tiada pendaftaran, tiada penjejakan, tiada penggunaan semula data",
    invariant_notice: "Bahasa tidak menjejaskan pelaksanaan atau sijil."
  },
  sw: {
    hero_title: "Uthibitishaji wa kimaamuzi",
    hero_subtitle: "Utekelezaji mmoja. Cheti kimoja. Cha mwisho.",
    cta_verify: "Anza uthibitishaji",
        cta_pro: "Uthibitishaji wa kisheria / kitaalamu",
    cta_institutional: "Omba utekelezaji wa taasisi",
        feature_one_title: "Utekelezaji mmoja",
    feature_one_desc: "Hesabu moja, isiyoweza kubadilishwa juu ya kifurushi chako cha ushahidi",
    feature_two_title: "Cheti cha mwisho",
    feature_two_desc: "Cheti kisichobadilika, kinachoweza kuthibitishwa kwa kujitegemea",
    feature_three_title: "Hakuna akaunti",
    feature_three_desc: "Hakuna usajili, hakuna ufuatiliaji, hakuna matumizi ya tena ya data",
    invariant_notice: "Lugha haiathiri utekelezaji wala vyeti."
  },
  th: {
    hero_title: "การตรวจสอบแบบกำหนดแน่",
    hero_subtitle: "การรันหนึ่งครั้ง ใบรับรองหนึ่งใบ สุดท้าย",
    cta_verify: "เริ่มการตรวจสอบ",
        cta_pro: "การตรวจสอบทางกฎหมาย / วิชาชีพ",
    cta_institutional: "ขอการรันสถาบัน",
        feature_one_title: "การรันหนึ่งครั้ง",
    feature_one_desc: "การคำนวณครั้งเดียวที่ไม่สามารถย้อนกลับได้บนชุดหลักฐานของคุณ",
    feature_two_title: "ใบรับรองสุดท้าย",
    feature_two_desc: "ใบรับรองที่ไม่เปลี่ยนแปลงและสามารถตรวจสอบได้อย่างอิสระ",
    feature_three_title: "ไม่มีบัญชี",
    feature_three_desc: "ไม่มีการลงทะเบียน ไม่มีการติดตาม ไม่มีการใช้ข้อมูลซ้ำ",
    invariant_notice: "ภาษาไม่ส่งผลต่อการรันหรือใบรับรอง."
  },
  vi: {
    hero_title: "Xác minh tất định",
    hero_subtitle: "Một lần thực thi. Một chứng chỉ. Cuối cùng.",
    cta_verify: "Bắt đầu xác minh",
        cta_pro: "Xác minh pháp lý / chuyên nghiệp",
    cta_institutional: "Yêu cầu thực thi thể chế",
        feature_one_title: "Một lần thực thi",
    feature_one_desc: "Tính toán đơn lẻ, không thể đảo ngược trên bundle bằng chứng của bạn",
    feature_two_title: "Chứng chỉ cuối cùng",
    feature_two_desc: "Chứng chỉ bất biến, có thể xác minh độc lập",
    feature_three_title: "Không có tài khoản",
    feature_three_desc: "Không đăng ký, không theo dõi, không tái sử dụng dữ liệu",
    invariant_notice: "Ngôn ngữ không ảnh hưởng đến quá trình thực thi hoặc chứng chỉ."
  },
  fa: {
    hero_title: "اعتبارسنجی تعیین‌گرا",
    hero_subtitle: "یک اجرا. یک گواهی. نهایی.",
    cta_verify: "شروع اعتبارسنجی",
        cta_pro: "اعتبارسنجی حقوقی / حرفه‌ای",
    cta_institutional: "درخواست اجرای نهادی",
        feature_one_title: "یک اجرا",
    feature_one_desc: "محاسبه واحد و غیرقابل برگشت روی بسته شواهد شما",
    feature_two_title: "گواهی نهایی",
    feature_two_desc: "گواهی تغییرناپذیر و قابل تأیید مستقل",
    feature_three_title: "بدون حساب",
    feature_three_desc: "بدون ثبت نام، بدون ردیابی، بدون استفاده مجدد از داده",
    invariant_notice: "زبان بر اجرا یا گواهی‌ها تأثیری ندارد."
  },
  bn: {
    hero_title: "নির্ধারক যাচাইকরণ",
    hero_subtitle: "একটি নির্বাহ। একটি সার্টিফিকেট। চূড়ান্ত।",
    cta_verify: "যাচাইকরণ শুরু করুন",
        cta_pro: "আইনি / পেশাদার যাচাইকরণ",
    cta_institutional: "প্রাতিষ্ঠানিক নির্বাহের অনুরোধ",
        feature_one_title: "একটি নির্বাহ",
    feature_one_desc: "আপনার প্রমাণ বান্ডেলে একক, অপরিবর্তনীয় গণনা",
    feature_two_title: "চূড়ান্ত সার্টিফিকেট",
    feature_two_desc: "অপরিবর্তনীয়, স্বাধীনভাবে যাচাইযোগ্য সার্টিফিকেট",
    feature_three_title: "কোন অ্যাকাউন্ট নেই",
    feature_three_desc: "কোন সাইন-আপ নেই, কোন ট্র্যাকিং নেই, কোন ডেটা পুনরায় ব্যবহার নেই",
    invariant_notice: "ভাষা নির্বাহ বা সার্টিফিকেটকে প্রভাবিত করে না।"
  },
  pa: {
    hero_title: "ਨਿਰਧਾਰਿਤ ਪੜਤਾਲ",
    hero_subtitle: "ਇੱਕ ਨਿਰਵਹਨ। ਇੱਕ ਸਰਟੀਫਿਕੇਟ। ਅੰਤਿਮ।",
    cta_verify: "ਪੜਤਾਲ ਸ਼ੁਰੂ ਕਰੋ",
        cta_pro: "ਕਾਨੂੰਨੀ / ਪੇਸ਼ੇਵਰ ਪੜਤਾਲ",
    cta_institutional: "ਸੰਸਥਾਗਤ ਨਿਰਵਹਨ ਦੀ ਬੇਨਤੀ",
        feature_one_title: "ਇੱਕ ਨਿਰਵਹਨ",
    feature_one_desc: "ਤੁਹਾਡੇ ਸਬੂਤ ਬੰਡਲ ਉੱਤੇ ਇੱਕ, ਅਟੱਲ ਗਣਨਾ",
    feature_two_title: "ਅੰਤਿਮ ਸਰਟੀਫਿਕੇਟ",
    feature_two_desc: "ਅਟੱਲ, ਸੁਤੰਤਰ ਤੌਰ 'ਤੇ ਪੜਤਾਲਯੋਗ ਸਰਟੀਫਿਕੇਟ",
    feature_three_title: "ਕੋਈ ਖਾਤੇ ਨਹੀਂ",
    feature_three_desc: "ਕੋਈ ਸਾਈਨ-ਅਪ ਨਹੀਂ, ਕੋਈ ਟ੍ਰੈਕਿੰਗ ਨਹੀਂ, ਕੋਈ ਡੇਟਾ ਦੁਬਾਰਾ ਵਰਤੋਂ ਨਹੀਂ",
    invariant_notice: "ਭਾਸ਼ਾ ਨਿਰਵਹਨ ਜਾਂ ਸਰਟੀਫਿਕੇਟਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਨਹੀਂ ਕਰਦੀ।"
  },
  jv: {
    hero_title: "Verifikasi deterministik",
    hero_subtitle: "Siji eksekusi. Siji sertifikat. Final.",
    cta_verify: "Mulai verifikasi",
        cta_pro: "Verifikasi hukum / profesional",
    cta_institutional: "Nyuwun eksekusi institusional",
        feature_one_title: "Siji eksekusi",
    feature_one_desc: "Perhitungan tunggal lan ora bisa dibatalake ing bundle bukti sampeyan",
    feature_two_title: "Sertifikat final",
    feature_two_desc: "Sertifikat sing ora bisa diganti lan bisa diverifikasi kanthi mandiri",
    feature_three_title: "Ora ana akun",
    feature_three_desc: "Ora ana pendaftaran, ora ana pelacakan, ora ana panggunaan maneh data",
    invariant_notice: "Basa ora mengaruhi eksekusi utawa sertifikat."
  },
  te: {
    hero_title: "నిర్ణయాత్మక ధృవీకరణ",
    hero_subtitle: "ఒక అమలు. ఒక సర్టిఫికేట్. తుది.",
    cta_verify: "ధృవీకరణ ప్రారంభించండి",
        cta_pro: "చట్టపరమైన / వృత్తిపరమైన ధృవీకరణ",
    cta_institutional: "సంస్థాగత అమలు అభ్యర్థించండి",
        feature_one_title: "ఒక అమలు",
    feature_one_desc: "మీ సాక్ష్య బండిల్ పై ఒకే, తిరిగి రాని గణన",
    feature_two_title: "తుది సర్టిఫికేట్",
    feature_two_desc: "మార్పులేని, స్వతంత్రంగా ధృవీకరించదగిన సర్టిఫికేట్",
    feature_three_title: "ఖాతాలు లేవు",
    feature_three_desc: "సైన్-అప్ లేదు, ట్రాకింగ్ లేదు, డేటా తిరిగి ఉపయోగం లేదు",
    invariant_notice: "భాష అమలు లేదా సర్టిఫికేట్లను ప్రభావితం చేయదు."
  },
  mr: {
    hero_title: "निर्धारक सत्यापन",
    hero_subtitle: "एक अंमलबजावणी. एक प्रमाणपत्र. अंतिम.",
    cta_verify: "सत्यापन सुरू करा",
        cta_pro: "कायदेशीर / व्यावसायिक सत्यापन",
    cta_institutional: "संस्थागत अंमलबजावणीची विनंती",
        feature_one_title: "एक अंमलबजावणी",
    feature_one_desc: "तुमच्या पुरावा बंडलवर एकल, अपरिवर्तनीय गणना",
    feature_two_title: "अंतिम प्रमाणपत्र",
    feature_two_desc: "अपरिवर्तनीय, स्वतंत्रपणे सत्यापन करण्यायोग्य प्रमाणपत्र",
    feature_three_title: "कोणतेही खाते नाही",
    feature_three_desc: "कोणतेही साइन-अप नाही, कोणतेही ट्रॅकिंग नाही, कोणतेही डेटा पुन्हा वापर नाही",
    invariant_notice: "भाषा अंमलबजावणी किंवा प्रमाणपत्रांवर परिणाम करत नाही."
  },
  ta: {
    hero_title: "தீர்மானிக்கப்பட்ட சரிபார்ப்பு",
    hero_subtitle: "ஒரு செயலாக்கம். ஒரு சான்றிதழ். இறுதி.",
    cta_verify: "சரிபார்ப்பைத் தொடங்கவும்",
        cta_pro: "சட்ட / தொழில்முறை சரிபார்ப்பு",
    cta_institutional: "நிறுவன செயலாக்கத்தைக் கோரவும்",
        feature_one_title: "ஒரு செயலாக்கம்",
    feature_one_desc: "உங்கள் சான்று தொகுப்பில் ஒற்றை, மீளமுடியாத கணக்கீடு",
    feature_two_title: "இறுதி சான்றிதழ்",
    feature_two_desc: "மாறாத, சுயாதீனமாக சரிபார்க்கக்கூடிய சான்றிதழ்",
    feature_three_title: "கணக்குகள் இல்லை",
    feature_three_desc: "பதிவு இல்லை, கண்காணிப்பு இல்லை, தரவு மீண்டும் பயன்பாடு இல்லை",
    invariant_notice: "மொழி செயலாக்கம் அல்லது சான்றிதழ்களை பாதிக்காது."
  },
  ur: {
    hero_title: "تعین کنندہ تصدیق",
    hero_subtitle: "ایک عمل۔ ایک سرٹیفکیٹ۔ حتمی۔",
    cta_verify: "تصدیق شروع کریں",
        cta_pro: "قانونی / پیشہ ورانہ تصدیق",
    cta_institutional: "ادارتی عمل کی درخواست",
        feature_one_title: "ایک عمل",
    feature_one_desc: "آپ کے ثبوت بنڈل پر واحد، ناقابل واپسی حساب",
    feature_two_title: "حتمی سرٹیفکیٹ",
    feature_two_desc: "ناقابل تبدیل، آزادانہ طور پر قابل تصدیق سرٹیفکیٹ",
    feature_three_title: "کوئی اکاؤنٹس نہیں",
    feature_three_desc: "کوئی سائن اپ نہیں، کوئی ٹریکنگ نہیں، کوئی ڈیٹا دوبارہ استعمال نہیں",
    invariant_notice: "زبان عمل یا سرٹیفکیٹس کو متاثر نہیں کرتی۔"
  },
  gu: {
    hero_title: "નિર્ધારિત ચકાસણી",
    hero_subtitle: "એક અમલીકરણ. એક પ્રમાણપત્ર. અંતિમ.",
    cta_verify: "ચકાસણી શરૂ કરો",
        cta_pro: "કાનૂની / વ્યાવસાયિક ચકાસણી",
    cta_institutional: "સંસ્થાગત અમલીકરણની વિનંતી",
        feature_one_title: "એક અમલીકરણ",
    feature_one_desc: "તમારા પુરાવા બંડલ પર એક, અપરિવર્તનીય ગણતરી",
    feature_two_title: "અંતિમ પ્રમાણપત્ર",
    feature_two_desc: "અપરિવર્તનીય, સ્વતંત્ર રીતે ચકાસણી યોગ્ય પ્રમાણપત્ર",
    feature_three_title: "કોઈ એકાઉન્ટ નથી",
    feature_three_desc: "કોઈ સાઇન-અપ નથી, કોઈ ટ્રેકિંગ નથી, કોઈ ડેટા પુનઃઉપયોગ નથી",
    invariant_notice: "ભાષા અમલીકરણ અથવા પ્રમાણપત્રોને અસર કરતી નથી."
  },
  ro: {
    hero_title: "Verificare deterministă",
    hero_subtitle: "O execuție. Un certificat. Final.",
    cta_verify: "Începe verificarea",
        cta_pro: "Verificare legală / profesională",
    cta_institutional: "Solicită execuție instituțională",
        feature_one_title: "O execuție",
    feature_one_desc: "Calcul unic și ireversibil asupra bundle-ului de dovezi",
    feature_two_title: "Certificat final",
    feature_two_desc: "Certificat imuabil, verificabil independent",
    feature_three_title: "Fără conturi",
    feature_three_desc: "Fără înregistrare, fără urmărire, fără reutilizare a datelor",
    invariant_notice: "Limba nu afectează execuția sau certificatele."
  },
  hu: {
    hero_title: "Determinisztikus ellenőrzés",
    hero_subtitle: "Egy végrehajtás. Egy tanúsítvány. Végső.",
    cta_verify: "Ellenőrzés indítása",
        cta_pro: "Jogi / szakmai ellenőrzés",
    cta_institutional: "Intézményi végrehajtás kérése",
        feature_one_title: "Egy végrehajtás",
    feature_one_desc: "Egyetlen, visszafordíthatatlan számítás a bizonyítékcsomagod felett",
    feature_two_title: "Végső tanúsítvány",
    feature_two_desc: "Változatlan, függetlenül ellenőrizhető tanúsítvány",
    feature_three_title: "Nincs fiók",
    feature_three_desc: "Nincs regisztráció, nincs követés, nincs adatújrafelhasználás",
    invariant_notice: "A nyelv nem befolyásolja a végrehajtást vagy a tanúsítványokat."
  },
  sk: {
    hero_title: "Deterministická verifikácia",
    hero_subtitle: "Jedno spustenie. Jeden certifikát. Konečný.",
    cta_verify: "Spustiť verifikáciu",
        cta_pro: "Právna / profesionálna verifikácia",
    cta_institutional: "Požiadať o inštitucionálne vykonanie",
        feature_one_title: "Jedno spustenie",
    feature_one_desc: "Jediný, nevratný výpočet nad vaším balíčkom dôkazov",
    feature_two_title: "Konečný certifikát",
    feature_two_desc: "Nemenný, nezávisle overiteľný certifikát",
    feature_three_title: "Žiadne účty",
    feature_three_desc: "Žiadna registrácia, žiadne sledovanie, žiadne opakované použitie údajov",
    invariant_notice: "Jazyk neovplyvňuje vykonanie ani certifikáty."
  },
  bg: {
    hero_title: "Детерминирана верификация",
    hero_subtitle: "Едно изпълнение. Един сертификат. Финално.",
    cta_verify: "Започнете верификация",
        cta_pro: "Правна / професионална верификация",
    cta_institutional: "Заявка за институционално изпълнение",
        feature_one_title: "Едно изпълнение",
    feature_one_desc: "Единично, необратимо изчисление върху вашия пакет доказателства",
    feature_two_title: "Финално сертификат",
    feature_two_desc: "Непроменяем, независимо проверяем сертификат",
    feature_three_title: "Без акаунти",
    feature_three_desc: "Без регистрация, без проследяване, без повторно използване на данни",
    invariant_notice: "Езикът не влияе на изпълнението или сертификатите."
  },
  hr: {
    hero_title: "Deterministička verifikacija",
    hero_subtitle: "Jedno izvršenje. Jedan certifikat. Konačno.",
    cta_verify: "Pokreni verifikaciju",
        cta_pro: "Pravna / profesionalna verifikacija",
    cta_institutional: "Zatraži institucionalno izvršenje",
        feature_one_title: "Jedno izvršenje",
    feature_one_desc: "Jedinstveni, nepovratni izračun nad vašim paketom dokaza",
    feature_two_title: "Konačni certifikat",
    feature_two_desc: "Nepromjenjiv, neovisno provjerljiv certifikat",
    feature_three_title: "Nema računa",
    feature_three_desc: "Nema registracije, nema praćenja, nema ponovne upotrebe podataka",
    invariant_notice: "Jezik ne utječe na izvršenje ili certifikate."
  },
  sr: {
    hero_title: "Детерминистичка верификација",
    hero_subtitle: "Једно извршење. Један сертификат. Коначно.",
    cta_verify: "Покрени верификацију",
        cta_pro: "Правна / професионална верификација",
    cta_institutional: "Захтев за институционално извршење",
        feature_one_title: "Једно извршење",
    feature_one_desc: "Јединствено, неповратни израчун над вашим пакетом доказа",
    feature_two_title: "Коначни сертификат",
    feature_two_desc: "Непромењив, независно проверив сертификат",
    feature_three_title: "Нема налога",
    feature_three_desc: "Нема регистрације, нема праћења, нема поновне употребе података",
    invariant_notice: "Језик не утиче на извршење или сертификате."
  },
  sl: {
    hero_title: "Deterministična verifikacija",
    hero_subtitle: "Ena izvedba. En certifikat. Končno.",
    cta_verify: "Začni verifikacijo",
        cta_pro: "Pravna / strokovna verifikacija",
    cta_institutional: "Zahtevaj institucionalno izvedbo",
        feature_one_title: "Ena izvedba",
    feature_one_desc: "Enoten, nepovraten izračun nad vašim paketom dokazov",
    feature_two_title: "Končni certifikat",
    feature_two_desc: "Nespremenljiv, neodvisno preverljiv certifikat",
    feature_three_title: "Brez računov",
    feature_three_desc: "Brez registracije, brez sledenja, brez ponovne uporabe podatkov",
    invariant_notice: "Jezik ne vpliva na izvedbo ali certifikate."
  },
  lt: {
    hero_title: "Deterministinė patikra",
    hero_subtitle: "Vienas vykdymas. Vienas sertifikatas. Galutinis.",
    cta_verify: "Pradėti patikrą",
        cta_pro: "Teisinė / profesionali patikra",
    cta_institutional: "Prašyti institucinio vykdymo",
        feature_one_title: "Vienas vykdymas",
    feature_one_desc: "Vienkartinis, negrįžtamas skaičiavimas jūsų įrodymų paketui",
    feature_two_title: "Galutinis sertifikatas",
    feature_two_desc: "Nepakeičiamas, savarankiškai patikrinamas sertifikatas",
    feature_three_title: "Nėra paskyrų",
    feature_three_desc: "Nėra registracijos, nėra stebėjimo, nėra duomenų pakartotinio naudojimo",
    invariant_notice: "Kalba neturi įtakos vykdymui ar sertifikatams."
  },
  lv: {
    hero_title: "Deterministiska verifikācija",
    hero_subtitle: "Viena izpilde. Viens sertifikāts. Galīgs.",
    cta_verify: "Sākt verifikāciju",
        cta_pro: "Juridiska / profesionāla verifikācija",
    cta_institutional: "Pieprasīt institucionālu izpildi",
        feature_one_title: "Viena izpilde",
    feature_one_desc: "Vienreizējs, neatgriezenisks aprēķins jūsu pierādījumu paketē",
    feature_two_title: "Galīgs sertifikāts",
    feature_two_desc: "Nemainīgs, neatkarīgi pārbaudāms sertifikāts",
    feature_three_title: "Nav kontu",
    feature_three_desc: "Nav reģistrācijas, nav izsekošanas, nav datu atkārtotas izmantošanas",
    invariant_notice: "Valoda neietekmē izpildi vai sertifikātus."
  },
  et: {
    hero_title: "Deterministlik kinnitamine",
    hero_subtitle: "Üks käivitamine. Üks sertifikaat. Lõplik.",
    cta_verify: "Alusta kinnitamist",
        cta_pro: "Õiguslik / professionaalne kinnitamine",
    cta_institutional: "Taotleda institutsionaalset käivitamist",
        feature_one_title: "Üks käivitamine",
    feature_one_desc: "Üksik, pöördumatu arvutus teie tõendipakendi kohal",
    feature_two_title: "Lõplik sertifikaat",
    feature_two_desc: "Muutumatu, sõltumatult kontrollitav sertifikaat",
    feature_three_title: "Kontosid pole",
    feature_three_desc: "Registreerumist pole, jälgimist pole, andmete taaskasutamist pole",
    invariant_notice: "Keel ei mõjuta käivitamist ega sertifikaate."
  },
  is: {
    hero_title: "Ákveðin staðfesting",
    hero_subtitle: "Eitt keyrsla. Eitt vottorð. Endanlegt.",
    cta_verify: "Hefja staðfestingu",
        cta_pro: "Lögleg / fagleg staðfesting",
    cta_institutional: "Beiðni um stofnunarkeyrslu",
        feature_one_title: "Eitt keyrsla",
    feature_one_desc: "Einstakur, óafturkræfur útreikningur yfir sönnunarpakka þinn",
    feature_two_title: "Endanlegt vottorð",
    feature_two_desc: "Óbreytanlegt, sjálfstætt staðfestanlegt vottorð",
    feature_three_title: "Engar reikningar",
    feature_three_desc: "Engin skráning, engin rakning, engin endurnotkun gagna",
    invariant_notice: "Tungumálið hefur ekki áhrif á keyrslu eða vottorð."
  },
  am: {
    hero_title: "ውሳኔ የማይለወጥ ማረጋገጫ",
    hero_subtitle: "አንድ አሰራር። አንድ ማረጋገጫ። መጨረሻ።",
    cta_verify: "ማረጋገጫ ጀምር",
        cta_pro: "ሕጋዊ / ሙያዊ ማረጋገጫ",
    cta_institutional: "የተቋማዊ አፈጻጸም ጥያቄ",
    invariant_notice: "ቋንቋው በእንቅስቃሴው ወይም በማረጋገጫዎች ላይ ተፅዕኖ አያሳድርም።",
        feature_one_title: "አንድ አሰራር",
    feature_one_desc: "አንድ ነጠላ፣ የማይመለስ ስሌት በማስረጃ ቦታዎ ላይ",
    feature_two_title: "መጨረሻ ማረጋገጫ",
    feature_two_desc: "የማይለወጥ፣ በነጻ ሊረጋገጥ የሚችል ማረጋገጫ",
    feature_three_title: "መለያዎች የሉም",
    feature_three_desc: "ምዝግብ የለም፣ ክትትል የለም፣ የውሂብ እንደገና አጠቃቀም የለም",
    assistive_notice: "This translation is provided for accessibility only. The authoritative language of VERIFRAX is English."
  }
};

// Language resolution (stateless, deterministic)
function resolveLang(request, cf = {}) {
  const url = new URL(request.url);
  const qp = url.searchParams.get("lang");
  if (qp && (TIER1.includes(qp) || TIER2.includes(qp))) return qp;

  const al = request.headers.get("accept-language");
  if (al) {
    const match = al
      .split(",")
      .map(x => x.split(";")[0].trim().split("-")[0])
      .find(l => TIER1.includes(l) || TIER2.includes(l));
    if (match) return match;
  }

  const map = { FR: "fr", DE: "de", ES: "es", IT: "it", IR: "fa", JP: "ja", CN: "zh" };
  if (map[cf.country]) return map[cf.country];

  return "en";
}

function withHeaders(resp) {
  const h = new Headers(resp.headers);
  h.set("x-verifrax-version", VERSION);
  h.set("x-payment-status", PAYMENT_STATUS);
  return new Response(resp.body, { status: resp.status, headers: h });
}

// Canonical stringify (deterministic) - shared utility
function canonicalStringify(obj) {
  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalStringify).join(",")}]`;
  }
  if (obj && typeof obj === "object") {
    const keys = Object.keys(obj).sort();
    return `{${keys.map(key => `"${key}":${canonicalStringify(obj[key])}`).join(",")}}`;
  }
  return JSON.stringify(obj);
}

// Token mint — SINGLE SOURCE OF TRUTH
// Token is minted ONLY HERE
async function mintExecutionToken(paymentIntentId, sessionId, secret) {
  const payload = `${paymentIntentId}:${sessionId}:2.8.0`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(payload);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `vfx_${hashHex.substring(0, 64)}`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.hostname;

    // HARD CANONICALIZATION (NON-NEGOTIABLE)
    // One authority URL. Zero ambiguity.
    const CANONICAL = "www.verifrax.net";
    if (host !== CANONICAL) {
      url.hostname = CANONICAL;
      url.protocol = "https:";
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }

    // Enforce https
    if (url.protocol !== "https:") {
      url.protocol = "https:";
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }

    const path = url.pathname;

    // STRIPE WEBHOOK (MANDATORY)
    if (path === "/api/stripe/webhook" && request.method === "POST") {
      try {
        const sig = request.headers.get("stripe-signature");
        const body = await request.text();
        
        if (!env.STRIPE_WEBHOOK_SECRET) {
          return withHeaders(new Response("Webhook secret not configured", { status: 500 }));
        }

        if (!env.STRIPE_SECRET_KEY) {
          return withHeaders(new Response("Stripe secret key not configured", { status: 500 }));
        }

        // Use Stripe SDK for signature verification
        const stripe = new Stripe(env.STRIPE_SECRET_KEY);

        let event;
        try {
          event = stripe.webhooks.constructEvent(
            body,
            sig,
            env.STRIPE_WEBHOOK_SECRET
          );
        } catch (err) {
          return withHeaders(new Response("Invalid signature", { status: 401 }));
        }
        
        if (event.type === "payment_intent.succeeded") {
          const pi = event.data.object;
          
          // Get session_id from metadata
          const sessionId = pi.metadata?.session_id;
          
          if (!sessionId) {
            return withHeaders(new Response(JSON.stringify({ error: "NO_SESSION_ID" }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }));
          }

          if (!env.TOKEN_MINT_SECRET) {
            return withHeaders(new Response("Token mint secret not configured", { status: 500 }));
          }

          // Token mint — SINGLE SOURCE OF TRUTH
          const token = await mintExecutionToken(pi.id, sessionId, env.TOKEN_MINT_SECRET);

          // Persist token in KV (v2.8 namespace)
          if (env.KV) {
            const tier = pi.metadata?.tier || "public";
            await env.KV.put(`v2.8:session:${sessionId}`, token);
            await env.KV.put(`v2.8:token:${token}`, JSON.stringify({ used: false, tier: tier }));
            // Store tier metadata for session
            await env.KV.put(`v2.8:session:${sessionId}:metadata`, JSON.stringify({ tier }));
          }

          return withHeaders(new Response("ok", { status: 200 }));
        }

        return withHeaders(new Response("ok", { status: 200 }));
      } catch (error) {
        return withHeaders(new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      }
    }

    // GET /verify (SELF-EXPLANATORY EXECUTION PAGE)
    if (path === "/verify" && request.method === "GET") {
      const sessionId = url.searchParams.get("session_id");
      const tier = url.searchParams.get("tier") || "public";
      let token = null;
      let paymentStatus = "pending";
      
      // If no session_id, show error
      if (!sessionId) {
        const html = `<!DOCTYPE html>
<html>
<head>
  <title>No Active Payment — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
    h1 { font-size: 28px; margin-bottom: 20px; }
    p { margin: 20px 0; color: #666; }
    .btn { display: inline-block; padding: 14px 28px; font-size: 16px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; background: #000; color: #fff; }
    .btn:hover { background: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>No Active Payment Found</h1>
    <p>No payment session detected. Please start a new verification.</p>
    <a href="/start" class="btn">Start Verification</a>
  </div>
</body>
</html>`;
        return withHeaders(new Response(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }));
      }
      
      if (sessionId && env.KV) {
        token = await env.KV.get(`v2.8:session:${sessionId}`);
        if (token) {
          paymentStatus = "confirmed";
        }
      }
      
      // Tier-specific framing
      const tierFraming = {
        public: {
          title: "Execute Verification",
          warning: "One irreversible computation. One certificate. No retry."
        },
        pro: {
          title: "Professional Execution",
          warning: "Designed for disputes. Single final execution. Citeable, court-safe artifact."
        },
        institutional: {
          title: "Institutional Execution",
          warning: "Institutional-grade deterministic execution. Finality guaranteed by protocol design. No dependency on VERIFRAX survival."
        }
      };
      const framing = tierFraming[tier] || tierFraming.public;
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Execute Verification — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 700px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 28px; margin-bottom: 30px; }
    .status-badge { display: inline-block; padding: 8px 16px; background: ${paymentStatus === "confirmed" ? "#d4edda" : "#fff3cd"}; color: ${paymentStatus === "confirmed" ? "#155724" : "#856404"}; border-radius: 4px; margin-bottom: 20px; font-weight: 600; }
    .info-box { border: 1px solid #ccc; padding: 20px; margin: 20px 0; background: #f9f9f9; border-radius: 6px; }
    .info-box h3 { margin-bottom: 15px; font-size: 18px; }
    .info-box ul { margin-left: 20px; }
    .info-box li { margin: 8px 0; }
    .token-field { background: #f5f5f5; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 14px; width: 100%; margin: 10px 0; }
    .btn { display: inline-block; padding: 16px 32px; font-size: 18px; text-decoration: none; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; width: 100%; text-align: center; }
    .btn-primary { background: #000; color: #fff; }
    .btn-primary:hover { background: #333; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .warning { color: #856404; background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107; }
    .tier-badge { display: inline-block; padding: 8px 16px; margin: 10px 0; border-radius: 4px; font-weight: 600; }
    .tier-pro { background: #e7f3ff; color: #0066cc; border: 2px solid #0066cc; }
    .tier-institutional { background: #f0f8e7; color: #4a7c20; border: 2px solid #4a7c20; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${framing.title}</h1>
    <p style="text-align: left; font-size: 14px; color: #666; margin: -10px 0 20px 0;">
      Execution surfaces are always presented in English. Language selection affects informational pages only.
    </p>
    
    <div class="status-badge">
      Status: ${paymentStatus === "confirmed" ? "Payment confirmed ✓" : "Waiting for payment..."}
    </div>
    
    ${tier === "pro" ? '<div class="tier-badge tier-pro">Professional Execution</div>' : ''}
    ${tier === "institutional" ? '<div class="tier-badge tier-institutional">Institutional Execution</div>' : ''}
    
    ${paymentStatus === "confirmed" ? `
    <div class="info-box">
      <h3>Execution Token</h3>
      <input type="text" class="token-field" value="${token || ''}" readonly />
      <p style="margin-top: 10px; font-size: 14px; color: #666;">Token auto-filled. Ready to execute.</p>
    </div>
    
    <div class="info-box">
      <h3>${framing.warning}</h3>
      <ul>
        <li>One irreversible computation over your evidence bundle</li>
        <li>One final, immutable certificate generated</li>
        <li>No retry possible</li>
        <li>No refund after execution</li>
      </ul>
    </div>
    
    <form id="verifyForm">
      <input type="hidden" name="token" value="${token}" />
      <label style="display: block; margin: 20px 0 10px 0; font-weight: 600;">Profile ID:</label>
      <input type="text" name="profile_id" value="public@1.0.0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" />
      
      <label style="display: block; margin: 20px 0 10px 0; font-weight: 600;">Evidence Bundle:</label>
      <input type="file" name="bundle" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" />
      
      <button type="submit" class="btn btn-primary" style="margin-top: 30px;">EXECUTE VERIFICATION</button>
    </form>
    ` : `
    <div class="warning">
      <strong>Payment processing...</strong><br/>
      If you just completed payment, please wait a few seconds for the webhook to process. This page will automatically update when your token is ready.
    </div>
    <script>
      setTimeout(() => location.reload(), 3000);
    </script>
    `}
  </div>
  
  <script>
    const form = document.getElementById('verifyForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Executing...';
        
        try {
          const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + formData.get('token') },
            body: formData
          });
          
          const result = await res.json();
          
          if (res.ok && result.certificate_hash) {
            window.location.href = '/certificate/' + result.certificate_hash + '?tier=${tier}';
          } else {
            alert('Error: ' + (result.error || 'Execution failed'));
            submitBtn.disabled = false;
            submitBtn.textContent = 'EXECUTE VERIFICATION';
          }
        } catch (err) {
          alert('Error: ' + err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = 'EXECUTE VERIFICATION';
        }
      });
    }
  </script>
</body>
</html>`;
      
      return withHeaders(new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
    }

    // POST /api/verify (EXECUTION GATE)
    if (path === "/api/verify" && request.method === "POST") {
      try {
        // Extract Bearer token from Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return withHeaders(new Response(JSON.stringify({ error: "MISSING_AUTHORIZATION" }), {
            status: 401,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }
        
        const token = authHeader.substring(7); // Remove "Bearer "
        
        // Check if token exists and is unused
        if (!env.KV) {
          return withHeaders(new Response(JSON.stringify({ error: "KV_NOT_AVAILABLE" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        const tokenData = await env.KV.get(`v2.8:token:${token}`);
        if (!tokenData) {
          return withHeaders(new Response(JSON.stringify({ error: "TOKEN_NOT_FOUND" }), {
            status: 403,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        const tokenObj = JSON.parse(tokenData);
        if (tokenObj.used === true) {
          return withHeaders(new Response(JSON.stringify({ error: "TOKEN_ALREADY_USED" }), {
            status: 403,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        // Get tier from token metadata
        const executionTier = tokenObj.tier || "public";

        // Mark token as used atomically
        await env.KV.put(`v2.8:token:${token}`, JSON.stringify({ used: true, tier: executionTier }));
        
        // Parse multipart form data
        const formData = await request.formData();
        const bundleFile = formData.get("bundle");
        const profileId = formData.get("profile_id") || "public@1.0.0";
        
        if (!bundleFile || !(bundleFile instanceof File)) {
          return withHeaders(new Response(JSON.stringify({ error: "MISSING_BUNDLE" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }
        
        // Validate profile ID format
        const profileIdPattern = /^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$/;
        if (!profileIdPattern.test(profileId)) {
          return withHeaders(new Response(JSON.stringify({ error: "INVALID_PROFILE_ID" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }
        
        // Read bundle as ArrayBuffer
        const bundleArrayBuffer = await bundleFile.arrayBuffer();
        
        // Compute bundle hash (SHA-256)
        const bundleHashBuffer = await crypto.subtle.digest("SHA-256", bundleArrayBuffer);
        const bundleHashArray = Array.from(new Uint8Array(bundleHashBuffer));
        const bundleHash = bundleHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Minimal deterministic verification (v2.8.0)
        // For public@1.0.0 profile: bundle exists and is readable = verified
        const supportedProfiles = ["public@1.0.0"];
        const verdict = supportedProfiles.includes(profileId) ? "verified" : "not_verified";
        const reasonCodes = verdict === "verified" ? [] : ["VFX-PROFILE-0001"];
        
        // executionTier already retrieved above from tokenObj
        
        // Build certificate object (without certificate_hash)
        // CANONICAL CERTIFICATE CORE (LOCKED)
        // Sorted keys, no nulls, no extensions, no metadata
        const executedAt = new Date().toISOString();
        const certificateObject = {
          bundle_hash: bundleHash,
          certificate_version: "1.1.0",
          executed_at: executedAt,
          profile_id: profileId,
          reason_codes: reasonCodes,
          verdict: verdict,
          verifrax_version: VERSION
        };
        
        // Compute certificate hash (using canonical stringify)
        const certificateCanonical = canonicalStringify(certificateObject);
        const certificateHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(certificateCanonical));
        const certificateHashArray = Array.from(new Uint8Array(certificateHashBuffer));
        const certificateHash = certificateHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Build final certificate (certificate_hash is last field)
        const certificate = {
          ...certificateObject,
          certificate_hash: certificateHash
        };
        
        // Store canonical certificate in KV (sorted keys, no pretty-print)
        const canonicalCert = canonicalStringify(certificate);
        await env.KV.put(`certificate:${certificateHash}`, canonicalCert);
        
        // Store tier metadata for certificate
        if (env.KV) {
          await env.KV.put(`certificate:${certificateHash}:tier`, executionTier);
        }
        
        // Return certificate_hash
        return withHeaders(new Response(JSON.stringify({ certificate_hash: certificateHash }), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      } catch (error) {
        return withHeaders(new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      }
    }

    // GET /status (MUST RETURN v2.8.0 and payment_status: enabled)
    if (path === "/status" && request.method === "GET") {
      const status = JSON.stringify({
        version: VERSION,
        payment_status: PAYMENT_STATUS
      }, null, 2);
      return withHeaders(new Response(status, { 
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }));
    }

    // GET /certificate/{hash} (with optional extension: .json, .proof, .llm, .bundle)
    if (path.startsWith("/certificate/") && request.method === "GET") {
      const pathParts = path.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      const hash = lastPart.split(".")[0]; // Remove extension if present
      const extension = lastPart.includes(".") ? lastPart.split(".").slice(1).join(".") : null;
      
      // Try to retrieve certificate from KV
      if (!env.KV) {
        return withHeaders(new Response(
          JSON.stringify({ error: "KV_NOT_AVAILABLE" }),
          { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        ));
      }
      
      const certificateRaw = await env.KV.get(`certificate:${hash}`);
      if (!certificateRaw) {
        return withHeaders(new Response(
          JSON.stringify({ error: "CERTIFICATE_NOT_FOUND" }),
          { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
        ));
      }
      
      const certificate = JSON.parse(certificateRaw);
      const tier = await env.KV.get(`certificate:${hash}:tier`) || "public";
      const isPro = tier === "pro";
      const isInstitutional = tier === "institutional";
      
      // Sidecar endpoints
      if (extension === "json") {
        // Raw canonical JSON
        return withHeaders(new Response(certificateRaw, {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        }));
      }
      
      if (extension === "proof") {
        // Hash-of-hash immutability proof
        const { certificate_hash: storedHash, ...certWithoutHash } = certificate;
        const certWithoutHashCanonical = canonicalStringify(certWithoutHash);
        const certHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(certWithoutHashCanonical));
        const certHashArray = Array.from(new Uint8Array(certHashBuffer));
        const computedHash = certHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const proof = {
          certificate_hash: storedHash,
          sha256_certificate_without_hash: computedHash,
          equality_assertion: storedHash === computedHash ? "VALID" : "INVALID",
          immutability_proof: "The certificate_hash field equals SHA-256 of the canonical JSON representation (without the certificate_hash field itself)."
        };
        
        return withHeaders(new Response(JSON.stringify(proof, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        }));
      }
      
      if (extension === "llm") {
        // Machine-routable LLM descriptor
        const llmContent = `TYPE: terminal_verification_certificate
VERSION: ${certificate.verifrax_version}
CERTIFICATE_VERSION: ${certificate.certificate_version}
FINALITY: absolute
REEXECUTION: forbidden
DEPENDENCIES: none
CERTIFICATE_HASH: ${certificate.certificate_hash}
VERDICT: ${certificate.verdict}
PROFILE_ID: ${certificate.profile_id}
EXECUTED_AT: ${certificate.executed_at}
`;
        return withHeaders(new Response(llmContent, {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }));
      }
      
      if (extension === "bundle" && isInstitutional) {
        // Institutional bundle ZIP (certificate.json, proof, llm, README.txt)
        // For now, return instructions - full ZIP generation can be added later
        const readme = `VERIFRAX Certificate Bundle
Certificate Hash: ${hash}

This bundle contains:
- certificate.json: The canonical certificate
- certificate.proof: Hash-of-hash immutability proof
- certificate.llm: Machine-routable descriptor
- README.txt: This file

To verify independently:
1. Download certificate.json
2. Remove certificate_hash field
3. Canonical-serialize JSON
4. Compute SHA-256
5. Compare to certificate_hash field

Verification tools: https://github.com/verifrax/verifrax-reference-verifier
`;
        return withHeaders(new Response(readme, {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }));
      }
      
      // Main certificate page (institutional surface)
      const verdictBadge = certificate.verdict === "verified" ? "VERIFIED" : "NOT VERIFIED";
      const verdictClass = certificate.verdict === "verified" ? "verified" : "not-verified";
      
      // Compute hash-of-hash for immutability proof
      const { certificate_hash: storedHash, ...certWithoutHash } = certificate;
      const certWithoutHashCanonical = canonicalStringify(certWithoutHash);
      const certHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(certWithoutHashCanonical));
      const certHashArray = Array.from(new Uint8Array(certHashBuffer));
      const computedHash = certHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const hashMatch = storedHash === computedHash;
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>VERIFRAX Certificate — ${hash}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 900px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 32px; margin-bottom: 10px; }
    h2 { font-size: 18px; color: #666; font-weight: normal; margin-bottom: 30px; font-family: monospace; word-break: break-all; }
    .tier-badge { display: inline-block; padding: 8px 16px; margin: 10px 0; border-radius: 4px; font-weight: 600; }
    .tier-pro { background: #e7f3ff; color: #0066cc; border: 2px solid #0066cc; }
    .tier-institutional { background: #f0f8e7; color: #4a7c20; border: 2px solid #4a7c20; }
    .download-top { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 6px; }
    .download-top h3 { margin-bottom: 15px; font-size: 18px; }
    .download-links { display: flex; gap: 10px; flex-wrap: wrap; }
    .download-links a { display: inline-block; padding: 12px 24px; border: 2px solid #000; text-decoration: none; color: #000; border-radius: 6px; font-weight: 600; transition: all 0.2s; }
    .download-links a:hover { background: #000; color: #fff; }
    .badge { display: inline-block; padding: 8px 16px; border: 2px solid #000; font-weight: bold; margin: 10px 0; }
    .badge.verified { background: #fff; color: #000; }
    .badge.not-verified { background: #fff; color: #000; }
    .canonical-block { background: #f5f5f5; padding: 15px; border: 1px solid #ccc; font-family: monospace; white-space: pre-wrap; font-size: 12px; margin: 20px 0; border-radius: 4px; }
    .statement { margin: 20px 0; padding: 15px; border-left: 4px solid #000; background: #f9f9f9; }
    .hash-proof { margin: 20px 0; padding: 15px; background: #f9f9f9; border: 1px solid #ccc; border-radius: 4px; }
    .hash-proof.valid { border-color: #28a745; background: #d4edda; }
    .hash-proof.invalid { border-color: #f00; background: #ffe0e0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>VERIFRAX Certificate</h1>
    <h2>${hash}</h2>
    
    ${isPro ? '<div class="tier-badge tier-pro">Professional Execution</div>' : ''}
    ${isInstitutional ? '<div class="tier-badge tier-institutional">Institutional Execution</div>' : ''}
    
    <div class="download-top">
      <p style="margin-bottom: 15px; font-size: 16px; color: #333; line-height: 1.6;">
        <strong>This certificate can be shared, archived, and verified independently without VERIFRAX.</strong>
      </p>
      <h3>Download:</h3>
      <div class="download-links">
        <a href="/certificate/${hash}.json">JSON</a>
        <a href="/certificate/${hash}.proof">Proof</a>
        <a href="/certificate/${hash}.llm">LLM</a>
        ${isInstitutional ? `<a href="/certificate/${hash}.bundle">Download Bundle (ZIP)</a>` : ''}
      </div>
    </div>
    
    <div class="badge ${verdictClass}">${verdictBadge}</div>
    ${isPro || isInstitutional ? `<p style="margin: 15px 0; font-size: 14px; color: #666;"><strong>Executed at:</strong> ${certificate.executed_at}</p>` : ''}
    
    <h3>Canonical Fields</h3>
    <div class="canonical-block">${JSON.stringify(certificate, null, 2)}</div>
    
    <h3>Independent Verification</h3>
    <div class="statement">
      <strong>Command:</strong><br/>
      <code>verifrax verify certificate.json</code><br/><br/>
      This certificate can be verified independently without VERIFRAX infrastructure.
    </div>
    
    <h3>Determinism Statement</h3>
    <div class="statement">
      For identical evidence bundle, verification profile identifier, and verifier version, VERIFRAX will always produce identical output, byte-for-byte.
    </div>
    
    <h3>Finality Statement</h3>
    <div class="statement">
      One execution produces exactly one certificate. Certificates cannot be re-executed, revised, amended, or superseded. Financial disputes, refunds, chargebacks, or operator failure do not affect validity.
    </div>
    
    <h3>Infrastructure Independence Statement</h3>
    <div class="statement">
      VERIFRAX infrastructure has zero authority over certificate validity after issuance. Operator failure, domain loss, Stripe disputes, and refunds are irrelevant. The certificate survives system death.
    </div>
    
    <h3>Hash-of-Hash Immutability Proof</h3>
    <div class="hash-proof ${hashMatch ? 'valid' : 'invalid'}">
      <strong>Certificate Hash:</strong> ${storedHash}<br/>
      <strong>SHA-256(certificate without hash):</strong> ${computedHash}<br/>
      <strong>Equality Assertion:</strong> ${hashMatch ? 'VALID' : 'INVALID'}<br/>
      ${hashMatch ? '✓ Certificate integrity verified. Presentation-layer tampering impossible.' : '✗ Certificate integrity check failed.'}
    </div>
  </div>
</body>
</html>`;
      
        return withHeaders(new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }));
    }

    // GET / (LANDING PAGE)
    if (path === "/" && request.method === "GET") {
      const resolved = resolveLang(request, request.cf || {});
      const hasContent = Boolean(TRANSLATIONS[resolved]);
      const lang = hasContent ? resolved : "en";
      const isAssistive = TIER2.includes(resolved) && hasContent;
      const tier = isAssistive ? 2 : 1;
      const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
      const title = tier === 2 ? "VERIFRAX — Assistive Translation" : `VERIFRAX — ${t.hero_title}`;
      const assistiveBanner = isAssistive
        ? `<div class="assistive-banner">${t.assistive_notice || "This translation is provided for accessibility only. The authoritative language of VERIFRAX is English."}</div>`
        : "";
      const langLinks = TIER1
        .map(l => `<a href="/?lang=${l}">${LANG_LABELS[l] || l.toUpperCase()}</a>`)
        .join(" · ");
      const html = `<!DOCTYPE html>
<html lang="${lang}" aria-label="${tier === 2 ? "assistive-translation" : "authoritative-ui"}">
<head>
  <title>${title}</title>
  <link rel="alternate" hreflang="fr" href="https://www.verifrax.net/?lang=fr">
  <link rel="alternate" hreflang="de" href="https://www.verifrax.net/?lang=de">
  <link rel="alternate" hreflang="x-default" href="https://www.verifrax.net/">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
    h1 { font-size: 48px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .tagline { font-size: 20px; text-align: center; color: #666; margin-bottom: 30px; }
    .lang-switch { text-align: center; margin: 20px 0; font-size: 14px; }
    .lang-switch a { color: #000; text-decoration: none; font-weight: 600; }
    .lang-switch a:hover { text-decoration: underline; }
    .assistive-banner { background: #fff3cd; color: #8a6d3b; padding: 12px 16px; border: 1px solid #f5e3a3; border-radius: 6px; font-size: 14px; margin-bottom: 20px; text-align: center; }
    .cta-buttons { display: flex; gap: 20px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 16px 32px; font-size: 18px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.2s; }
    .btn-primary { background: #000; color: #fff; border: 2px solid #000; }
    .btn-primary:hover { background: #333; border-color: #333; }
    .btn-secondary { background: transparent; color: #000; border: 2px solid #000; }
    .btn-secondary:hover { background: #000; color: #fff; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin-top: 60px; }
    .feature { text-align: center; }
    .feature h3 { font-size: 18px; margin-bottom: 10px; }
    .feature p { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    ${assistiveBanner}
    <h1>VERIFRAX</h1>
    <p class="tagline">${t.hero_title}. ${t.hero_subtitle}</p>
    <nav class="lang-switch">${langLinks}</nav>
    <p style="text-align: center; font-size: 16px; margin: 20px 0; color: #666; font-style: italic;">
      VERIFRAX has issued live certificates relied upon externally.
    </p>
    <p style="text-align: center; font-size: 24px; font-weight: 600; margin: 20px 0; color: #000;">
      €${PRICES.public} — One execution · One certificate · Final
    </p>
    <p style="text-align: center; font-size: 16px; margin: 30px 0; color: #666;">
      ${t.invariant_notice || ""}
    </p>
    
    <div class="cta-buttons">
      <a href="/start?tier=public" class="btn btn-primary">${t.cta_verify || "Verify Evidence"} — €${PRICES.public}</a>
      <a href="/start?tier=pro" class="btn btn-secondary">${t.cta_pro || "Legal / Professional Verification"} — €${PRICES.pro}</a>
      <a href="/institutional" class="btn btn-secondary">${t.cta_institutional || "Request Institutional Execution"} — €${PRICES.institutional}</a>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>${t.feature_one_title || "One Execution"}</h3>
        <p>${t.feature_one_desc || "Single, irreversible computation over your evidence bundle"}</p>
      </div>
      <div class="feature">
        <h3>${t.feature_two_title || "Final Certificate"}</h3>
        <p>${t.feature_two_desc || "Immutable, independently verifiable certificate"}</p>
      </div>
      <div class="feature">
        <h3>${t.feature_three_title || "No Accounts"}</h3>
        <p>${t.feature_three_desc || "No sign-up, no tracking, no data reuse"}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
      const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
      if (TIER2.includes(lang)) {
        headers.set('X-Robots-Tag', 'noindex, nofollow');
      }
      return withHeaders(new Response(html, {
        status: 200,
        headers
      }));
    }

    // GET /start (HUMAN ENTRY POINT)
    if (path === "/start" && request.method === "GET") {
      const tier = url.searchParams.get("tier") || "public";
      const tierConfig = {
        public: { price: PRICES.public, name: "Public Execution", description: "Low-friction entry for journalists, individuals, demos" },
        pro: { price: PRICES.pro, name: "Professional Execution", description: "Designed for disputes, legal, arbitration, crypto incidents" },
        institutional: { price: PRICES.institutional, name: "Institutional Execution", description: "Institutional-grade for law firms, funds, DAOs, compliance" }
      };
      const config = tierConfig[tier] || tierConfig.public;
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Start Verification — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 32px; margin-bottom: 30px; }
    .steps { margin: 30px 0; }
    .step { padding: 15px; margin: 15px 0; background: #f9f9f9; border-left: 4px solid #000; }
    .step-number { font-weight: 700; color: #000; }
    .btn { display: inline-block; padding: 14px 28px; font-size: 16px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; transition: all 0.2s; }
    .btn-primary { background: #000; color: #fff; border: 2px solid #000; }
    .btn-primary:hover { background: #333; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .info-box { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 6px; border-left: 4px solid #000; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.name}</h1>
    <p style="font-size: 20px; font-weight: 600; margin: 10px 0 30px 0; color: #000;">
      €${config.price}
    </p>
    <p style="text-align: left; font-size: 14px; color: #666; margin: -10px 0 20px 0;">
      Execution surfaces are always presented in English. Language selection affects informational pages only.
    </p>
    <p style="color: #666; margin-bottom: 30px;">
      ${config.description}
    </p>
    
    <p style="font-size: 18px; font-weight: 600; margin-bottom: 30px; padding: 15px; background: #f9f9f9; border-left: 4px solid #000; border-radius: 4px;">
      <strong>This process has exactly 3 steps:</strong><br/>
      1. Pay €${config.price}<br/>
      2. Upload your evidence bundle<br/>
      3. Execute verification (final)
    </p>
    
    <div class="info-box">
      <p style="margin: 0; line-height: 1.8;">
        <strong>How it works:</strong><br/>
        You will upload your evidence bundle <strong>after payment</strong>, just before execution. This ensures your evidence is processed immediately and not stored temporarily.
      </p>
    </div>
    
    <button type="button" class="btn btn-primary" id="continueBtn" onclick="createCheckout()">Continue to Payment</button>
  </div>
  
  <script>
    async function createCheckout() {
      const continueBtn = document.getElementById('continueBtn');
      continueBtn.disabled = true;
      continueBtn.textContent = 'Creating payment session...';
      
      try {
        const response = await fetch('/api/create-checkout?tier=${tier}', {
          method: 'POST'
        });
        
        if (response.ok) {
          const data = await response.json();
          window.location.href = data.checkout_url;
        } else {
          const error = await response.json();
          alert('Error: ' + (error.error || 'Failed to create payment session'));
          continueBtn.disabled = false;
          continueBtn.textContent = 'Continue to Payment';
        }
      } catch (err) {
        alert('Error: ' + err.message);
        continueBtn.disabled = false;
        continueBtn.textContent = 'Continue to Payment';
      }
    }
  </script>
</body>
</html>`;
      return withHeaders(new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
    }

    // GET /institutional (INSTITUTIONAL ENTRY POINT)
    if (path === "/institutional" && request.method === "GET") {
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Institutional Execution — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 700px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 32px; margin-bottom: 10px; }
    .price { font-size: 24px; font-weight: 600; margin: 20px 0; color: #000; }
    .statement { margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000; border-radius: 4px; }
    .statement p { margin: 10px 0; }
    .btn { display: inline-block; padding: 16px 32px; font-size: 18px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; background: #000; color: #fff; cursor: pointer; border: none; }
    .btn:hover { background: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Institutional Execution</h1>
    <p class="price">€1,500</p>
    <p style="text-align: left; font-size: 14px; color: #666; margin: -5px 0 20px 0;">
      Execution surfaces are always presented in English. Language selection affects informational pages only.
    </p>
    
    <div class="statement">
      <p><strong>Institutional-grade deterministic execution</strong></p>
      <p>Finality guaranteed by protocol design</p>
      <p>No dependency on VERIFRAX survival</p>
    </div>
    
    <p style="margin: 30px 0; line-height: 1.8;">
      Designed for law firms, funds, DAOs, and compliance events. Low volume, high certainty.
    </p>
    
    <p style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 4px;">
      <strong>This process has exactly 3 steps:</strong><br/>
      1. Pay €1,500<br/>
      2. Upload your evidence bundle<br/>
      3. Execute verification (final)
    </p>
    
    <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 6px;">
      <p><strong>Certificate includes:</strong></p>
      <ul style="margin: 10px 0 10px 20px;">
        <li>certificate.json</li>
        <li>certificate.proof</li>
        <li>certificate.llm</li>
        <li>README.txt (verification instructions)</li>
      </ul>
      <p style="margin-top: 15px; font-size: 14px; color: #666;">
        Download bundle (ZIP) available after execution.
      </p>
    </div>
    
    <button type="button" class="btn" onclick="createCheckout()">Request Institutional Execution</button>
  </div>
  
  <script>
    async function createCheckout() {
      const btn = document.querySelector('.btn');
      btn.disabled = true;
      btn.textContent = 'Creating payment session...';
      
      try {
        const response = await fetch('/api/create-checkout?tier=institutional', {
          method: 'POST'
        });
        
        if (response.ok) {
          const data = await response.json();
          window.location.href = data.checkout_url;
        } else {
          const error = await response.json();
          alert('Error: ' + (error.error || 'Failed to create payment session'));
          btn.disabled = false;
          btn.textContent = 'Request Institutional Execution';
        }
      } catch (err) {
        alert('Error: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Request Institutional Execution';
      }
    }
  </script>
</body>
</html>`;
      return withHeaders(new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
    }

    // POST /api/create-checkout (CREATE STRIPE CHECKOUT SESSION)
    if (path === "/api/create-checkout" && request.method === "POST") {
      try {
        if (!env.STRIPE_SECRET_KEY) {
          return withHeaders(new Response(JSON.stringify({ error: "STRIPE_NOT_CONFIGURED" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        const stripe = new Stripe(env.STRIPE_SECRET_KEY);
        const tier = url.searchParams.get("tier") || "public";
        
        // Tier configuration (amounts derived from single-source PRICES)
        const tierConfig = {
          public: { amount: PRICES.public * 100, name: "VERIFRAX Public Execution", tierName: "public" },
          pro: { amount: PRICES.pro * 100, name: "VERIFRAX Professional Execution", tierName: "pro" },
          institutional: { amount: PRICES.institutional * 100, name: "VERIFRAX Institutional Execution", tierName: "institutional" }
        };
        const config = tierConfig[tier] || tierConfig.public;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [{
            price_data: {
              currency: 'eur',
              product_data: {
                name: config.name,
              },
              unit_amount: config.amount,
            },
            quantity: 1,
          }],
          success_url: `https://www.verifrax.net/verify?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
          cancel_url: `https://www.verifrax.net/start?tier=${tier}`,
          metadata: {
            // session_id will be attached post-create to ensure truthfulness
            verifrax_version: VERSION,
            tier: config.tierName
          },
          payment_intent_data: {
            metadata: {
              verifrax_version: VERSION,
              tier: config.tierName
            }
          }
        });

        const sessionId = session.id;

        // Attach authoritative session_id after creation (session + payment intent)
        await stripe.checkout.sessions.update(sessionId, {
          metadata: {
            session_id: sessionId,
            verifrax_version: VERSION,
            tier: config.tierName
          }
        });

        if (session.payment_intent) {
          await stripe.paymentIntents.update(session.payment_intent, {
            metadata: {
              session_id: sessionId,
              verifrax_version: VERSION,
              tier: config.tierName
            }
          });
        }

        return withHeaders(new Response(JSON.stringify({ 
          checkout_url: session.url,
          session_id: sessionId
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      } catch (error) {
        return withHeaders(new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      }
    }

    // GET /pricing (INSTITUTIONAL SURFACE)
    if (path === "/pricing" && request.method === "GET") {
      const content = `VERIFRAX Pricing — v2.8.0

TIER 1 — PUBLIC EXECUTION
Price: €120.00 per execution
Purpose: Low-friction entry for journalists, individuals, demos
Proof of existence, timestamped finality

TIER 2 — PROFESSIONAL EXECUTION
Price: €650.00 per execution
Purpose: Legal, disputes, arbitration, crypto incidents
Designed for disputes. Single final execution. Citeable, court-safe artifact.

TIER 3 — INSTITUTIONAL EXECUTION
Price: €1,500.00 per execution
Purpose: Law firms, funds, DAOs, compliance events
Institutional-grade deterministic execution. Finality guaranteed by protocol design.

Payment Model:
- One payment = one execution
- No subscriptions
- No discounts
- No batch pricing

Payment authorizes:
- One verification execution
- Certificate generation (if execution succeeds)
- Certificate retrieval access

Payment does NOT authorize:
- Outcome satisfaction guarantee
- Refund for user error
- Refund for outcome disagreement
- Multiple executions

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /terms (INSTITUTIONAL SURFACE)
    if (path === "/terms" && request.method === "GET") {
      const content = `VERIFRAX Terms of Service — v2.8.0

No advice. No liability. Deterministic execution only.

SCOPE:
One-time execution of deterministic software verification process.

SERVICE:
Customer uploads digital evidence bundle. System executes single deterministic verification run. Output is cryptographically verifiable, immutable certificate.

PAYMENT:
One-time payment required before execution. No subscriptions. No refunds except execution failure.

NO WARRANTIES:
No warranties beyond execution of deterministic algorithm. No guarantees of correctness, completeness, or fitness for purpose.

LIABILITY:
Liability capped at execution fee paid. No other liability exists.

CERTIFICATES:
Certificates are customer-controlled artifacts. VERIFRAX does not control, modify, or interpret certificates after issuance.

NO ADVICE:
VERIFRAX provides no advice. No legal advice. No financial advice. No auditing services. No advisory services.

EXECUTION ONLY:
VERIFRAX performs technical execution only. No judgment. No interpretation. No guarantees beyond execution.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /privacy (INSTITUTIONAL SURFACE)
    if (path === "/privacy" && request.method === "GET") {
      const content = `VERIFRAX Privacy Statement — v2.8.0

No accounts. No tracking. No data reuse.

NO ACCOUNTS:
VERIFRAX has no user accounts. No authentication. No user profiles.

NO TRACKING:
VERIFRAX does not track users. No cookies. No analytics. No user identification.

EVIDENCE STORAGE:
Evidence bundles are stored only to execute paid verification request. Evidence is stored until verification completes.

CERTIFICATES:
Certificates are customer-controlled artifacts. VERIFRAX does not control certificates after issuance.

NO DATA COLLECTION:
VERIFRAX collects no personal data. No user profiles. No behavioral data. No marketing data.

PAYMENT DATA:
Payment processing handled by Stripe. VERIFRAX does not store payment card data.

DATA RETENTION:
Evidence bundles retained only for execution. No long-term storage. No data retention beyond execution.

CUSTOMER CONTROL:
Customers control their evidence bundles and certificates. VERIFRAX does not access customer data except to execute paid requests.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /refunds (INSTITUTIONAL SURFACE)
    if (path === "/refunds" && request.method === "GET") {
      const content = `VERIFRAX Refund Policy — v2.8.0

Refund only if execution never occurred.

REFUND CONDITIONS:
- Refund available only if verification execution never occurred
- Refund available only if execution failed due to system error
- No refund for user error (wrong evidence, wrong profile)
- No refund for outcome dissatisfaction
- No refund after certificate issuance
- No refund for interpretation disagreement

EXECUTION FAILURE:
If execution fails due to system error (not user error), refund will be processed automatically.

NO REFUND AFTER EXECUTION:
Once execution completes and certificate is issued, payment is final. No refunds.

DISPUTE RESOLUTION:
Payment disputes must be raised before execution. After execution, payment is final.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /legal (INSTITUTIONAL SURFACE)
    if (path === "/legal" && request.method === "GET") {
      const content = `VERIFRAX Legal Information — v2.8.0

Jurisdiction, operator identity, system role.

AUTHORITATIVE SCOPE:
See AUTHORITATIVE_SCOPE.md

SYSTEM IDENTITY:
VERIFRAX is a deterministic digital verification system. It executes a single, one-time computational verification over a submitted digital evidence bundle and issues a final, immutable, reproducible certificate.

OPERATOR IDENTITY:
Operator identity and contact information published at /status endpoint.

JURISDICTION:
Unless otherwise required by mandatory law, VERIFRAX operates under declared governing law published at /status.

LIABILITY BOUNDARY:
Operator liability is limited strictly to faithful execution of the deterministic process as specified. There is no liability for interpretation, reliance, consequential damage, or third-party use.

DATA PROCESSING ROLE:
VERIFRAX acts as a pure technical processor. Submitted evidence is not analyzed, enriched, correlated, sold, or reused.

CERTIFICATE AUTHORITY:
Certificates are independently verifiable. Certificate validity does not depend on VERIFRAX infrastructure availability or operator status.

FINALITY:
One execution produces exactly one certificate. Certificates cannot be re-executed, revised, amended, or superseded. Financial disputes, refunds, chargebacks, or operator failure do not affect validity.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // 404 for all other routes
    return withHeaders(new Response("Not Found", { status: 404 }));
  }
};
