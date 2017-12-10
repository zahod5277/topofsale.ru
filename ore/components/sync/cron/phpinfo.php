<?php
define('MODX_API_MODE', true);
require '/home/s10743/www/index.php';

$page = $modx->getObject('modResource',1);
echo $page->get('pagetitle');