import type { Locale } from "./locales";

export type TranslationKey =
  // common
  | "common.language"
  | "common.analytics"
  | "common.back"
  | "common.refresh"
  | "common.loading"
  | "common.apply"
  // home / reports
  | "home.title"
  | "home.subtitle"
  | "home.reset"
  | "home.createReport"
  | "home.creating"
  | "home.downloadPdf"
  | "home.preparingPdf"
  | "home.reportTotals"
  | "home.report"
  | "home.noReportYet"
  | "home.scope1.title"
  | "home.scope1.subtitle"
  | "home.scope1.stationary.title"
  | "home.scope1.refrigerants.title"
  | "home.scope2.title"
  | "home.scope2.subtitle"
  | "home.scope3.title"
  | "home.scope3.subtitle"
  | "home.scope3.cat1.title"
  | "home.scope3.cat5.title"
  | "home.scope3.cat6.title"
  | "home.scope3.cat6.tip"
  // fields / labels
  | "field.naturalGas"
  | "field.heatingMazut"
  | "field.coal"
  | "field.fleetGasoline"
  | "field.fleetDiesel"
  | "field.generatorsDiesel"
  | "field.r407c"
  | "field.r32"
  | "field.r410a"
  | "field.electricity"
  | "field.districtHeat"
  | "field.waterSupply"
  | "field.paperStandard"
  | "field.paperEco"
  | "field.wastewaterTreatment"
  | "field.wastePaper"
  | "field.wasteMonitors"
  | "field.wasteElectronics"
  | "field.wasteToners"
  | "field.flights"
  | "field.rail"
  | "field.taxi"
  | "field.bus"
  | "field.distance"
  | "field.unit"
  | "field.distancePlaceholder"
  // totals labels
  | "totals.total"
  | "totals.scope1"
  | "totals.scope2"
  | "totals.scope3"
  | "totals.stationary"
  | "totals.refrigerants"
  | "totals.cat1"
  | "totals.cat5"
  | "totals.cat6"
  // analytics
  | "analytics.title"
  | "analytics.subtitle"
  | "analytics.filters.title"
  | "analytics.filters.subtitle"
  | "analytics.filters.from"
  | "analytics.filters.to"
  | "analytics.filters.bucket"
  | "analytics.summary.title"
  | "analytics.timeseries.title"
  | "analytics.timeseries.buckets"
  | "analytics.timeseries.noData"
  | "analytics.kpi.reports"
  | "analytics.kpi.avgPerDay"
  | "analytics.kpi.totalSum"
  | "analytics.kpi.avg"
  | "analytics.kpi.minMax"
  | "analytics.kpi.periodDays"
  | "analytics.kpi.scopeAverages"
  | "analytics.table.bucketStart"
  | "analytics.table.reports"
  | "analytics.table.sum"
  | "analytics.table.avg"
  | "analytics.table.volume"
  | "bucket.day"
  | "bucket.week"
  | "bucket.month"
  // errors
  | "error.somethingWentWrong"
  | "error.pdfDownloadFailed"
  | "error.pdfExportFailed"
  | "error.requestFailed"
  | "error.analyticsLoadFailed"
  | "error.summaryRequestFailed"
  | "error.timeseriesRequestFailed";

export type Translations = Record<TranslationKey, string>;

export const translations: Record<Locale, Translations> = {
  en: {
    "common.language": "Language",
    "common.analytics": "Analytics",
    "common.back": "Back",
    "common.refresh": "Refresh",
    "common.loading": "Loading…",
    "common.apply": "Apply",

    "home.title": "Carbon Calculator",
    "home.subtitle": "Fill in any category you have data for (blank fields are ignored). Submit creates a report and returns totals.",
    "home.reset": "Reset",
    "home.createReport": "Create report",
    "home.creating": "Creating…",
    "home.downloadPdf": "Download PDF",
    "home.preparingPdf": "Preparing PDF…",
    "home.reportTotals": "Report totals",
    "home.report": "Report",
    "home.noReportYet": "No report yet — submit the form to calculate.",
    "home.scope1.title": "Rozsah 1",
    "home.scope1.subtitle": "Direct emissions: stationary combustion + refrigerants.",
    "home.scope1.stationary.title": "Stationary combustion",
    "home.scope1.refrigerants.title": "Refrigerants",
    "home.scope2.title": "Rozsah 2",
    "home.scope2.subtitle": "Purchased energy.",
    "home.scope3.title": "Rozsah 3",
    "home.scope3.subtitle": "Indirect emissions (categories 1, 5, 6).",
    "home.scope3.cat1.title": "Category 1",
    "home.scope3.cat5.title": "Category 5",
    "home.scope3.cat6.title": "Category 6 (travel)",
    "home.scope3.cat6.tip": "Tip: only positive distances are counted. Leaving distance blank omits that travel mode from the request.",

    "field.naturalGas": "Natural gas",
    "field.heatingMazut": "Heating mazut",
    "field.coal": "Coal",
    "field.fleetGasoline": "Fleet gasoline",
    "field.fleetDiesel": "Fleet diesel",
    "field.generatorsDiesel": "Generators diesel",
    "field.r407c": "R407C",
    "field.r32": "R32",
    "field.r410a": "R410A",
    "field.electricity": "Electricity",
    "field.districtHeat": "District heat",
    "field.waterSupply": "Water supply",
    "field.paperStandard": "Paper (standard)",
    "field.paperEco": "Paper (eco)",
    "field.wastewaterTreatment": "Wastewater treatment",
    "field.wastePaper": "Waste paper",
    "field.wasteMonitors": "Waste monitors",
    "field.wasteElectronics": "Waste electronics",
    "field.wasteToners": "Waste toners",
    "field.flights": "Flights",
    "field.rail": "Rail",
    "field.taxi": "Taxi",
    "field.bus": "Bus",
    "field.distance": "Distance",
    "field.unit": "Unit",
    "field.distancePlaceholder": "distance",

    "totals.total": "Total",
    "totals.scope1": "Rozsah 1",
    "totals.scope2": "Rozsah 2",
    "totals.scope3": "Rozsah 3",
    "totals.stationary": "Stationary",
    "totals.refrigerants": "Refrigerants",
    "totals.cat1": "Cat 1",
    "totals.cat5": "Cat 5",
    "totals.cat6": "Cat 6",

    "analytics.title": "Analytics",
    "analytics.subtitle": "Usage and emissions stats for generated carbon reports.",
    "analytics.filters.title": "Filters",
    "analytics.filters.subtitle": "Bucket + optional time range (ISO is generated from your local time).",
    "analytics.filters.from": "From",
    "analytics.filters.to": "To",
    "analytics.filters.bucket": "Bucket",
    "analytics.summary.title": "Summary",
    "analytics.timeseries.title": "Timeseries ({bucket})",
    "analytics.timeseries.buckets": "{count} buckets",
    "analytics.timeseries.noData": "No data for selected range.",
    "analytics.kpi.reports": "Reports",
    "analytics.kpi.avgPerDay": "Avg/day",
    "analytics.kpi.totalSum": "Total kg CO₂e (sum)",
    "analytics.kpi.avg": "Avg",
    "analytics.kpi.minMax": "Min / Max",
    "analytics.kpi.periodDays": "Period days",
    "analytics.kpi.scopeAverages": "Scope averages",
    "analytics.table.bucketStart": "Bucket start",
    "analytics.table.reports": "Reports",
    "analytics.table.sum": "Sum kg CO₂e",
    "analytics.table.avg": "Avg kg CO₂e",
    "analytics.table.volume": "Volume",
    "bucket.day": "day",
    "bucket.week": "week",
    "bucket.month": "month",

    "error.somethingWentWrong": "Something went wrong",
    "error.pdfDownloadFailed": "PDF download failed",
    "error.pdfExportFailed": "PDF export failed ({status})",
    "error.requestFailed": "Request failed ({status})",
    "error.analyticsLoadFailed": "Analytics load failed",
    "error.summaryRequestFailed": "Summary request failed ({status})",
    "error.timeseriesRequestFailed": "Timeseries request failed ({status})",
  },
  pl: {
    "common.language": "Język",
    "common.analytics": "Analityka",
    "common.back": "Wstecz",
    "common.refresh": "Odśwież",
    "common.loading": "Ładowanie…",
    "common.apply": "Zastosuj",

    "home.title": "Kalkulator emisji",
    "home.subtitle": "Uzupełnij dane, które posiadasz (puste pola są ignorowane). Wysłanie tworzy raport i zwraca sumy.",
    "home.reset": "Resetuj",
    "home.createReport": "Utwórz raport",
    "home.creating": "Tworzenie…",
    "home.downloadPdf": "Pobierz PDF",
    "home.preparingPdf": "Przygotowywanie PDF…",
    "home.reportTotals": "Podsumowanie raportu",
    "home.report": "Raport",
    "home.noReportYet": "Brak raportu — wyślij formularz, aby obliczyć.",
    "home.scope1.title": "Zakres 1",
    "home.scope1.subtitle": "Emisje bezpośrednie: spalanie stacjonarne + czynniki chłodnicze.",
    "home.scope1.stationary.title": "Spalanie stacjonarne",
    "home.scope1.refrigerants.title": "Czynniki chłodnicze",
    "home.scope2.title": "Zakres 2",
    "home.scope2.subtitle": "Zakupiona energia.",
    "home.scope3.title": "Zakres 3",
    "home.scope3.subtitle": "Emisje pośrednie (kategorie 1, 5, 6).",
    "home.scope3.cat1.title": "Kategoria 1",
    "home.scope3.cat5.title": "Kategoria 5",
    "home.scope3.cat6.title": "Kategoria 6 (podróże)",
    "home.scope3.cat6.tip": "Wskazówka: liczone są tylko dodatnie odległości. Puste pole pomija dany środek transportu.",

    "field.naturalGas": "Gaz ziemny",
    "field.heatingMazut": "Mazut grzewczy",
    "field.coal": "Węgiel",
    "field.fleetGasoline": "Benzyna (flota)",
    "field.fleetDiesel": "Diesel (flota)",
    "field.generatorsDiesel": "Diesel (generatory)",
    "field.r407c": "R407C",
    "field.r32": "R32",
    "field.r410a": "R410A",
    "field.electricity": "Elektryczność",
    "field.districtHeat": "Ciepło sieciowe",
    "field.waterSupply": "Dostawa wody",
    "field.paperStandard": "Papier (standard)",
    "field.paperEco": "Papier (eko)",
    "field.wastewaterTreatment": "Oczyszczanie ścieków",
    "field.wastePaper": "Odpady papieru",
    "field.wasteMonitors": "Odpady monitorów",
    "field.wasteElectronics": "Odpady elektroniki",
    "field.wasteToners": "Odpady tonerów",
    "field.flights": "Loty",
    "field.rail": "Kolej",
    "field.taxi": "Taksówka",
    "field.bus": "Autobus",
    "field.distance": "Odległość",
    "field.unit": "Jednostka",
    "field.distancePlaceholder": "odległość",

    "totals.total": "Suma",
    "totals.scope1": "Zakres 1",
    "totals.scope2": "Zakres 2",
    "totals.scope3": "Zakres 3",
    "totals.stationary": "Spalanie",
    "totals.refrigerants": "Chłodziwa",
    "totals.cat1": "Kat. 1",
    "totals.cat5": "Kat. 5",
    "totals.cat6": "Kat. 6",

    "analytics.title": "Analityka",
    "analytics.subtitle": "Statystyki użycia i emisji dla wygenerowanych raportów.",
    "analytics.filters.title": "Filtry",
    "analytics.filters.subtitle": "Przedział czasu + agregacja (ISO generowane z czasu lokalnego).",
    "analytics.filters.from": "Od",
    "analytics.filters.to": "Do",
    "analytics.filters.bucket": "Agregacja",
    "analytics.summary.title": "Podsumowanie",
    "analytics.timeseries.title": "Szereg czasowy ({bucket})",
    "analytics.timeseries.buckets": "{count} przedziałów",
    "analytics.timeseries.noData": "Brak danych dla wybranego zakresu.",
    "analytics.kpi.reports": "Raporty",
    "analytics.kpi.avgPerDay": "Śr./dzień",
    "analytics.kpi.totalSum": "Suma kg CO₂e",
    "analytics.kpi.avg": "Średnia",
    "analytics.kpi.minMax": "Min / Max",
    "analytics.kpi.periodDays": "Dni okresu",
    "analytics.kpi.scopeAverages": "Średnie zakresów",
    "analytics.table.bucketStart": "Początek",
    "analytics.table.reports": "Raporty",
    "analytics.table.sum": "Suma kg CO₂e",
    "analytics.table.avg": "Śr. kg CO₂e",
    "analytics.table.volume": "Wolumen",
    "bucket.day": "dzień",
    "bucket.week": "tydzień",
    "bucket.month": "miesiąc",

    "error.somethingWentWrong": "Coś poszło nie tak",
    "error.pdfDownloadFailed": "Nie udało się pobrać PDF",
    "error.pdfExportFailed": "Eksport PDF nieudany ({status})",
    "error.requestFailed": "Błąd żądania ({status})",
    "error.analyticsLoadFailed": "Nie udało się wczytać analityki",
    "error.summaryRequestFailed": "Błąd podsumowania ({status})",
    "error.timeseriesRequestFailed": "Błąd szeregu ({status})",
  },
  sk: {
    "common.language": "Jazyk",
    "common.analytics": "Analytika",
    "common.back": "Späť",
    "common.refresh": "Obnoviť",
    "common.loading": "Načítava sa…",
    "common.apply": "Použiť",

    "home.title": "Kalkulačka uhlíka",
    "home.subtitle": "Vyplňte údaje, ktoré máte (prázdne polia sa ignorujú). Odoslanie vytvorí report a vráti súčty.",
    "home.reset": "Reset",
    "home.createReport": "Vytvoriť report",
    "home.creating": "Vytvára sa…",
    "home.downloadPdf": "Stiahnuť PDF",
    "home.preparingPdf": "Pripravuje sa PDF…",
    "home.reportTotals": "Súčty reportu",
    "home.report": "Report",
    "home.noReportYet": "Zatiaľ žiadny report — odošlite formulár pre výpočet.",
    "home.scope1.title": "Bereich 1",
    "home.scope1.subtitle": "Priame emisie: stacionárne spaľovanie + chladivá.",
    "home.scope1.stationary.title": "Stacionárne spaľovanie",
    "home.scope1.refrigerants.title": "Chladivá",
    "home.scope2.title": "Bereich 2",
    "home.scope2.subtitle": "Nakúpená energia.",
    "home.scope3.title": "Bereich 3",
    "home.scope3.subtitle": "Nepriame emisie (kategórie 1, 5, 6).",
    "home.scope3.cat1.title": "Kategória 1",
    "home.scope3.cat5.title": "Kategória 5",
    "home.scope3.cat6.title": "Kategória 6 (cestovanie)",
    "home.scope3.cat6.tip": "Tip: započítavajú sa len kladné vzdialenosti. Prázdna vzdialenosť vynechá daný spôsob dopravy.",

    "field.naturalGas": "Zemný plyn",
    "field.heatingMazut": "Vykurovací mazut",
    "field.coal": "Uhlie",
    "field.fleetGasoline": "Benzín (flotila)",
    "field.fleetDiesel": "Diesel (flotila)",
    "field.generatorsDiesel": "Diesel (generátory)",
    "field.r407c": "R407C",
    "field.r32": "R32",
    "field.r410a": "R410A",
    "field.electricity": "Elektrina",
    "field.districtHeat": "Diaľkové teplo",
    "field.waterSupply": "Dodávka vody",
    "field.paperStandard": "Papier (štandard)",
    "field.paperEco": "Papier (eko)",
    "field.wastewaterTreatment": "Čistenie odpadových vôd",
    "field.wastePaper": "Odpadový papier",
    "field.wasteMonitors": "Odpadové monitory",
    "field.wasteElectronics": "Elektronický odpad",
    "field.wasteToners": "Odpadové tonery",
    "field.flights": "Lety",
    "field.rail": "Železnica",
    "field.taxi": "Taxi",
    "field.bus": "Autobus",
    "field.distance": "Vzdialenosť",
    "field.unit": "Jednotka",
    "field.distancePlaceholder": "vzdialenosť",

    "totals.total": "Spolu",
    "totals.scope1": "Bereich 1",
    "totals.scope2": "Bereich 2",
    "totals.scope3": "Bereich 3",
    "totals.stationary": "Spaľovanie",
    "totals.refrigerants": "Chladivá",
    "totals.cat1": "Kat. 1",
    "totals.cat5": "Kat. 5",
    "totals.cat6": "Kat. 6",

    "analytics.title": "Analytika",
    "analytics.subtitle": "Štatistiky používania a emisií pre vytvorené reporty.",
    "analytics.filters.title": "Filtre",
    "analytics.filters.subtitle": "Agregácia + voliteľný časový rozsah (ISO z lokálneho času).",
    "analytics.filters.from": "Od",
    "analytics.filters.to": "Do",
    "analytics.filters.bucket": "Agregácia",
    "analytics.summary.title": "Súhrn",
    "analytics.timeseries.title": "Časová rada ({bucket})",
    "analytics.timeseries.buckets": "{count} intervalov",
    "analytics.timeseries.noData": "Žiadne dáta pre zvolený rozsah.",
    "analytics.kpi.reports": "Reporty",
    "analytics.kpi.avgPerDay": "Priemer/deň",
    "analytics.kpi.totalSum": "Suma kg CO₂e",
    "analytics.kpi.avg": "Priemer",
    "analytics.kpi.minMax": "Min / Max",
    "analytics.kpi.periodDays": "Dní obdobia",
    "analytics.kpi.scopeAverages": "Priemery rozsahov",
    "analytics.table.bucketStart": "Začiatok",
    "analytics.table.reports": "Reporty",
    "analytics.table.sum": "Suma kg CO₂e",
    "analytics.table.avg": "Priem. kg CO₂e",
    "analytics.table.volume": "Objem",
    "bucket.day": "deň",
    "bucket.week": "týždeň",
    "bucket.month": "mesiac",

    "error.somethingWentWrong": "Niečo sa pokazilo",
    "error.pdfDownloadFailed": "Nepodarilo sa stiahnuť PDF",
    "error.pdfExportFailed": "Export PDF zlyhal ({status})",
    "error.requestFailed": "Požiadavka zlyhala ({status})",
    "error.analyticsLoadFailed": "Načítanie analytiky zlyhalo",
    "error.summaryRequestFailed": "Súhrn zlyhal ({status})",
    "error.timeseriesRequestFailed": "Časová rada zlyhala ({status})",
  },
  de: {
    "common.language": "Sprache",
    "common.analytics": "Analytik",
    "common.back": "Zurück",
    "common.refresh": "Aktualisieren",
    "common.loading": "Lädt…",
    "common.apply": "Anwenden",

    "home.title": "CO₂-Rechner",
    "home.subtitle": "Trage die Daten ein, die du hast (leere Felder werden ignoriert). Absenden erstellt einen Bericht und liefert Summen.",
    "home.reset": "Zurücksetzen",
    "home.createReport": "Bericht erstellen",
    "home.creating": "Erstelle…",
    "home.downloadPdf": "PDF herunterladen",
    "home.preparingPdf": "PDF wird vorbereitet…",
    "home.reportTotals": "Berichtssummen",
    "home.report": "Bericht",
    "home.noReportYet": "Noch kein Bericht — Formular absenden, um zu berechnen.",
    "home.scope1.title": "Ambito 1",
    "home.scope1.subtitle": "Direkte Emissionen: stationäre Verbrennung + Kältemittel.",
    "home.scope1.stationary.title": "Stationäre Verbrennung",
    "home.scope1.refrigerants.title": "Kältemittel",
    "home.scope2.title": "Ambito 2",
    "home.scope2.subtitle": "Eingekaufte Energie.",
    "home.scope3.title": "Ambito 3",
    "home.scope3.subtitle": "Indirekte Emissionen (Kategorien 1, 5, 6).",
    "home.scope3.cat1.title": "Kategorie 1",
    "home.scope3.cat5.title": "Kategorie 5",
    "home.scope3.cat6.title": "Kategorie 6 (Reisen)",
    "home.scope3.cat6.tip": "Tipp: Nur positive Distanzen werden gezählt. Leere Distanz lässt die Transportart weg.",

    "field.naturalGas": "Erdgas",
    "field.heatingMazut": "Heizöl/Mazut",
    "field.coal": "Kohle",
    "field.fleetGasoline": "Benzin (Flotte)",
    "field.fleetDiesel": "Diesel (Flotte)",
    "field.generatorsDiesel": "Diesel (Generatoren)",
    "field.r407c": "R407C",
    "field.r32": "R32",
    "field.r410a": "R410A",
    "field.electricity": "Strom",
    "field.districtHeat": "Fernwärme",
    "field.waterSupply": "Wasserversorgung",
    "field.paperStandard": "Papier (Standard)",
    "field.paperEco": "Papier (Eco)",
    "field.wastewaterTreatment": "Abwasserbehandlung",
    "field.wastePaper": "Papierabfall",
    "field.wasteMonitors": "Monitor-Abfall",
    "field.wasteElectronics": "Elektronikschrott",
    "field.wasteToners": "Toner-Abfall",
    "field.flights": "Flüge",
    "field.rail": "Bahn",
    "field.taxi": "Taxi",
    "field.bus": "Bus",
    "field.distance": "Distanz",
    "field.unit": "Einheit",
    "field.distancePlaceholder": "Distanz",

    "totals.total": "Gesamt",
    "totals.scope1": "Ambito 1",
    "totals.scope2": "Ambito 2",
    "totals.scope3": "Ambito 3",
    "totals.stationary": "Verbrennung",
    "totals.refrigerants": "Kältemittel",
    "totals.cat1": "Kat. 1",
    "totals.cat5": "Kat. 5",
    "totals.cat6": "Kat. 6",

    "analytics.title": "Analytik",
    "analytics.subtitle": "Nutzungs- und Emissionsstatistiken für generierte Berichte.",
    "analytics.filters.title": "Filter",
    "analytics.filters.subtitle": "Aggregation + optionaler Zeitraum (ISO aus lokaler Zeit).",
    "analytics.filters.from": "Von",
    "analytics.filters.to": "Bis",
    "analytics.filters.bucket": "Aggregation",
    "analytics.summary.title": "Zusammenfassung",
    "analytics.timeseries.title": "Zeitreihe ({bucket})",
    "analytics.timeseries.buckets": "{count} Intervalle",
    "analytics.timeseries.noData": "Keine Daten für den gewählten Zeitraum.",
    "analytics.kpi.reports": "Berichte",
    "analytics.kpi.avgPerDay": "Ø/Tag",
    "analytics.kpi.totalSum": "Summe kg CO₂e",
    "analytics.kpi.avg": "Ø",
    "analytics.kpi.minMax": "Min / Max",
    "analytics.kpi.periodDays": "Tage",
    "analytics.kpi.scopeAverages": "Durchschnitt je Bereich",
    "analytics.table.bucketStart": "Start",
    "analytics.table.reports": "Berichte",
    "analytics.table.sum": "Summe kg CO₂e",
    "analytics.table.avg": "Ø kg CO₂e",
    "analytics.table.volume": "Volumen",
    "bucket.day": "Tag",
    "bucket.week": "Woche",
    "bucket.month": "Monat",

    "error.somethingWentWrong": "Etwas ist schiefgelaufen",
    "error.pdfDownloadFailed": "PDF-Download fehlgeschlagen",
    "error.pdfExportFailed": "PDF-Export fehlgeschlagen ({status})",
    "error.requestFailed": "Anfrage fehlgeschlagen ({status})",
    "error.analyticsLoadFailed": "Analytik konnte nicht geladen werden",
    "error.summaryRequestFailed": "Zusammenfassung fehlgeschlagen ({status})",
    "error.timeseriesRequestFailed": "Zeitreihe fehlgeschlagen ({status})",
  },
  it: {
    "common.language": "Lingua",
    "common.analytics": "Analisi",
    "common.back": "Indietro",
    "common.refresh": "Aggiorna",
    "common.loading": "Caricamento…",
    "common.apply": "Applica",

    "home.title": "Calcolatore Carbonio",
    "home.subtitle": "Compila le categorie disponibili (i campi vuoti vengono ignorati). L’invio crea un report e restituisce i totali.",
    "home.reset": "Reset",
    "home.createReport": "Crea report",
    "home.creating": "Creazione…",
    "home.downloadPdf": "Scarica PDF",
    "home.preparingPdf": "Preparazione PDF…",
    "home.reportTotals": "Totali report",
    "home.report": "Report",
    "home.noReportYet": "Nessun report — invia il modulo per calcolare.",
    "home.scope1.title": "Opseg 1",
    "home.scope1.subtitle": "Emissioni dirette: combustione stazionaria + refrigeranti.",
    "home.scope1.stationary.title": "Combustione stazionaria",
    "home.scope1.refrigerants.title": "Refrigeranti",
    "home.scope2.title": "Opseg 2",
    "home.scope2.subtitle": "Energia acquistata.",
    "home.scope3.title": "Opseg 3",
    "home.scope3.subtitle": "Emissioni indirette (categorie 1, 5, 6).",
    "home.scope3.cat1.title": "Categoria 1",
    "home.scope3.cat5.title": "Categoria 5",
    "home.scope3.cat6.title": "Categoria 6 (viaggi)",
    "home.scope3.cat6.tip": "Suggerimento: contano solo distanze positive. Lasciare vuoto esclude quel mezzo di trasporto.",

    "field.naturalGas": "Gas naturale",
    "field.heatingMazut": "Olio combustibile",
    "field.coal": "Carbone",
    "field.fleetGasoline": "Benzina (flotta)",
    "field.fleetDiesel": "Diesel (flotta)",
    "field.generatorsDiesel": "Diesel (generatori)",
    "field.r407c": "R407C",
    "field.r32": "R32",
    "field.r410a": "R410A",
    "field.electricity": "Elettricità",
    "field.districtHeat": "Teleriscaldamento",
    "field.waterSupply": "Fornitura acqua",
    "field.paperStandard": "Carta (standard)",
    "field.paperEco": "Carta (eco)",
    "field.wastewaterTreatment": "Trattamento acque reflue",
    "field.wastePaper": "Rifiuti carta",
    "field.wasteMonitors": "Rifiuti monitor",
    "field.wasteElectronics": "Rifiuti elettronici",
    "field.wasteToners": "Rifiuti toner",
    "field.flights": "Voli",
    "field.rail": "Treno",
    "field.taxi": "Taxi",
    "field.bus": "Autobus",
    "field.distance": "Distanza",
    "field.unit": "Unità",
    "field.distancePlaceholder": "distanza",

    "totals.total": "Totale",
    "totals.scope1": "Opseg 1",
    "totals.scope2": "Opseg 2",
    "totals.scope3": "Opseg 3",
    "totals.stationary": "Combustione",
    "totals.refrigerants": "Refrigeranti",
    "totals.cat1": "Cat. 1",
    "totals.cat5": "Cat. 5",
    "totals.cat6": "Cat. 6",

    "analytics.title": "Analisi",
    "analytics.subtitle": "Statistiche di utilizzo ed emissioni per i report generati.",
    "analytics.filters.title": "Filtri",
    "analytics.filters.subtitle": "Aggregazione + intervallo opzionale (ISO dal tempo locale).",
    "analytics.filters.from": "Da",
    "analytics.filters.to": "A",
    "analytics.filters.bucket": "Aggregazione",
    "analytics.summary.title": "Riepilogo",
    "analytics.timeseries.title": "Serie temporale ({bucket})",
    "analytics.timeseries.buckets": "{count} intervalli",
    "analytics.timeseries.noData": "Nessun dato per l’intervallo selezionato.",
    "analytics.kpi.reports": "Report",
    "analytics.kpi.avgPerDay": "Media/giorno",
    "analytics.kpi.totalSum": "Totale kg CO₂e (somma)",
    "analytics.kpi.avg": "Media",
    "analytics.kpi.minMax": "Min / Max",
    "analytics.kpi.periodDays": "Giorni",
    "analytics.kpi.scopeAverages": "Medie per ambito",
    "analytics.table.bucketStart": "Inizio",
    "analytics.table.reports": "Report",
    "analytics.table.sum": "Somma kg CO₂e",
    "analytics.table.avg": "Media kg CO₂e",
    "analytics.table.volume": "Volume",
    "bucket.day": "giorno",
    "bucket.week": "settimana",
    "bucket.month": "mese",

    "error.somethingWentWrong": "Qualcosa è andato storto",
    "error.pdfDownloadFailed": "Download PDF non riuscito",
    "error.pdfExportFailed": "Esportazione PDF non riuscita ({status})",
    "error.requestFailed": "Richiesta non riuscita ({status})",
    "error.analyticsLoadFailed": "Caricamento analisi non riuscito",
    "error.summaryRequestFailed": "Riepilogo non riuscito ({status})",
    "error.timeseriesRequestFailed": "Serie temporale non riuscita ({status})",
  },
  hr: {
    "common.language": "Jezik",
    "common.analytics": "Analitika",
    "common.back": "Natrag",
    "common.refresh": "Osvježi",
    "common.loading": "Učitavanje…",
    "common.apply": "Primijeni",

    "home.title": "Kalkulator ugljika",
    "home.subtitle": "Unesite podatke koje imate (prazna polja se ignoriraju). Slanje stvara izvještaj i vraća zbrojeve.",
    "home.reset": "Reset",
    "home.createReport": "Stvori izvještaj",
    "home.creating": "Stvaranje…",
    "home.downloadPdf": "Preuzmi PDF",
    "home.preparingPdf": "Priprema PDF…",
    "home.reportTotals": "Ukupno izvještaja",
    "home.report": "Izvještaj",
    "home.noReportYet": "Još nema izvještaja — pošaljite obrazac za izračun.",
    "home.scope1.title": "Scope 1",
    "home.scope1.subtitle": "Izravne emisije: stacionarno izgaranje + rashladna sredstva.",
    "home.scope1.stationary.title": "Stacionarno izgaranje",
    "home.scope1.refrigerants.title": "Rashladna sredstva",
    "home.scope2.title": "Scope 2",
    "home.scope2.subtitle": "Kupljena energija.",
    "home.scope3.title": "Scope 3",
    "home.scope3.subtitle": "Neizravne emisije (kategorije 1, 5, 6).",
    "home.scope3.cat1.title": "Kategorija 1",
    "home.scope3.cat5.title": "Kategorija 5",
    "home.scope3.cat6.title": "Kategorija 6 (putovanja)",
    "home.scope3.cat6.tip": "Savjet: računaju se samo pozitivne udaljenosti. Prazno polje izostavlja taj način putovanja.",

    "field.naturalGas": "Prirodni plin",
    "field.heatingMazut": "Lož ulje (mazut)",
    "field.coal": "Ugljen",
    "field.fleetGasoline": "Benzin (flota)",
    "field.fleetDiesel": "Dizel (flota)",
    "field.generatorsDiesel": "Dizel (generatori)",
    "field.r407c": "R407C",
    "field.r32": "R32",
    "field.r410a": "R410A",
    "field.electricity": "Električna energija",
    "field.districtHeat": "Toplina iz mreže",
    "field.waterSupply": "Opskrba vodom",
    "field.paperStandard": "Papir (standard)",
    "field.paperEco": "Papir (eko)",
    "field.wastewaterTreatment": "Pročišćavanje otpadnih voda",
    "field.wastePaper": "Otpadni papir",
    "field.wasteMonitors": "Otpadni monitori",
    "field.wasteElectronics": "Elektronički otpad",
    "field.wasteToners": "Otpadni toneri",
    "field.flights": "Letovi",
    "field.rail": "Željeznica",
    "field.taxi": "Taksi",
    "field.bus": "Autobus",
    "field.distance": "Udaljenost",
    "field.unit": "Jedinica",
    "field.distancePlaceholder": "udaljenost",

    "totals.total": "Ukupno",
    "totals.scope1": "Scope 1",
    "totals.scope2": "Scope 2",
    "totals.scope3": "Scope 3",
    "totals.stationary": "Izgaranje",
    "totals.refrigerants": "Rashladna sredstva",
    "totals.cat1": "Kat. 1",
    "totals.cat5": "Kat. 5",
    "totals.cat6": "Kat. 6",

    "analytics.title": "Analitika",
    "analytics.subtitle": "Statistika korištenja i emisija za generirane izvještaje.",
    "analytics.filters.title": "Filteri",
    "analytics.filters.subtitle": "Agregacija + opcionalni vremenski raspon (ISO iz lokalnog vremena).",
    "analytics.filters.from": "Od",
    "analytics.filters.to": "Do",
    "analytics.filters.bucket": "Agregacija",
    "analytics.summary.title": "Sažetak",
    "analytics.timeseries.title": "Vremenska serija ({bucket})",
    "analytics.timeseries.buckets": "{count} razdoblja",
    "analytics.timeseries.noData": "Nema podataka za odabrani raspon.",
    "analytics.kpi.reports": "Izvještaji",
    "analytics.kpi.avgPerDay": "Prosjek/dan",
    "analytics.kpi.totalSum": "Ukupno kg CO₂e (zbroj)",
    "analytics.kpi.avg": "Prosjek",
    "analytics.kpi.minMax": "Min / Max",
    "analytics.kpi.periodDays": "Dani",
    "analytics.kpi.scopeAverages": "Prosjeci po opsezima",
    "analytics.table.bucketStart": "Početak",
    "analytics.table.reports": "Izvještaji",
    "analytics.table.sum": "Zbroj kg CO₂e",
    "analytics.table.avg": "Prosj. kg CO₂e",
    "analytics.table.volume": "Volumen",
    "bucket.day": "dan",
    "bucket.week": "tjedan",
    "bucket.month": "mjesec",

    "error.somethingWentWrong": "Nešto je pošlo po zlu",
    "error.pdfDownloadFailed": "Preuzimanje PDF-a nije uspjelo",
    "error.pdfExportFailed": "Izvoz PDF-a nije uspio ({status})",
    "error.requestFailed": "Zahtjev nije uspio ({status})",
    "error.analyticsLoadFailed": "Učitavanje analitike nije uspjelo",
    "error.summaryRequestFailed": "Sažetak nije uspio ({status})",
    "error.timeseriesRequestFailed": "Vremenska serija nije uspjela ({status})",
  },
};

