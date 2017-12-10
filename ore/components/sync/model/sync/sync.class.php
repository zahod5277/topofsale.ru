<?php

//ini_set('display_errors', 1);
//ini_set('error_reporting', -1);

/**
 * The base class for sync.
 */
class Sync
{
    public $version = '1.0.0-beta';

    /** @var modX $modx */
    public $modx;

    /** @var mixed|null $namespace */
    public $namespace = 'sync';
    /** @var array $config */
    public $config = array();
    /** @var array $initialized */
    public $initialized = array();

    /** @var mixed|null $syncService */
    protected $syncService;

    /** @var SyncTools $SyncTools */
    public $SyncTools;

    /** @var miniShop2 $miniShop2 */
    public $miniShop2;

    /** @var msoptionsprice $msop */
    public $msop;


    protected $retry;
    protected $step;
    protected $timeout = 60;

    /**
     * @param modX  $modx
     * @param array $config
     */
    function __construct(modX &$modx, array $config = array())
    {
        $this->modx =& $modx;

        $corePath = $this->getOption('core_path', $config,
            $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/sync/');
        $assetsPath = $this->getOption('assets_path', $config,
            $this->modx->getOption('assets_path', null, MODX_ASSETS_PATH) . 'components/sync/');
        $assetsUrl = $this->getOption('assets_url', $config,
            $this->modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/sync/');
        $connectorUrl = $assetsUrl . 'connector.php';

        $this->config = array_merge(array(
            'namespace'       => $this->namespace,
            'connectorUrl'    => $connectorUrl,
            'assetsBasePath'  => MODX_ASSETS_PATH,
            'assetsBaseUrl'   => MODX_ASSETS_URL,
            'assetsPath'      => $assetsPath,
            'assetsUrl'       => $assetsUrl,
            'cssUrl'          => $assetsUrl . 'css/',
            'jsUrl'           => $assetsUrl . 'js/',
            'corePath'        => $corePath,
            'modelPath'       => $corePath . 'model/',
            'processorsPath'  => $corePath . 'processors/',
            'templatesPath'   => $corePath . 'elements/templates/mgr/',
            'jsonResponse'    => true,
            'prepareResponse' => true,
            'showLog'         => false,
        ), $config);


        $this->modx->addPackage('sync', $this->config['modelPath']);
        $this->modx->lexicon->load('sync:default');
        $this->namespace = $this->getOption('namespace', $config, 'sync');

        $this->retry = 0;

        $level = $modx->getLogLevel();
        $modx->setLogLevel(xPDO::LOG_LEVEL_FATAL);

        $this->miniShop2 = $modx->getService('miniShop2');
        $this->msop = $modx->getService('msoptionsprice');

        $modx->setLogLevel($level);

    }

    /**
     * @param       $n
     * @param array $p
     */
    public function __call($n, array$p)
    {
        echo __METHOD__ . ' says: ' . $n;
    }

    /**
     * @param        $array
     * @param string $delimiter
     *
     * @return array
     */
    public function explodeAndClean($array, $delimiter = ',')
    {
        $array = explode($delimiter, $array);     // Explode fields to array
        $array = array_map('trim', $array);       // Trim array's values
        $array = array_keys(array_flip($array));  // Remove duplicate fields
        $array = array_filter($array);            // Remove empty values from array
        return $array;
    }

    /**
     * @param        $array
     * @param string $delimiter
     *
     * @return array|string
     */
    public function cleanAndImplode($array, $delimiter = ',')
    {
        $array = array_map('trim', $array);       // Trim array's values
        $array = array_keys(array_flip($array));  // Remove duplicate fields
        $array = array_filter($array);            // Remove empty values from array
        $array = implode($delimiter, $array);

        return $array;
    }

    /**
     * @param array $array
     *
     * @return array
     */
    public function cleanArray(array $array = array())
    {
        $array = array_map('trim', $array);       // Trim array's values
        $array = array_filter($array);            // Remove empty values from array
        $array = array_keys(array_flip($array));  // Remove duplicate fields

        return $array;
    }

    /**
     * @param array $array1
     * @param array $array2
     *
     * @return array
     */
    public function array_merge_recursive_ex(array & $array1 = array(), array & $array2 = array())
    {
        $merged = $array1;

        foreach ($array2 as $key => & $value) {
            if (is_array($value) AND isset($merged[$key]) AND is_array($merged[$key])) {
                $merged[$key] = $this->array_merge_recursive_ex($merged[$key], $value);
            } else {
                if (is_numeric($key)) {
                    if (!in_array($value, $merged)) {
                        $merged[] = $value;
                    }
                } else {
                    $merged[$key] = $value;
                }
            }
        }

        return $merged;
    }

    /**
     * @param array  $array
     * @param string $prefix
     *
     * @return array
     */
    public function flattenArray(array $array = array(), $prefix = '')
    {
        $outArray = array();
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $outArray = $outArray + $this->flattenArray($value, $prefix . $key . '.');
            } else {
                $outArray[$prefix . $key] = $value;
            }
        }

        return $outArray;
    }

    public function getArrayValue($array = array(), $search = array(), $key = 'value')
    {
        if (empty($array) OR empty($search)) {
            return null;
        }

        foreach ($array as $row) {
            if (is_array($row) AND array_intersect_assoc($row, $search)) {
                return isset($row[$key]) ? $row[$key] : null;
            }
        }

        return null;
    }

    /**
     * @param       $key
     * @param array $config
     * @param null  $default
     *
     * @return mixed|null
     */
    public function getOption($key, $config = array(), $default = null, $skipEmpty = false)
    {
        $option = $default;
        if (!empty($key) AND is_string($key)) {
            if ($config != null AND array_key_exists($key, $config)) {
                $option = $config[$key];
            } elseif (array_key_exists($key, $this->config)) {
                $option = $this->config[$key];
            } elseif (array_key_exists("{$this->namespace}_{$key}", $this->modx->config)) {
                $option = $this->modx->getOption("{$this->namespace}_{$key}");
            }
        }
        if ($skipEmpty AND empty($option)) {
            $option = $default;
        }

        return $option;
    }

    public function setOption($key, $value)
    {
        $this->config[$key] = $value;
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

    // setOption($key, $value)
    public function initialize($ctx = 'web', array $scriptProperties = array())
    {
        if (isset($this->initialized[$ctx])) {
            return $this->initialized[$ctx];
        }

        $this->modx->error->reset();
        $this->config = array_merge($this->config, $scriptProperties, array('ctx' => $ctx));

        if ($ctx != 'mgr' AND (!defined('MODX_API_MODE') OR !MODX_API_MODE)) {

        }

        $load = true;
        $this->initialized[$ctx] = $load;

        $this->modx->invokeEvent(
            'syncOnInit',
            array(
                'sync'   => $this,
                'load'   => $load,
                'config' => $this->config,
            )
        );

        return $load;
    }

    public function translatePath($path)
    {
        return str_replace(array(
            '{core_path}',
            '{base_path}',
            '{assets_path}',
        ), array(
            $this->modx->getOption('core_path', null, MODX_CORE_PATH),
            $this->modx->getOption('base_path', null, MODX_BASE_PATH),
            $this->modx->getOption('assets_path', null, MODX_ASSETS_PATH),
        ), $path);
    }

    public function getServiceCorePath($service = '', $corePath = '')
    {
        $service = strtolower($service);
        if ($service != 'sync') {
            $service = "sync{$service}";
        }

        if (empty($corePath)) {
            $corePath = $this->getOption('corePath', $this->config, MODX_CORE_PATH, true);
        }

        /** @var modNamespace $namespace */
        if (!$namespace = $this->modx->getObject('modNamespace', array('name' => $service))) {
            $this->log("[" . __CLASS__ . "]", "Not found modNamespace: {$service}", true);
        } else {
            $corePath = $this->translatePath($namespace->get('path'));
        }

        return $corePath;
    }

    /**
     * return lexicon message if possibly
     *
     * @param string $message
     *
     * @return string $message
     */
    public function lexicon($message, $placeholders = array())
    {
        $key = '';
        if ($this->modx->lexicon->exists($message)) {
            $key = $message;
        } elseif ($this->modx->lexicon->exists($this->namespace . '_' . $message)) {
            $key = $this->namespace . '_' . $message;
        }
        if ($key !== '') {
            $message = $this->modx->lexicon->process($key, $placeholders);
        }

        return $message;
    }

    /**
     * @param string $message
     * @param array  $data
     * @param array  $placeholders
     *
     * @return array|string
     */
    public function failure($message = '', $data = array(), $placeholders = array())
    {
        $response = array(
            'success' => false,
            'message' => $this->lexicon($message, $placeholders),
            'data'    => $data,
        );

        return $this->config['jsonResponse'] ? $this->modx->toJSON($response) : $response;
    }

    /**
     * @param string $message
     * @param array  $data
     * @param array  $placeholders
     *
     * @return array|string
     */
    public function success($message = '', $data = array(), $placeholders = array())
    {
        $response = array(
            'success' => true,
            'message' => $this->lexicon($message, $placeholders),
            'data'    => $data,
        );

        return $this->config['jsonResponse'] ? $this->modx->toJSON($response) : $response;
    }

    /**
     * @param string $message
     * @param array  $data
     * @param bool   $showLog
     * @param bool   $writeLog
     */
    public function log($message = '', $data = array(), $showLog = false)
    {
        if ($this->getOption('showLog', null, $showLog, true)) {
            if (!empty($message)) {
                $this->modx->log(modX::LOG_LEVEL_ERROR, print_r($message, 1));
            }
            if (!empty($data)) {
                $this->modx->log(modX::LOG_LEVEL_ERROR, print_r($data, 1));
            }
        }
    }

    /**
     * @param string $action
     * @param array  $data
     *
     * @return array|modProcessorResponse|string
     */
    public function runProcessor($action = '', $data = array(), $processorsPath = '', $jsonResponse = null)
    {
        $this->modx->error->reset();
        if (empty($processorsPath)) {
            $processorsPath = $this->getServiceCorePath($this->syncService) . 'processors/mgr/';

            //$processorsPath = !empty($this->config['processorsPath']) ? $this->config['processorsPath'] : MODX_CORE_PATH;
        }
        /* @var modProcessorResponse $response */
        $response = $this->modx->runProcessor($action, $data, array('processors_path' => $processorsPath));

        return $this->config['prepareResponse'] ? $this->prepareResponse($response, $jsonResponse) : $response;
    }

    /**
     * This method returns prepared response
     *
     * @param mixed $response
     *
     * @return array|string $response
     */
    public function prepareResponse($response, $jsonResponse = null)
    {
        if ($response instanceof modProcessorResponse) {
            $output = $response->getResponse();
        } else {
            $message = $response;
            if (empty($message)) {
                $message = $this->lexicon('err_unknown');
            }
            $output = $this->failure($message);
        }

        if (is_null($jsonResponse)) {
            $jsonResponse = $this->config['jsonResponse'];
        }
        if ($jsonResponse AND is_array($output)) {
            $output = json_encode($output, true);
        } elseif (!$jsonResponse AND !is_array($output)) {
            $output = json_decode($output, true);
        }

        return $output;
    }


    public function addTools($service, $controller)
    {
        $tools = (array)$this->_getSetting('sync_tools');
        $service = strtolower($service);
        $tools[$service] = $controller;

        $this->_updateSetting('sync_tools', $tools);
    }

    public function removeTools($service)
    {
        $tools = (array)$this->_getSetting('sync_tools');
        $service = strtolower($service);
        unset($tools[$service]);
        $this->_updateSetting('sync_tools', $tools);
    }

    public function getTools($service = '')
    {
        $tools = (array)$this->_getSetting('sync_tools');

        return isset($tools[$service]) ? $tools[$service] : $tools;
    }

    public function loadTools($service = '')
    {
        $tools = (array)$this->getTools();
        $service = strtolower($service);

        $class = 'SyncTools';
        $file = (string)$this->modx->getOption($service, $tools);
        if (!empty($file)) {
            $file = $this->translatePath($file);
            if (strpos($file, MODX_BASE_PATH) === false) {
                $file = MODX_BASE_PATH . ltrim($file, '/');
            }
            if (file_exists($file)) {
                $class = $this->getClassNameFromFile($file);
                /** @noinspection PhpIncludeInspection */
                include_once($file);
            } else {
                $this->modx->log(modX::LOG_LEVEL_ERROR, "[Sync] Could not load custom tools at \"$file\"");
            }
        }

        return $class;
    }


    public function loadSyncTools($service = '')
    {
        if (!class_exists('SyncTools')) {
            require_once dirname(dirname(dirname(__FILE__))) . '/tools/synctools.class.php';
        }

        $class = $this->loadTools($service);
        if (!class_exists($class)) {
            $class = 'SyncTools';
        }

        $this->SyncTools = new $class($this->modx, $this->config);
        if (!empty($this->SyncTools) AND $this->SyncTools instanceof $class) {
            $this->setSyncService($service);
            $this->SyncTools->setSyncService($service);

            return true;
        }

        return false;
    }


    public function isWorkingClassKey(modResource $resource)
    {
        return in_array($resource->get('class_key'),
            $this->explodeAndClean($this->getOption('working_class_key', null, 'msProduct', true)));
    }

    public function isWorkingTemplates(modResource $resource)
    {
        return in_array($resource->get('template'),
            $this->explodeAndClean($this->getOption('working_templates', null)));
    }

    public function isNotWorkingTemplates(modResource $resource)
    {
        return in_array($resource->get('template'),
            $this->explodeAndClean($this->getOption('not_working_templates', null)));
    }

    public function isSyncObject(xPDOObject $object, $service = '')
    {
        return (
            $syncService = $object->get('sync_service')
            AND
            $syncService == $service
        );
    }

    public function isPrefixRow(array $row = array(), $prefix = 'tv')
    {
        foreach ($row as $k => $v) {
            if (preg_match('/^' . $prefix . '(\d)$/', $k)) {
                return true;
            }
        }

        return false;
    }

    public function clearSyncResourceData(modResource $resource)
    {
        /* clear sync data */
        $resource->fromArray(array(
            'sync_id'      => '',
            'sync_service' => '',
            'sync_data'    => null
        ));
        $resource->save();

        $children = $resource->getMany('Children');
        if (is_array($children) AND count($children) > 0) {
            /** @var modResource $child */
            foreach ($children as $child) {
                $this->clearSyncResourceData($child);
            }
        }

        return true;
    }

    public function getSyncServiceActions($class = 'msProduct')
    {
        $actions = array();
        $q = $this->modx->newQuery('modSystemSetting');
        $q->where(array(
            'key:LIKE'      => "%_actions%",
            'AND:area:LIKE' => "%sync_%",
        ));
        $q->where(array(
            'area:!=' => "sync_main",
        ));

        $q->select('key,area');
        if ($q->prepare() AND $q->stmt->execute()) {
            while ($row = $q->stmt->fetch(PDO::FETCH_ASSOC)) {
                $key = str_replace('sync_', '', $row['area']);
                $value = json_decode($this->modx->getOption($row['key'], null), true);
                $action = $this->modx->getOption(strtolower($class), $value, array(), true);
                $actions[$key] = $action;
            }
        }

        return $actions;
    }

    public function getSyncSystemActions($type = 'resource')
    {
        $actions = $this->getOption('actions', null, '{"resource":["remove_locks","remove_bind"]}', true);
        $actions = json_decode($actions, true);
        $actions = $this->modx->getOption($type, $actions, array(), true);

        return $actions;
    }

    public function getMethodName($name = '', $prf = '_')
    {
        $name = $prf . ucfirst(str_replace(array('_', '.'), array('', ''), $name));

        return $name;
    }

    public function getVersionMiniShop2()
    {
        return isset($this->miniShop2->version) ? $this->miniShop2->version : '2.2.0';
    }

    /**
     * @param modManagerController $controller
     * @param array                $setting
     */
    public function loadControllerJsCss(modManagerController &$controller, array $setting = array())
    {
        $controller->addLexiconTopic('sync:default');

        $config = $this->config;

        $class = null;
        if (is_object($controller->resource) AND $controller->resource instanceof xPDOObject) {
            $config['resource'] = $controller->resource->toArray();
            $class = $controller->resource->class_key;
        }

        $type = $this->modx->getOption('type', $setting, 'resource', true);

        $config['connector_url'] = $this->config['connectorUrl'];
        $config['sync_system_actions'] = $this->getSyncSystemActions($type);
        $config['sync_service_actions'] = $this->getSyncServiceActions($class);
        $config['miniShop2']['version'] = $this->getVersionMiniShop2();

        if (!empty($setting['css'])) {
            $controller->addCss($this->config['cssUrl'] . 'mgr/main.css');
            $controller->addCss($this->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        }

        if (!empty($setting['config'])) {
            $controller->addHtml("<script type='text/javascript'>sync.config={$this->modx->toJSON($config)}</script>");
        }

        if (!empty($setting['tools'])) {
            $controller->addJavascript($this->config['jsUrl'] . 'mgr/sync.js');
            $controller->addJavascript($this->config['jsUrl'] . 'mgr/misc/tools.js');
            $controller->addJavascript($this->config['jsUrl'] . 'mgr/misc/combo.js');
        }

        if (!empty($setting['sync'])) {
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/sync/sync.actions.js');
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/sync/sync.window.js');
        }

        if (!empty($setting['resource/inject'])) {
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/resource/inject/inject.tab.js');
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/resource/inject/inject.panel.js');
        }

    }

    public function & getSyncProperties()
    {
        if (empty($_SESSION[$this->namespace][$this->syncService])) {
            $_SESSION[$this->namespace][$this->syncService] = array();
        }

        return $_SESSION[$this->namespace][$this->syncService];
    }

    public function getSyncPropertiesValue($key)
    {
        $properties = $this->getSyncProperties();

        return isset($properties[$key]) ? $properties[$key] : null;
    }

    public function setSyncPropertiesValue($key, $value)
    {
        $properties = &$this->getSyncProperties();
        $properties[$key] = $value;

        return $properties[$key];
    }

    public function flushSyncProperties()
    {
        $properties = &$this->getSyncProperties();
        $properties = array();

        return $properties;
    }

    public function getResourceTvs(modResource $resource)
    {
        $data = array();
        $tvs = $resource->getTemplateVars();

        /** @var modTemplateVar $tv */
        foreach ($tvs as $tv) {
            $tvKey = 'tv' . $tv->get('id');
            $value = $tv->get('value');
            $data[$tvKey] = $value;
        }

        return $data;
    }


    public function createSyncObject(
        $service = '',
        $type = '',
        $action = '',
        $id,
        array $data = array(),
        $class = 'syncObject'
    ) {
        $object = null;
        if ($id AND $object = $this->modx->newObject($class, $data)) {
            // $data = $this->modx->getOption('sync_data', $data, $data, true);

            $object->set("sync_data", $data);
            $object->set("sync_service", $service);
            $object->set("sync_type", $type);
            $object->set("sync_action", $action);
            $object->set("sync_id", $id);
        }

        return $object;
    }

    public function clearSyncTable($service = '', $action = '', $class = 'syncObject')
    {

        $q = $this->modx->newQuery($class);
        $q->command('DELETE');
        if (!empty($service)) {
            $q->where(array(
                "sync_service" => $service
            ));
        }
        if (!empty($action)) {
            $q->where(array(
                "sync_action" => $action
            ));
        }

        $q->prepare();

        return $q->stmt->execute();
    }

    public function getResourceParents(
        $id = null,
        $height = 10,
        array $parents = array(),
        $where = array('isfolder' => 1)
    ) {
        if ($id AND $height > 0) {
            $parent = 0;

            $q = $this->modx->newQuery('modResource');
            $q->where(array(
                "modResource.id" => $id
            ));
            
            $tmp = $this->explodeAndClean($this->getOption('not_working_templates', null));
            if (!empty($tmp)) {
                $q->andCondition(array(
                    "modResource.template:NOT IN" => $tmp
                ));
            }

            $q->select("modResource.parent");
            if (!empty($where)) {
                $q->andCondition($where);
            }
            if ($q->prepare() AND $q->stmt->execute()) {
                if (!$parent = $this->modx->getValue($q->stmt)) {
                    $parent = 0;
                }
            }

            $parents[] = $parent;
            if (!empty($parent)) {

                //$this->modx->log(1, print_r('---' ,1));
                //$this->modx->log(1, print_r($parent ,1));die; 

                $parents = $this->getResourceParents($parent, --$height, $parents, $where);
            }
        }

        return $parents;
    }

    public function getResourceChilds(
        $id = null,
        $height = 10,
        array $childs = array(),
        $where = array('isfolder' => 1)
    ) {
        if ($id AND $height > 0) {
            if (!is_array($id)) {
                $id = array($id);
            }

            $child = 0;
            $q = $this->modx->newQuery('modResource');
            $q->where(array(
                "modResource.parent:IN" => $id
            ));

            $tmp = $this->explodeAndClean($this->getOption('not_working_templates', null));
            if (!empty($tmp)) {
                $q->andCondition(array(
                    "modResource.template:NOT IN" => $tmp
                ));
            }

            $q->select("modResource.id");
            if (!empty($where)) {
                $q->andCondition($where);
            }
            if ($q->prepare() AND $q->stmt->execute()) {
                if (!$child = $q->stmt->fetchAll(PDO::FETCH_COLUMN, 0)) {
                    $child = array();
                }
            }

            $childs = array_merge($childs, $child);
            if (!empty($child)) {
                $childs = $this->getResourceChilds($child, --$height, $childs, $where);
            }
        }

        return $childs;
    }


    public function curlExec(array $params = array(), $url = '')
    {
        time_nanosleep(0, 250000000);

        if (empty($url)) {
            $siteUrl = trim($this->modx->getOption('site_url', null, MODX_SITE_URL), '/');
            $url = $siteUrl . $this->getOption('assetsUrl') . 'action.php';
        }

        $params = array_merge(array(
            'action'                 => null,
            'sync_step'              => null,
            'service'                => $this->syncService,
            'username'               => $this->getOption('user_username'),
            'password'               => $this->getOption('user_password'),
            'response_output_format' => 'json'
        ), $params);

        if ($this->step == $this->getOption('sync_step', $params)) {
            $this->retry += 1;
        } else {
            $this->retry = 0;
        }

        $query = parse_url($url, PHP_URL_QUERY);
        $url = strtok($url, '?');
        parse_str($query, $query);
        $params = array_merge($params, (array)$query);
        $url = $url . '?' . http_build_query($params);

        //$this->modx->log(1, print_r($url));
        //$this->modx->log(1, print_r($params, 1));

        $cookieFile = dirname(__FILE__).'/cookies.txt';
        $useragent = $this->getOption('curl_user_agent', null,
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/32.0.1700.107 Chrome/32.0.1700.107 Safari/537.36',
            true);

        $ch = curl_init();
        curl_setopt_array(
            $ch,
            array(
                CURLOPT_URL            => $url,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER         => false,
                CURLOPT_COOKIEJAR      => $cookieFile,
                CURLOPT_COOKIEFILE     => $cookieFile,
                CURLOPT_USERAGENT      => $useragent,
                CURLOPT_TIMEOUT        => $this->timeout
            )
        );

        ob_start();      // prevent any output
        $response = curl_exec($ch);
        ob_end_clean();  // stop preventing output
        curl_close($ch);

        $response = json_decode($response, true);
        if (
            !empty($response['continue'])
            AND
            !empty($response['data'])
            AND
            $redirect = $this->getOption('redirect', (array)$response['data'])
        ) {
            if ($this->retry >= $this->getOption('step_retry', null, 10, true)) {
                $this->log("[" . __CLASS__ . "]", "Max curl retry: {$this->retry}", true);

                return false;
            }

            return $this->curlExec($params, $redirect);
        }

        return $response;
    }

    protected function _getSetting($key, array $row = array())
    {
        if (strlen($key) > 50) {
            $this->modx->log(modX::LOG_LEVEL_ERROR, "<b>{$key}</b> length > 50");

            return false;
        }

        /** @var modSystemSetting $tmp */
        if (!$tmp = $this->modx->getObject('modSystemSetting', array('key' => $key))) {
            $tmp = $this->modx->newObject('modSystemSetting');

            $tmp->fromArray(array_merge(array(
                'xtype'     => 'textarea',
                'namespace' => 'sync',
                'area'      => 'sync_main'
            ), $row), '', true, true);

            $tmp->set('key', $key);
            $tmp->set('value', '');
            $tmp->save();
        }

        return json_decode($tmp->get('value'), true);
    }

    protected function _updateSetting($key, $value, array $row = array())
    {
        if (strlen($key) > 50) {
            $this->modx->log(modX::LOG_LEVEL_ERROR, "<b>{$key}</b> length > 50");

            return false;
        }

        if (!$tmp = $this->modx->getObject('modSystemSetting', array('key' => $key))) {
            $tmp = $this->modx->newObject('modSystemSetting');

            $tmp->fromArray(array_merge(array(
                'xtype'     => 'textarea',
                'namespace' => 'sync',
                'area'      => 'sync_main'
            ), $row), '', true, true);

            $tmp->set('key', $key);
        }
        $tmp->set('value', json_encode($value));
        $tmp->save();

        return $tmp->get('value');
    }

    protected function getClassNameFromFile($filePathName)
    {
        $php_code = file_get_contents($filePathName);

        $classes = array();
        $tokens = token_get_all($php_code);
        $count = count($tokens);
        for ($i = 2; $i < $count; $i++) {
            if ($tokens[$i - 2][0] == T_CLASS
                && $tokens[$i - 1][0] == T_WHITESPACE
                && $tokens[$i][0] == T_STRING
            ) {

                $class_name = $tokens[$i][1];
                $classes[] = $class_name;
            }
        }

        return $classes[0];
    }

    public function UserAuth(array $row = array())
    {
        /*
         * 'username', 'password'
         */
        $response = $this->modx->runProcessor('security/login', $row);
        if ($response->isError()) {
            $this->log("[" . __CLASS__ . "]", $response->getMessage(), true);

            return false;
        }

        return true;
    }

}