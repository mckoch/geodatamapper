<?php

class DISP {

    function __construct() {

    }

    protected $params = '';

    public function exec($exec, $params='') {
        try {
            switch ($exec) {
                case 'info':
                    $db = new DBI;
                    /**
                     * schauderhaftes Return (screen only)!!!
                     * @todo korrektes Objekt erzeugen
                     */
                    return $db->countRecords() . '<br/>' . $db->listTables() . '<br/>';
                    break;
                /**
                 * aus GET: PLZ Polygone suchen.
                 * _keine_ Suche im Bestand!
                 */
                case 'plzpolygons':
                    require_once (INCLUDEDIR . 'FINDER.inc.php');
                    $f = new FINDER;
                    //$f->setparams($this->params);
                    //print_r($this->params);
                    return $f->plz2polygons(json_decode($_GET['pastedata']));
                    break;
                case 'polygon':
                    require_once (INCLUDEDIR . 'FINDER.inc.php');
                    $f = new FINDER;
                    $f->setparams(json_decode($this->params));
                    return $f->polygonSearch();
                    break;
                case 'rectangle':
                    require_once (INCLUDEDIR . 'FINDER.inc.php');
                    $f = new FINDER;
                    $f->setparams($this->params);
                    return $f->rectangleSearch();
                    break;
                case 'gpos':
                    require_once (INCLUDEDIR . 'FINDER.inc.php');
                    $f = new FINDER;
                    $f->setparams($this->params);
                    return $f->gposAreaSearch();
                    break;
                case 'dynamicsearch':
                    require_once (INCLUDEDIR . 'FINDER.inc.php');
                    $f = new FINDER;
                    $f->setparams($this->params);
                    return $f->doDynamicSearch();
                    break;

                case 'find':
                    require_once (INCLUDEDIR . 'FINDER.inc.php');
                    $f = new FINDER;
                    $f->setparams($this->params);
                    return $f->doSearch();
                    break;

                case 'init':
                    return new INIT;
                    break;

                case 'newtable':
                    require_once (INCLUDEDIR . 'XmlTableStructureImport.inc.php');
                    return new XmlTableStructureImport;
                    break;

                case 'insert':
                    require_once (INCLUDEDIR . 'TextFileImport.inc.php');
                    return new TextFileImport;
                    break;

                case 'export':
                    require_once (INCLUDEDIR . 'TextFileExport.inc.php');
                    return new TextFileExport;
                    break;
            }
            return false;
        } catch (Exception $e) {
            echo "<pre>" . $e . "</pre>";
        }
    }

    public function setparams($params) {
        $this->params = $params;
        return;
    }

}

?> 
