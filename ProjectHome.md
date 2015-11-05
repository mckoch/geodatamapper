Haupt­be­stand­teile des GDM sind Datenbank-Engine (MySql/ADODB), Geo-Standorte/Stellen API (PHP) und Benut­zer­ober­flä­che. Zur Geo­co­die­rung und Kar­ten­er­zeu­gung wird GMaps Java­Script API 3.x ver­wen­det.

Blog aktuell unter http://cm.inextsolutions.net/wordpress/

# GeoDataMapper #
GeoDataMapper (kurz: GDM) ist eine Klassenbibliothek zur Verwaltung und Darstellung umfangreicher geolokalisierter Datenbestände.  GDM verfügt über XML-konfigurierbare Import- und Exportschnittstellen für frei definierbare Formate, ein umfangreiche API zur Abfrage sowie modulare „Snippets“ zur Gestaltung des Googlemaps-basierten User-Interfaces.
## Module ##
### Interface gmaps ###
Alle Interaktionen werden über den Browser des Benutzers abgewickelt. Die gesamte Oberfläche ist in Jquery/JqueryUI realisiert und macht ausgiebigen Gebrauch verschiedener Open Source-Bibliotheken sowie der Google Maps JavaScript API.
### API ###
Die serverbasierten Komponenten des GDM sind in PHP ungesetzt; als Datenbankengine dient aktuell MySQL (der Programmcode verwendet ADODB). Auch hier wurden verschiedene Open Source-Bibliotheken zusätzlich verwendet.
### Im-/Exporter ###
Die per XML konfigurierbaren Importbibliotheken des GDM ermöglichen die Verwendung gängiger Austauschformate (z.B. CSV, XML, RSS, SDAW).
### Dispatcher ###
Die Dispatcher-Klasse dient im Wesentlichen zum „Verkitten“ der Komponenten zu einer Anwendung (Umsetzung der API-Funktionen).
### Konfigurationsdateien ###
Die von der API verwendeten Tabellen werden vollständig per XML konfiguriert (sowohl bei der Erzeugung als auch beim Import). Hierbei werden neben linearen Importen auch regelbasierte  Prozeduren formulierbar.
### Hilfstabellen ###
Als Hilfstabellen sind (exemplarisch) eine PLZ-Datenbank (OpenGeoDB) sowie Datenauszüge (Flächen- und Bevölkerungsdaten) des Projektes Genesis (statistische Landesämter) verfügbar.
### Termin-Modul ###
Dieser optionale Teil ermöglicht die Verwendung datumsbasierter Daten (API und Interface).
## Lizenzliches ##
Map-Interface,  Beispieldateien und weite Teile des API-Codes sind unter einer GNU GPL-Lizenz verwendbar, soweit sie GPL-kompatible Komponenten verwenden. Einige Teile des PHP-Codes sowie verfügbare Dokumentation unterliegen einer CreativeCommons-Lizenz (NC BA).
## Support ##
Dokumentation und Support sowie Vorlagen für spezifische Formate (SDAW) sind auf Anfrage beim Autor emcekah@gmail.com erhältlich.

## Screenshots ##
<img src='http://cm.inextsolutions.net/wordpress/wp-content/uploads/2011/08/V04-compact.png' />

# Infos zur Anwendung #
finden sich im Blog unter http://cm.inextsolutions.net/wordpress/.