<?php

class XmlTableStructureImport extends DBI {

    protected $xmlfile;
    protected $xml;

    public function getXmlFile($file) {
        $this->xmlfile = $file;
        $this->xml = GH::getXmlFile($this->xmlfile);
        return;
    }

    public function writeNewTable() {
        parent::sqldebug(true);
        self::dropTable();
        self::createTable();
        self::createFields();
        self::createIndexes();
        self::createPrimaryIndex();
        return;
    }

    private function dropTable() {
        if ($this->xml->loop) {
            foreach ($this->xml->loop as $loop) {
                parent::exec("DROP TABLE IF EXISTS " . $this->xml->filetype . $loop->title . ";");
            }
        }
        $table = $this->xml->filetype;
        return parent::exec("DROP TABLE IF EXISTS " . $table . ";");
    }
    private function createTable() {
        if ($this->xml->loop) {
            foreach ($this->xml->loop as $loop) {
                parent::exec("CREATE TABLE IF NOT EXISTS " . $this->xml->filetype . $loop->title
                        . " (count MEDIUMINT NOT NULL AUTO_INCREMENT, PRIMARY KEY (count));");
            }
        }
        return parent::exec("CREATE TABLE IF NOT EXISTS " . $this->xml->filetype
                        . " (count MEDIUMINT NOT NULL AUTO_INCREMENT, PRIMARY KEY (count));");
    }

    private function createFields() {
        $headerdefs = GH::getXmlFile($GLOBALS[substr($this->xml->filetype,0,3) . 'KopfDatenFile']);

        foreach ($this->xml->sdawfieldset->field as $field) {
            parent::exec("ALTER TABLE " . $this->xml->filetype . " ADD `" . $field->title . "` "
                    . $field->type . "(" . $field->length . ") NOT NULL;");
        }
        if ($headerdefs->series) {
            print "series: ";
            $series = $headerdefs->series;
            foreach ($series->field as $field) {
                parent::exec("ALTER TABLE " . $this->xml->filetype . " ADD `" . $field->title . "` "
                        . $field->type . "(" . $field->length . ") NOT NULL;");
            }
        }
        if ($this->xml->loop) {
            print "loop: ";
            foreach ($this->xml->loop as $loop) {
                foreach ($this->xml->loop->field as $field) {
                    parent::exec("ALTER TABLE " . $this->xml->filetype . $loop->title
                            . " ADD `" . $field->title . "` " . $field->type . "("
                            . $field->length . ") NOT NULL;");
                }
                foreach ($this->xml->uniqueitemid->index as $field) {
                    parent::exec("ALTER TABLE " . $this->xml->filetype . $loop->title
                            . " ADD `" . $field->name . "` " . $field->type . "("
                            . $field->length . ") NOT NULL;");
                }
            }
        }
        return;
    }

    private function createIndexes() {
        print "indexes: ";
        foreach ($this->xml->keys->index as $index) {
            parent::exec("CREATE FULLTEXT INDEX `IDX_" . $this->xml->filetype . '_' . $index . "` ON `"
                    . $this->xml->filetype
                    . "` (" . $index . ");");
        }
        if ($this->xml->loop) {
            foreach ($this->xml->loop as $loop) {
                foreach ($loop->keys->index as $index) {
                    parent::exec("CREATE FULLTEXT INDEX `IDX_" . $this->xml->filetype . $loop->title . '_' . $index . "` ON `"
                            . $this->xml->filetype . $loop->title . "` (" . $index . ");");
                }
            }
        }
        return;
    }

    private function createPrimaryIndex() {
        if ($this->xml->loop) {
            foreach ($this->xml->loop as $loop) {
                return parent::exec("ALTER TABLE " . $this->xml->filetype . $loop->title
                                . " ADD CONSTRAINT  PIDX_" . $this->xml->filetype . $loop->title
                                . " UNIQUE (" . $loop->keys->primary . ");");
            }
        }
        return parent::exec("ALTER TABLE " . $this->xml->filetype
                        . " ADD CONSTRAINT PIDX_" . $this->xml->filetype . " UNIQUE ("
                        . $this->xml->keys->primary . ");");
    }

}

