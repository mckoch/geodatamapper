<?php

try {
    if (isset($_GET['command'])) {
        $do = $_GET['command'];
    } else
        $do='default';
        
    $d = new DISP;

    switch ($do) {
        case 'graphics':
            $d->setparams($_GET);
            return print GH::makePlzPolyPointData($d->exec('plzpolygons'));
            break;
        case '1':
            $d->setparams('default');
            return print GH::makeMapResultsDiv($d->exec('find'));
            break;
        case '2':
            $d->setparams($_GET);

            return print GH::makeDynamicSearchJSON($d->exec('find'));
            break;
        case '3':
            $d->setparams($_GET);
            return print GH::makeMapResultsDiv($d->exec('gpos'));
            break;
        case '4':
            $d->setparams($_GET);
            return print GH::makeDynamicSearchJSON($d->exec('gpos'));
            break;
        case '5':
            $d->setparams('default');
            return print GH::makeDynamicSearchJSON($d->exec('find'));
            break;
        case '6':
            $d->setparams($_GET['bounds']);
            return print GH::makeDynamicSearchJSON($d->exec('rectangle'));
            break;
        case '7':
            $d->setparams($_GET['bounds']);
            return print GH::makeDynamicSearchJSON($d->exec('polygon'));
            break;
        case '8':
            $d->setparams($_GET);
            return print GH::makeDynamicSearchJSON($d->exec('userdata'));
            break;
        default:
            if (isset($_GET['term'])) {
                $d->setparams($_GET['term']);
                return print GH::makeDynamicSearchInputFieldJSON($d->exec('dynamicsearch'));
            } else {
                $d->setparams('default');
                return print GH::makeMapResultsDiv($d->exec('find'));
            }
            break;
    }
} catch (Exception $e) {
    echo "<pre>" . $e . "</pre>";
}

