<?php

class GH {
    static function getVisitorInfo() {
        require_once( INCLUDEDIR . 'geoip.inc.php');
        return $vsrc;
    }

    static function makePlzPolyPointData($rs) {
        foreach ($rs as $data) {
            $js[] = array('label' => htmlentities($data['plzort99']), 'plz' => $data['plz99'], 'poly' => $data['the_geom']);
        }
        return json_encode($js);
    }


    static function makeDynamicSearchInputFieldJSON($rs) {
        $result = '';
        foreach ($rs as $data) {
            $js[] = array('label' => $data['PLZ'] . " " . utf8_encode($data['Ortsteil']),
                'value' => $data['PLZ'] . " " . utf8_encode($data['Ortsteil']),
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude']
            );
        }
        return json_encode($js);
    }

    static function makeDynamicSearchJSON($rs) {
        $result = '';
        if (GH::checkIfAdmin() == true) {
            foreach ($rs as $data) {
                if ($data['Leistungswert1'] == 0) {
                    $leistungswert1 = '';
                } else {
                    $leistungswert1 = $data['Leistungswert1'];
                }
                $js[] = array('label' => $data['PLZ'] . " " . utf8_encode($data['Ortsteil']),
                    'value' => $data['PLZ'] . " " . utf8_encode($data['Ortsteil']),
                    'latitude' => $data['latitude'],
                    'longitude' => $data['longitude'],
                    'id' => $data['count'],
                    'description' => utf8_encode($data['Standortbezeichnung']),
                    'plz' => $data['PLZ'],
                    'stellenart' => $data['Stellenart'],
                    'leistungswert1' => $leistungswert1,
                    'ortskennziffer' => $data['StatOrtskz'],
                    'preis' => $data['Preis'],
                    'beleuchtung' => $data['Beleuchtung'],
                    'standortnr' => $data['Standortnr'],
                    'belegdauerart' => $data['Belegdauerart'],
                    'bauart' => $data['Bauart'],
                    'hoehe' => $data['AbmessungenH'],
                    'breite' => $data['AbmessungenB'],
                    'aktiverstatus' => $data['AktiverStatus']
                );
            }
        } else {
            foreach ($rs as $data) {
                if ($data['Leistungswert1'] == 0) {
                    $leistungswert1 = '';
                } else {
                    $leistungswert1 = $data['Leistungswert1'];
                }
                $js[] = array('label' => $data['PLZ'] . " " . utf8_encode($data['Ortsteil']),
                    'value' => $data['PLZ'] . " " . utf8_encode($data['Ortsteil']),
                    'latitude' => $data['latitude'],
                    'longitude' => $data['longitude'],
                    'id' => $data['count'],
                    'description' => utf8_encode($data['Standortbezeichnung']),
                    'plz' => $data['PLZ'],
                    'stellenart' => $data['Stellenart'],
                    'leistungswert1' => $leistungswert1,
                    'ortskennziffer' => 'NA',
                    'preis' => $data['Preis'],
                    'beleuchtung' => $data['Beleuchtung'],
                    'standortnr' => 'NA',
                    'belegdauerart' => $data['Belegdauerart'],
                    'bauart' => $data['Bauart'],
                    'hoehe' => $data['AbmessungenH'],
                    'breite' => $data['AbmessungenB'],
                    'aktiverstatus' => $data['AktiverStatus']
                );
            }
        }
        return json_encode($js);
    }

    static function makeMapResultsDiv($rs) {
        $result = '';
        foreach ($rs as $data) {
            $result .= "<div class=\"map-location " . $data['count'] . "\" s-class=\"" . $data['count'] . "\" data-jmapping=\"{id: " . $data['count']
                    . ", point: {lng: " . $data['longitude'] . ", lat: " . $data['latitude'] . "}, category: '" . $data['Beleuchtung'] . "'}\">"
                    . "<span class=\"ui-icon fff-icon-folder-add\" style=\"float: left\"></span>"
                    . "<span class=\"ui-icon fff-icon-" . substr($data['Stellenart'], 0, 2) . "\" style=\"float: left\"></span>"
                    . "<span class=\"ui-icon fff-icon-bullet-yellow\" style=\"float: left\" rel=\"" . $data['Preis'] . "\"></span>"
                    . "<span class=\"ui-icon fff-icon-tag-green\" style=\"float: left\" rel=\"" . $data['Leistungswert1'] . "\"></span>"
                    . "<span class=\"ui-icon fff-icon-arrow-refresh-small\" style=\"float: left\"" . " longitude=\"" . $data['longitude'] . "\" latitude=\"" . $data['latitude'] . "\"></span>"
                    . "<a href=\"#\" class=\"map-link " . $data['count'] . " " . $data['Beleuchtung'] . "\" PLZ=\"" . $data['PLZ']
                    . "\" description=\"" . $data['Standortbezeichnung'] . "\" "
                    . " longitude=\"" . $data['longitude'] . "\" latitude=\"" . $data['latitude'] . "\">"
                    . "<span class=\"ui-icon fff-icon-comment\" style=\"float: left\"></span>"
                    . $data['PLZ'] . " " . $data['Ortsteil'] . "</a>"
                    . "<div class=\"info-box " . $data['Beleuchtung'] . "\"><img src=\"img/120x120/" . $data['count'] . ".png\""
                    . " rel=\"" . $data['count'] . "\"/>"
                    . $data['PLZ'] . " " . $data['Ortsteil'] . " | " . $data['Beleuchtung'] . " | " . $data['Standortbezeichnung'] . " | " . $data['count'] . " | " . $data['Stellenart']
                    . "</div></div>";

        }
        return 'noop.'; // since noone needs this result....
    }

    static function getXmlFile($file) {

        libxml_use_internal_errors(true);
        $xml = simplexml_load_file($file);
        $errors = libxml_get_errors();
        foreach ($errors as $error) {
            echo "<pre>" . self::display_xml_error($error, $xml) . "</pre>";
        }
        libxml_clear_errors();
        return $xml;
        ;
    }

    static function display_xml_error($error, $xml) {
        $return = "<div class='warning'>" . $xml[$error->line - 1] . "\n";
        $return .= str_repeat('-', $error->column) . "^\n";

        switch ($error->level) {
            case LIBXML_ERR_WARNING:
                $return .= "Warning $error->code: ";
                break;
            case LIBXML_ERR_ERROR:
                $return .= "Error $error->code: ";
                break;
            case LIBXML_ERR_FATAL:
                $return .= "Fatal Error $error->code: ";
                break;
        }

        $return .= trim($error->message) .
                "\n  Line: $error->line" .
                "\n  Column: $error->column";

        if ($error->file) {
            $return .= "\n  File: $error->file";
        }

        return "$return\n\n--------------------------------------------\n\n</div>";
    }

    static function dumpObject($object) {
        var_dump(get_object_vars($object));
        var_dump(get_class_methods($object));
    }

    static function checkIfAdmin() {
        try {
            if ($_SESSION['__default']['user']->usertype) {
                $role = $_SESSION['__default']['user']->usertype;

                switch ($role) {
                    case 'Super Administrator':
                        return true;
                        break;
                    case 'Administrator':
                        return true;
                        break;
                    case 'Manager':
                        return true;
                        break;
                }
            } else
                return false;
        } catch (Exception $exc) {
              return false;
        }
    }

}

?>