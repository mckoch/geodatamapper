<?php

class TextFileImport extends DBI {

    protected $defsfile;
    protected $defs;
    protected $sdawfile;

    public function getDefs($path) {
        return $this->defs->$path;
    }

    public function loadDefsFile($defsfile) {
        $this->defsfile = $defsfile;
        $this->defs = GH::getXmlFile($this->defsfile); // debug: echo "<pre>"; print_r($defs);
        return;
    }

    public function loadSdawFile($sdawfile) {
        global $lockfilehandle; // LOGGING
        $this->sdawfile = $sdawfile;
        $filelines = count(file($sdawfile));
        fwrite($lockfilehandle, '#TOTAL LINES ' . $filelines . ' '. PHP_EOL);
        $pc = $filelines / 100;
        $pcdone = 0;

        $sdawfilehandle = fopen($this->sdawfile, "r+");
        if (flock($sdawfilehandle, LOCK_EX | LOCK_NB)) { // do an exclusive lock on USER
            $file = file($this->sdawfile);
            $ver = new VERSION;
            $ver->setHeaderDefs(GH::getXmlFile($GLOBALS[$this->defs->filetype . 'KopfDatenFile']));

    
    /**
    
    
      propietärer Code,
      Kontakt: emcekah@gmail.com
      
    
    **/
            fwrite($lockfilehandle, '#END PROCESSING '. PHP_EOL);
            fclose($sdawfilehandle);
            $_SESSION['lines'] = $lines;
            $_SESSION['loops'] = $loops;
            $_SESSION['looplines'] = $looplines;
            $_SESSION['updates'] = $updates;
            $_SESSION['inserts'] = $inserts;
            $_SESSION['linedeletes'] = $linedeletes;
            $_SESSION['loopdeletes'] = $loopdeletes;
            return true;
        } else
            fwrite($lockfilehandle, '#DIE LOCKED FILE ');
        return false;
    }

}

?>