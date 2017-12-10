<?php

//ini_set('display_errors', 1);
//ini_set('error_reporting', -1);

/**
 * Class SyncTools
 */
class SyncTools
{

    /** @var array $config */
    public $config = array();
    /** @var modX $modx */
    protected $modx;
    /** @var Sync $Sync */
    protected $Sync;
    /** @var $namespace */
    protected $namespace;

    /** @var mixed|null $syncService */
    protected $syncService = '';

    /**
     * @param $modx
     * @param $config
     */
    public function __construct(modX $modx, &$config)
    {
        $this->modx = $modx;
        $this->config =& $config;

        if (!$this->Sync = &$this->modx->sync) {
            $corePath = $modx->getOption('sync_core_path', null,
                $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/sync/');
            if (!$this->Sync = $modx->getService('sync', 'Sync', $corePath . 'model/sync/',
                array('core_path' => $corePath))
            ) {
                return false;
            }
        }

        $this->namespace = $this->Sync->namespace;
        $this->modx->addPackage('sync', $this->config['modelPath']);
    }

    /**
     * @param       $n
     * @param array $p
     */
    public function __call($n, array$p)
    {
        echo __METHOD__ . ' says: ' . $n;
    }

    public function getSyncService()
    {
        return $this->syncService;
    }

    public function setSyncService($service)
    {
        $this->syncService = $service;

        return $this->syncService;
    }


    public function getOption($key, $config = array(), $default = null, $skipEmpty = false)
    {
        $key = $this->syncService . '_' . $key;

        return $this->Sync->getOption($key, $config, $default, $skipEmpty);
    }

    public function log($message = '', $data = array(), $showLog = false)
    {
        $this->Sync->log($message, $data, $showLog);
    }

    public function getRows($data = array(), $key = 'rows')
    {
        return isset($data[$key]) ? $data[$key] : null;
    }

    public function isTvsRow(array $row = array(), $prefix = 'tv')
    {
        return $this->Sync->isPrefixRow($row, $prefix);
    }

    public function getWebHook(array $data = array())
    {
        return 'get default web hook';
    }

    public function setWebHook(array $data = array())
    {
        return 'set default web hook';
    }

    public function delWebHook(array $data = array())
    {
        return 'delete default web hook';
    }

    public function updWebHook(array $data = array())
    {
        return 'update default web hook';
    }

    public function runProcessor($action = '', array $data = array(), $processorsPath = '', $jsonResponse = true)
    {
        return $this->Sync->runProcessor($action, $data, $processorsPath, $jsonResponse);
    }

    public function getTempDir($data = null)
    {
        $tmpDir = $this->getOption('cache_directory', null,
            MODX_CORE_PATH . 'cache/default/' . $this->namespace . '/' . $this->getSyncService() . '/');
        if (is_array($data)) {
            $tmpDir .= md5(serialize($data)) . '/';
        }
        if (!is_writable($tmpDir)) {
            if (!$this->modx->getCacheManager()->writeTree($tmpDir)) {
                $this->log("[" . __CLASS__ . "] Temp dir not writable:", $tmpDir, true);

                return false;
            }
        }

        return $tmpDir;
    }

    public function clearTempDir()
    {
        $tmpDir = $this->getTempDir();
        $tmpDir = strtr(trim($tmpDir), '\\', '/');
        if (is_writable(dirname($tmpDir))) {
            if (!$this->modx->getCacheManager()->deleteTree($tmpDir,
                array('deleteTop' => true, 'skipDirs' => false, 'extensions' => null))
            ) {
                $this->log("[" . __CLASS__ . "] Temp dir not writable:", $tmpDir, true);

                return false;
            }
        }

        return $tmpDir;
    }

    /**
     * @return mixed|string
     */
    public function getHookUrl()
    {
        $url = $this->getOption('web_hook_url', null);

        if (empty($url)) {
            $key = 'sync_' . $this->syncService . '_web_hook_url';
            if (!$tmp = $this->modx->getObject('modSystemSetting', array(
                'key' => $key,
            ))
            ) {
                $tmp = $this->modx->newObject('modSystemSetting');
            }

            $url = $this->modx->getOption('site_url', null);
            $corePath = $this->Sync->getServiceCorePath($this->syncService);
            $assetsUrl = str_replace(MODX_CORE_PATH, MODX_ASSETS_URL, $corePath);
            $url = trim($url, '/') . $assetsUrl . 'hook.php';

            $tmp->fromArray(array(
                'xtype'     => 'textfield',
                'namespace' => 'sync' . $this->syncService,
                'area'      => 'sync_' . $this->syncService,
                'key'       => $key,
                'value'     => $url,
            ), '', true, true);
            $tmp->save();
        }

        $params = array(
            'auth' => base64_encode($this->Sync->getOption('user_username') . ":" . $this->Sync->getOption('user_password'))
        );

        return $url . '?' . http_build_query($params);
    }

    public function addSyncLock($user = 0, array $options = array())
    {
        $locked = false;

        $syncService = $this->syncService;
        if (!$user) {
            $user = session_id();
        }
        /** @var modRegistry $registry */
        if ($registry = $this->modx->getService('registry', 'registry.modRegistry')) {
            $registry->getRegister('sync_locks', 'registry.modDbRegister');
            if (!isset($registry->sync_locks)) {
                return $locked;
            }
            $registry->sync_locks->connect();
            $lockedBy = $this->getSyncLock();
            if (empty($lockedBy) || ($lockedBy == $user)) {
                $registry->sync_locks->subscribe("/lock/");
                $registry->sync_locks->send("/lock/",
                    array($syncService => $user),
                    array(
                        'ttl' => $this->getOption('lock_ttl', $options, 60)
                    ));
                $locked = true;
            } elseif ($lockedBy != $user) {
                $locked = $lockedBy;
            }
        }

        return $locked;
    }

    public function getSyncLock($user = 0)
    {
        $lock = 0;

        $syncService = $this->syncService;
        if (!$user) {
            $user = session_id();
        }
        /** @var modRegistry $registry */
        if ($registry = $this->modx->getService('registry', 'registry.modRegistry')) {
            $registry->getRegister('sync_locks', 'registry.modDbRegister');
            if (!isset($registry->sync_locks)) {
                return $lock;
            }
            $registry->sync_locks->connect();

            $registry->sync_locks->subscribe("/lock/" . $syncService);
            if ($msgs = $registry->sync_locks->read(array('remove_read' => false, 'poll_limit' => 1))) {
                $lock = reset($msgs);
            }
        }

        return $lock;
    }

    public function removeSyncLock($user = 0)
    {
        $removed = false;

        $syncService = $this->syncService;
        if (!$user) {
            $user = session_id();
        }

        /** @var modRegistry $registry */
        if ($registry = $this->modx->getService('registry', 'registry.modRegistry')) {
            $registry->getRegister('sync_locks', 'registry.modDbRegister');
            if (!isset($registry->sync_locks)) {
                return $removed;
            }
            $registry->sync_locks->connect();
            $lockedBy = $this->getSyncLock();
            if (empty($lockedBy) || $lockedBy == $user) {
                $registry->sync_locks->connect();
                $registry->sync_locks->subscribe("/lock/" . $syncService);
                $registry->sync_locks->read(array('remove_read' => true, 'poll_limit' => 1));

                $removed = true;
            }
        }

        return $removed;
    }

    public function processSyncAuth(array $row = array())
    {
        return $this->Sync->UserAuth($row);
    }

    public function processSyncObjectError(syncObject $object, $data = array(), $row = array())
    {
        if (!is_array($data)) {
            $data = json_decode($data, true);
        }
        if (!is_array($row)) {
            $row = json_decode($row, true);
        }
        $object->set("sync_error", true);
        $object->set("sync_error_msg", $data);
        $object->set("sync_error_row", $row);

        return $object->save();
    }

    public function processSyncObject($object, $syncType, $syncAction, $class = 'syncEventObject')
    {
        /** @var xPDOObject|syncObject $object */
        if (is_object($object) AND $object instanceof xPDOObject) {
            $row = $object->toArray();
        } else {
            $row = (array)$object;
        }

        $object = $this->modx->newObject($class);
        $object->fromArray($row, '', true, true);

        $object->set('sync_service', $this->syncService);
        $object->set('sync_type', $syncType);
        $object->set('sync_action', $syncAction);

        $this->modx->invokeEvent('syncOnSyncObjectProcess', array(
            'object' => &$object,
        ));

        return ($object instanceof xPDOObject) ? $object->toArray() : $object;
    }

    public function processSyncResource($object, $syncType, $syncAction, $keys = array(), $exclude = false)
    {
        /** @var xPDOObject|syncObject $object */
        if (is_object($object) AND $object instanceof xPDOObject) {
            $row = $object->toArray();
        } else {
            $row = (array)$object;
        }

        $keys = $this->Sync->cleanArray($keys);

        $syncId = $this->modx->getOption('sync_id', $row);
        $syncService = $this->syncService;

        if (!$exclude AND !empty($keys)) {
            foreach ($row as $key => $v) {
                if (!in_array($key, $keys)) {
                    unset($row[$key]);
                }
            }
        } else {
            if ($exclude AND !empty($keys)) {
                foreach ($keys as $key) {
                    if (in_array($key, $row)) {
                        unset($row[$key]);
                    }
                }
            }
        }

        /* check exist */
        $classKey = $this->modx->getOption('class_key', $row, 'modResource', true);
        $q = $this->modx->newQuery($classKey);
        $q->where(array(
            "{$classKey}.sync_id"      => $syncId,
            "{$classKey}.sync_service" => $syncService,
        ));
        $q->select("{$classKey}.id");
        if ($existId = (int)$this->modx->getValue($q->prepare())) {
            $action = 'update';
            $row['id'] = $existId;
        } else {
            $action = 'create';
            unset($row['id']);
        }

        $row = array_merge($row, array(
            'sync_id'      => $syncId,
            'sync_service' => $syncService,
            'sync_type'    => $syncType,
            'sync_action'  => $syncAction
        ));

        if (empty($row['sync_service'])) {
            $this->log("[" . __CLASS__ . "]", "Empty sync_service ", true);
            $this->log("[" . __CLASS__ . "]", $row, true);

            $response = new modProcessorResponse($this->modx, $this->modx->error->failure('', $row));

            return $response;
        }

        $tvs = $this->isTvsRow($row);

        /** @var modResource $ro */
        if ($existId AND $ro = $this->modx->getObject($classKey, $existId)) {
            $classKey = $ro->get('class_key');
            if ($tvs) {
                $row = array_merge($ro->toArray(), $this->Sync->getResourceTvs($ro), $row);
            } else {
                $row = array_merge($ro->toArray(), $row);
            }
        }
        /* process tvs */
        $row["tvs"] = $tvs;


        /* check alias */
        if (true) {
            $alias = $this->modx->getOption('alias', $row);
            $pageTitle = $this->modx->getOption('pagetitle', $row);
            $contextKey = $this->modx->getOption('context_key', $row, 'web', true);
            $workingContext = $this->modx->getContext($contextKey);
            /* @var modResource $tmpResource */
            $tmpResource = $this->modx->newObject($classKey);
            if ($existId) {
                $tmpResource->set('id', $existId);
            }
            $autoGenerated = false;

            if (empty($alias) AND $workingContext->getOption('automatic_alias', false)) {
                $alias = $tmpResource->cleanAlias($pageTitle);
                $autoGenerated = true;
            }
            $friendlyUrlsEnabled = $workingContext->getOption('friendly_urls', false) AND !empty($pageTitle);

            // Check for duplicates
            $duplicateContext = $workingContext->getOption('global_duplicate_uri_check', false) ? '' : $contextKey;
            $aliasPath = $tmpResource->getAliasPath($alias, $row);
            $duplicateId = $tmpResource->isDuplicateAlias($aliasPath, $duplicateContext);

            // We have a duplicate!
            if ($duplicateId) {
                if ($friendlyUrlsEnabled) {
                    $rand = strtolower(strtr(base64_encode(openssl_random_pseudo_bytes(2)), "+/=", "zzz"));
                    $alias = $alias . '_' . $rand;
                } // If friendly urls is not enabled, and we automatically generated the alias, then we just unset it
                elseif ($autoGenerated) {
                    $alias = '';
                }
            }

            // If the alias is empty yet friendly urls is enabled, add an error to the alias field
            if (empty($alias) AND $friendlyUrlsEnabled) {
                $alias = strtolower(strtr(base64_encode(openssl_random_pseudo_bytes(2)), "+/=", "zzz"));
            }
            $row['alias'] = $alias;
        }

        /* check parent */
        if ($existId AND $row['parent'] == $existId) {
            unset($row['parent']);
        }


        /* before create / update */

        /* process vendor */
        if (!empty($row["vendor.name"])) {
            switch ($classKey) {
                case 'msProduct':
                    $row["vendor"] = $this->processMS2Vendor($row, $action);
                    break;
            }
        }


        //$this->modx->log(1, print_r($row, 1));
        //print_r($action);print_r($row);die;

        $this->modx->error->reset();
        $response = $this->modx->runProcessor("resource/{$action}", $row);

        if ($response->isError()) {
            $this->log("[" . __CLASS__ . "]", $action, true);
            $this->log("[" . __CLASS__ . "]", $row, true);
            $this->log("[" . __CLASS__ . "]", $response->getResponse(), true);
        } else {
            if ($object = $response->getObject()) {
                $id = $this->modx->getOption('id', $object);

                /* after create / update */

                /* load images */
                if (isset($row["sync_images"])) {
                    switch ($classKey) {
                        case 'msProduct':
                            if ($images = $this->modx->getOption('sync_images', $row)) {
                                $this->processMS2Images($id, $images);
                            }
                            break;
                    }
                }

                /* load modifications */
                if (isset($row["sync_modifications"])) {
                    switch ($classKey) {
                        case 'msProduct':
                            if ($modifications = $this->modx->getOption('sync_modifications', $row)) {
                                $this->processMsopModifications($id, $modifications);
                            }
                            break;
                    }
                }

                /* load modification stock */
                if (isset($row["sync_modification_stock"])) {
                    switch ($classKey) {
                        case 'msProduct':
                            if ($stock = $this->modx->getOption('sync_modification_stock', $row)) {
                                $this->processMsopModificationUpdate($id, $stock);
                            }
                            break;
                    }
                }

            }
        }

        return $response;
    }


    public function processMS2Vendor($row = array(), $action = 'upload')
    {
        $name = !empty($row['vendor.name']) ? trim($row['vendor.name']) : '';

        $q = $this->modx->newQuery('msVendor');
        if (!empty($name)) {
            $q->where(array(
                'name' => $name
            ));
        }

        if (!$vo = $this->modx->getObject('msVendor', $q)) {
            $vo = $this->modx->newObject('msVendor');
            $vo->set('name', $name);
            $vo->save();
        }
        $id = (int)$vo->get('id');

        return $id;
    }

    public function processMS2Images($rid, $images = array(), $action = 'upload')
    {
        if (!$this->Sync->miniShop2) {
            return false;
        }

        foreach ((array)$images as $file) {
            /* id, file */
            $row = array(
                'id'   => $rid,
                'file' => $file
            );

            $this->modx->error->reset();
            $response = $this->modx->runProcessor("gallery/{$action}",
                $row,
                array('processors_path' => MODX_CORE_PATH . 'components/minishop2/processors/mgr/')
            );

            if ($response->isError()) {
                //$this->log("[" . __CLASS__ . "]", $row, true);
            }
        }

        return true;
    }

    public function processMsopModifications($rid, $modifications = array())
    {
        if (!$this->Sync->msop) {
            return false;
        }

        $this->processMsopModificationsActive($rid, false);
        $this->modx->call('msopModification', 'saveProductModification', array(&$this->modx, $rid, $modifications));

        return true;
    }

    public function processMsopModificationUpdate($rid, $row = array())
    {
        if (!$this->Sync->msop) {
            return false;
        }

        /* id, rid, count */
        $this->modx->error->reset();
        $response = $this->modx->runProcessor("modification/update",
            $row,
            array('processors_path' => MODX_CORE_PATH . 'components/msoptionsprice/processors/mgr/')
        );

        if ($response->isError()) {
            $this->log("[" . __CLASS__ . "]", $row, true);
        }

        return true;
    }

    public function processMsopModificationsActive($rid, $value = true, $where = array())
    {
        if (empty($where)) {
            $where = array(
                "type"            => 1,
                "sync_service:!=" => null
            );
        }

        $where = array_merge(array(
            "rid" => $rid,
        ), $where);

        $q = $this->modx->newQuery('msopModification');
        $q->command('UPDATE');
        $q->where($where);
        $q->set(array(
            "active" => $value,
        ));

        $q->prepare();

        return $q->stmt->execute();
    }

    public function processSyncResourcePublished($object, $value = true)
    {
        /** @var xPDOObject|syncObject $object */
        if (is_object($object) AND $object instanceof xPDOObject) {
            $row = $object->toArray();
        } else {
            $row = (array)$object;
        }

        $syncService = $this->syncService;
        $syncId = $this->modx->getOption('sync_id', $row);

        $where = array(
            "sync_id"      => $syncId,
            "sync_service" => $syncService,
        );
        $q = $this->modx->newQuery('modResource');
        $q->command('UPDATE');
        $q->where($where);
        $q->set(array(
            "published" => $value,
        ));

        $q->prepare();

        return $q->stmt->execute();
    }

    public function processSyncResourceDeleted($object, $value = true)
    {
        /** @var xPDOObject|syncObject $object */
        if (is_object($object) AND $object instanceof xPDOObject) {
            $row = $object->toArray();
        } else {
            $row = (array)$object;
        }

        $syncService = $this->syncService;
        $syncId = $this->modx->getOption('sync_id', $row);

        $where = array(
            "sync_id"      => $syncId,
            "sync_service" => $syncService,
        );
        $q = $this->modx->newQuery('modResource');
        $q->command('UPDATE');
        $q->where($where);
        $q->set(array(
            "deleted" => $value,
        ));

        $q->prepare();

        return $q->stmt->execute();
    }


    public function processMS2Options($rid = 0, array $values = array(), $merge = false)
    {
        $options = array();
        /** @var $product msProduct */
        if (!$product = $this->modx->getObject('msProduct', array('id' => (int)$rid))) {
            return $options;
        }
        $options = $product->loadData()->get('options');

        foreach ($values as $k => $v) {
            if (!is_array($v)) {
                $v = array($v);
            }
            if ($merge AND isset($options[$k])) {
                $options[$k] = array_merge($options[$k], $v);
            } else {
                $options[$k] = $v;
            }
        }

        foreach ($options as $k => $v) {
            $options[$k] = $this->prepareMS2OptionValues($options[$k]);
            $product->set($k, $options[$k]);
        }
        $product->set('options', $options);
        $product->save();

        return $options;
    }


    public function prepareMS2OptionValues($values = null)
    {
        if ($values) {
            if (!is_array($values)) {
                $values = array($values);
            }
            // fix duplicate, empty option values
            $values = array_map('trim', $values);
            $values = array_keys(array_flip($values));
            $values = array_diff($values, array(''));

            if ($this->getOption('sort_modification_option_values', null, true, false)) {
                sort($values);
            }

            if (empty($values)) {
                $values = null;
            }
        }

        return $values;
    }

    public function prepareValue($v = null, $type = 'string')
    {
        switch ($type) {
            case 'timestamp' :
            case 'datetime' :
                if (is_string($v) AND !empty($v)) {
                    $v = strtotime($v);
                }
                if ($v !== false) {
                    $v = strftime('%Y-%m-%d %H:%M:%S', $v);
                }
                break;
            case 'date' :
                break;
            case 'text' :
            case 'string' :
                switch (true) {
                    case is_array($v):
                        $v = $this->Sync->cleanAndImplode($v);
                        break;
                }
                $v = (string)$v;
                break;
            case 'boolean' :
                $v = (bool)$v;
                break;
            case 'integer' :
                $v = (int)$v;
                break;
            case 'float' :
                $v = (float)$v;
                break;
            case 'array' :
                if (!is_array($v)) {
                    $v = array($v);
                }
                break;
            default :
                break;
        }

        return $v;
    }


}