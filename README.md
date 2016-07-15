# geodatamapper
Automatically exported from code.google.com/p/geodatamapper
dev blog: https://github.com/mckoch/geodatamapper/blob/master/dev.inextsolutions.net%20devblog%20book.pdf

GeoDataMapper 
Version 0.2

GeoDataMapper ist ein fortgeschrittenes Control zur Darstellung von geolokalisierten Datenbeständen (Stamm-Standorte).

Standardauswahl / Reset
Die Standardauswahl beim Programmstart lädt einen definierten Satz Stammdaten (beliebige SDAW STA-Datei). Diese lässt sich durch den Benutzer zu einem beliebigen Zeitpunkt wiederherstellen.

Bestandssuche (direkte Suche in Stamm-Standorten)
Die Bestandssuche ermöglicht die freie Suche im (verschlagworteten) Bestand der eingepflegten Daten (Stamm-Standorte). Bereist während der Eingabe wird serverseitig eine Vorschlagsliste von existierenden Standorten zur Auswahl angeboten; d.h. das Suchfeld der Bestandssuche bietet nur Ergebnisse mit mindestens einem Standort im eingblendeten Ortsbereich an. Die Umkreisauswahl ist in diesem Modus nicht aktiv.

Umkreissuche (indirekte Suche nach Geo-Standorten)
Die Umkreissuche bietet während der Eingabe passende Orte auf der gesamten Karte an (Geo-Standorte).  Erst nach Auswahl eines Ortes wird geprüft, ob sich im angegebenen Umkreis des Geo-Standorts auch Stamm-Standorte befinden. Die Einstellungen des Reglers Umkreis-Auswahl wird berücksichtigt, eben so die Einstellungen des Merkmal-Filters.

Hauptkarte und Hauptauswahl
Nach Auslösen der Bestands- oder Umkreis-Suche werden die Treffer der Stamm-Standorte owohl auf der Karte eingeblendet als auch in der Hauptauswahl (Ergebnisliste) dargestellt. Bei größeren Treffermengen wird die Ergebnisliste paginiert. Die Darstellung in der Hauptkarte folgt der Paginierung. Die Hauptkarte ist ein vollwertiges Google Maps Control mit gewohnter Bedienungsweise.

Merkzettel und Merkliste
Der Merkzettel befindet sich auf einer eigenen Registerkarte und folgt der Darstellung der Ergebnisliste in der Hauptauswahl. Die Merkliste wird dauerhaft eingeblendet und bietet einen detaillierten Überblick über markierte Stamm-Standorte.

Kartendarstellung Merkzettel und Merkliste / als Hauptauswahl laden
Durch einen Klick auf die Schaltfläche "Merkzettel laden" wird der gesamte Inhalt in die Hauptauswahl geladen, paginiert und entsprechend in der Hauptkarte dargestellt. Die Einstellung des Umkreis-Reglers wird nicht berücksichtigt.

Umkreis-Auswahl (Regler, Zoom-Control)
Die Einstellungen des Reglers Umkreis-Auswahl werden bei jeder Umkreissuche (Eingabefeld oder Klick auf Icon Umkreis-Suche) sowie Strecken-Suchen berücksichtigt. Die aktuelle Einstellung erscheint im Zoom-Control. Eine Veränderung des Reglers Umkreis-Auswahl, Klick auf die Reglerfläche oder auf das Zoom-Control lösen sofort eine Umkreissuche relativ zum zu Letzt markierten Standort aus. 

Umkreis-Mittelpunkt und Hauptkarte
Nach einer Umkreis-Suche und ggfls. folgenden Paginierung befinden sich weder geographischer Auswahl-Mittelpunkt noch Standort-Koordinaten im Zentrum der Hauptkarte, da diese sich in Position und gewählter Zoomstufe stets beim Ladevorgang an die aktuell angezeigte Hauptauswahl und deren Paginierung anpasst. 

Standorte auf Merkliste übernehmen
Eine Übernahme von Standorten in die Merkliste geschieht durch einfachen Klick auf das in die Standort-Details jeweils eingelassen Symbol für die Merkliste.

Standorte von Merkliste entfernen
Ein Klick auf das Markierungssysmbol in den Standort-Details entfernt den Standort von Merkliste und Merkzettel.

Hauptauswahl absenden / Anfrage aus Merkliste
Nach kurzer Abfrgae von Kontaktinformationen wird eine Kopie des strukturierten Inhalts der Merkliste als HTML-Email versandt. 

Such-Verlauf
Im Such-Verlauf sind die im Verlauf der Sitzung erfogten Suchen gespeichert. Bei Klick wird die Suche unter Berücksichtigung des Werts der aktuellen Umkreis, Filter- und Paginierungs-Einstellungen in Hauptauswahl und Hauptkarte geladen.
