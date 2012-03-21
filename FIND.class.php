<?php
class FIND extends DBI {

    private $params;

    public function setparams($params) {
        $this->params = $params;
        return true;
    }

    public function plz2polygons($data) {
        $sql = "SELECT plz99, plzort99, the_geom FROM   post_code_areas WHERE ";
        foreach ($data as $plz) {
            $sql .= "plz99_n=" . $plz . " OR plz99 LIKE '" . $plz . "' OR ";
        }
        $sql = substr($sql, 0, -3);
        parent::sqldebug(false);
        return parent::rs($sql);
    }

    public function sysidsearch($data) {
        $gfk = explode(',', $this->params['gfk']);
        $prc = explode(',', $this->params['prc']);
        $sql = "SELECT * FROM DATA WHERE  (";
          $or = '';
        foreach ($data as $id) {
            $or .= "count=" . $id . " OR ";
        }
        $sql .= substr($or, 0, -3) . ")";
        parent::sqldebug(false);
        return parent::rs($sql);
    }

    public function plzsearch($data) {
        $gfk = explode(',', $this->params['gfk']);
        $prc = explode(',', $this->params['prc']);
        $sql = "SELECT * FROM DATA WHERE  (";
        $or = '';
        foreach ($data as $plz) {
            $or .= "plz=" . $plz . " OR ";
        }
        $sql .= substr($or, 0, -3) . ")";
        parent::sqldebug(false);
        return parent::rs($sql);
    }

    public function polygonSearch() {
        $bbox = 'POLYGON((';
        $i = 0;
        foreach ($this->params->b as $param) {
            $arr = array_keys(get_object_vars($param));
            $bbox .= $param->$arr[0] . ' ' . $param->$arr[1] . ',';
            if ($i == 0) {
                $start = $param->$arr[0] . ' ' . $param->$arr[1];
            }
            $i++;
        }
        $bbox .= $start . "))";
        $gfk = explode(',', $_GET['gfk']);
        $prc = explode(',', $_GET['prc']);
        parent::sqldebug(false);
        $sql = "SELECT * FROM DATA  WHERE 
        Intersects( GeomFromText( CONCAT(
            'POINT(', DATA.latitude, ' ', DATA.longitude ,')'),4326) , GeomFromText('" . $bbox . "',4326) )";
        return parent::rs($sql);
    }

    public function rectangleSearch() {
        $pms = explode(',', $this->params);
        $gfk = explode(',', $_GET['gfk']);
        $prc = explode(',', $_GET['prc']);
        $sql = "SELECT * FROM DATA WHERE  
        latitude >= $pms[0] AND latitude <= $pms[2] AND
        longitude >= $pms[1] AND longitude <=$pms[3]";
        parent::sqldebug(false);
        return parent::rs($sql);
    }

    public function gposAreaSearch() {
        $lat = $this->params['latitude'];
        $lng = $this->params['longitude'];
        $distance = $this->params['umkreis'] / 1000;
        $gfk = explode(',', $_GET['gfk']);
        $prc = explode(',', $_GET['prc']);

        $sql = "SELECT *, ( 6371 * acos( cos( radians($lat) ) * cos( radians( latitude ) ) * cos( radians( longitude )
            - radians($lng) ) + sin( radians($lat) ) * sin( radians( latitude ) ) ) )
            AS distance FROM DATA WHERE 1 
        HAVING distance <= $distance ORDER BY distance LIMIT 0 , 10000;";

        parent::sqldebug(false);
        return parent::rs($sql);
    }

    public function doSearch() {

        if ($this->params == 'default') {
            $sql = 'SELECT * FROM DATA_DEFAULT'; // WHERE ' . parent::gqstr($this->params['plz']);
            $sql .= ' ORDER BY latitude,longitude LIMIT 200';
        } else {
            $p = explode(' ', $this->params['value']);
            if (array_count_values($p) > 1) {
                $sql = 'SELECT * FROM DATA  WHERE  ';
                foreach ($p as $psub) {
                    if (is_numeric($psub)) {
                        $sql .= ' PLZ LIKE \'' . $psub . '\'';
                    } else {
                        $sql .= ' AND Ortsteil LIKE \'' . html_entity_decode($psub) . '%\' ';
                    }
                }
                $sql .= ' ORDER BY latitude,longitude LIMIT 200';
            }
            if ($this->params['latitude'] > 0 && $this->params['longitude'] > 0) {
                $sql = 'SELECT * FROM DATA  WHERE  longitude LIKE \'' . $this->params['longitude']
                        . '\' AND latitude  LIKE \'' . $this->params['latitude'] . '\' LIMIT 2000';
            }
        }
        parent::sqldebug(false);
        return parent::rs($sql);
    }

}

?>