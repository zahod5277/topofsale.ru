<?php

//ini_set('display_errors', 1);
//ini_set('error_reporting', -1);

class modSyncSyncProcessor extends modObjectProcessor
{

    /** @var Sync $Sync */
    public $Sync;
    /** @var SyncTools $SyncTools */
    public $SyncTools;

    /** @var mixed|null $syncService */
    protected $syncService = '';

    protected $steps = array(
        "sync_init",

        "sync_read_config",
        "sync_read_currency",
        "sync_read_metadata",
        "sync_read_product_metadata",
        "sync_read_category",
        "sync_read_product",

        "sync_read_modification_metadata",
        "sync_read_modification",

        "sync_read_store",
        
        "sync_read_stock",
        "sync_read_product_stock",
        "sync_read_modification_stock",

        "sync_read_service_metadata",
        "sync_read_service",

        "sync_import",
        "sync_import_currency",

        "sync_import_category",
        "sync_import_upd_category",
        "sync_import_cre_category",

        "sync_import_product",
        "sync_import_upd_product",
        "sync_import_cre_product",

        "sync_import_modification",
        "sync_import_upd_modification",

        "sync_import_stock",
        "sync_import_upd_product_stock",
        "sync_import_upd_modification_stock",

        "sync_import_upd_service",
        "sync_import_cre_service",

        "sync_export",
        "sync_export_currency",

        "sync_export_unl_category",
        "sync_export_upd_category",
        "sync_export_unl_new_category",
        "sync_export_cre_category",

        "sync_export_product",
        "sync_export_unl_product",
        "sync_export_upd_product",
        "sync_export_unl_new_product",
        "sync_export_cre_product",


        "sync_export_modification",
        "sync_export_unl_modification",
        "sync_export_upd_modification",
        "sync_export_unl_new_modification",
        "sync_export_cre_modification",

        "sync_export_stock",

        "sync_export_service",
        "sync_export_unl_service",
        "sync_export_upd_service",
        "sync_export_unl_new_service",
        "sync_export_cre_service",

        "sync_close",
    );

    protected $expense;

    protected $memoryAvailable;
    protected $memoryStart;
    protected $memoryPeekPoint;

    protected $timeAvailable;
    protected $timeStart;
    protected $timePeekPoint;

    public $idx = 0;
    public $err = 0;

    function __construct(modX & $modx, array $properties = array())
    {
        parent::__construct($modx, $properties);

        if (!$this->Sync = &$this->modx->sync) {
            $this->Sync = $this->modx->getService('sync');
        }

        if (empty($this->Sync)) {
            return false;
        }

        $this->memoryAvailable = (int)@ini_get("memory_limit") * 1024 * 1024;
        $this->memoryStart = memory_get_peak_usage(false);
        $this->timeAvailable = (int)@ini_get('max_execution_time');
        $this->timeStart = microtime(true);

        $this->memoryPeekPoint = $this->Sync->getOption('memory_peek_point', null, 70, true);
        $this->timePeekPoint = $this->Sync->getOption('time_peek_point', null, 60, true);

        $this->expense = array(
            "highest_memory"   => 0,
            "memory_diff"      => 0,
            "highest_time"     => 0,
            "percentage_break" => 0,
            "average"          => array(),
        );

        return true;
    }

    public function checkPermissions()
    {
        if ($this->modx->user->isAuthenticated($this->modx->context->key)) {
            return true;
        }

        if (!$this->Sync->UserAuth($this->getProperties())) {
            return false;
        }

        return true;
    }

    public function setSyncService($service = '')
    {
        $this->syncService = $service;

        return $this->Sync->loadSyncTools($this->syncService);
    }


    public function initialize()
    {
        $initialize = $this->Sync->initialize($this->modx->context->key);
        if (!$this->setSyncService($this->syncService)) {
            return false;
        }
        $this->SyncTools = &$this->Sync->SyncTools;

        $this->setDefaultProperties(array_merge(array(
            'sync_step'                       => null,
            'sync_filters'                    => array(),
            'response_output_format'          => 'json',
            'response_send_continue_redirect' => null,
            'sync_lock'                       => $this->getOption('sync_lock', null, false, true)

        ), $this->getSyncProperties()));

        //$this->modx->log(1, print_r($this->getProperties(), 1));
        //$this->modx->log(1, print_r($this->getSyncProperties(), 1));

        if ($this->getProperty('sync_lock')) {
            $locked = $this->SyncTools->getSyncLock();
            if ($locked AND $locked != session_id()) {
                $initialize = 'sync_err_lock';
            } else {
                $this->SyncTools->addSyncLock();
            }
        }

        return $initialize;
    }

    public function process()
    {
        return $this->processSync();
    }

    public function success(
        $message = '',
        $data = array(),
        $continue = false,
        $step = null,
        $level = xPDO::LOG_LEVEL_INFO
    ) {
        return $this->processResponse(true, $message, $data, $continue, $step, $level);
    }

    public function failure(
        $message = '',
        $data = array(),
        $continue = false,
        $step = null,
        $level = xPDO::LOG_LEVEL_ERROR
    ) {

        return $this->processResponse(false, $message, $data, $continue, $step, $level);
    }

    public function progress($message = '', $data = array(), $step = null, $level = xPDO::LOG_LEVEL_INFO)
    {
        return $this->success($message, $data, true, $step, $level);
    }

    public function nextStep($step = '', $message = '', $data = array(), $level = xPDO::LOG_LEVEL_INFO)
    {
        if (empty($step)) {
            $step = $this->getNextStep();
            $message = $this->lexicon("sync_step_{$this->getStep()}", $data);
        } else {
            $message = $this->lexicon("sync_step_{$step}", $data);
        }

        /* set sync_step */
        $this->setSyncPropertiesValue("sync_step", $step);
        /* clear sync_meta */
        $this->setSyncPropertiesValue("sync_meta", array());
        /* clear sync_filters */
        $this->setSyncPropertiesValue("sync_filters", array());
        /* clear sync_count */
        $this->setSyncPropertiesValue("sync_count", 0);

        return $this->progress($message, $data, $step, $level);
    }

    public function currentStep($data = array(), $level = xPDO::LOG_LEVEL_INFO)
    {
        $step = $this->getStep();
        $message = "sync_step_{$step}";

        return $this->progress($message, $data, $step, $level);
    }

    public function getSyncRows($data = array(), $key = 'rows')
    {
        return (array)$this->SyncTools->getRows($data, $key);
    }

    public function getSyncResourceId($rid = 0, $height = 10)
    {
        if (empty($rid)) {
            $rid = (int)$this->getProperty('sync_resource');
        }

        if ($height > 0) {
            /** @var modResource $resource */
            if ($rid AND $resource = $this->modx->getObject('modResource', $rid)) {
                foreach (array('sync_id', 'sync_service', 'sync_data') as $k) {
                    $v = $resource->get($k);
                    if (empty($v)) {
                        $rid = $this->getSyncResourceId($resource->get('parent'), --$height);
                        break;
                    }
                }
            }
        }

        if (empty($rid)) {
            $rid = $this->getOption('sync_parent', null, 0, true);
        }

        return $rid;
    }

    public function getSyncResourceParents($rid = 0, $includeCurr = true)
    {
        if (empty($rid)) {
            $rid = $this->getSyncResourceId();
        }

        $parents = array();
        if ($includeCurr AND !empty($rid)) {
            $parents = array($rid);
        }

        $parents = array_merge($parents, $this->Sync->getResourceParents($rid));

        return $parents;
    }

    public function getSyncResourceChilds($rid = 0, $includeCurr = true)
    {
        if (empty($rid)) {
            $rid = $this->getSyncResourceId();
        }

        $parents = array();
        if ($includeCurr AND !empty($rid)) {
            $parents = array($rid);
        }

        $parents = array_merge($parents, $this->Sync->getResourceChilds($rid));

        return $parents;
    }


    public function processResponse(
        $success = false,
        $message = '',
        $data = array(),
        $continue = false,
        $step = null,
        $level = xPDO::LOG_LEVEL_INFO
    ) {

        if (!empty($message)) {
            $message = $this->lexicon($message, $data);
        }

        $success = (boolean)$success;
        $continue = (boolean)$continue;

        if ($continue AND $this->getProperty('response_send_continue_redirect')) {
            $uri = parse_url($_SERVER['REQUEST_URI']);
            $query = array();
            parse_str($uri['query'], $query);
            if ($step) {
                $query['sync_step'] = $step;
            }

            $siteUrl = $this->modx->getOption('site_url', null, MODX_SITE_URL);
            $stepRedirect = trim($siteUrl, '/') . $uri['path'] . "?" . http_build_query($query);
            $refreshDelay = $this->Sync->getOption('refresh_delay', null, 3);

            $data['redirect'] = $stepRedirect;
            header("Refresh: {$refreshDelay}; url={$stepRedirect}");
        }

        $response = array(
            "success"  => $success,
            "message"  => $message,
            "data"     => $data,
            "continue" => $continue,
            "step"     => $step,
            "level"    => $level,
            "expense"  => $this->getExpense(),
        );

        $this->prepareResponse($response);

        return $this->formatResponse($response);
    }

    public function prepareResponse(array & $response)
    {
        return $response;
    }

    public function formatResponse($response)
    {
        switch ($this->getProperty("response_output_format", "json")) {
            case "json":
                $response = json_encode($response);
                break;
            case "array":
                $response = var_export($response, true);
                break;
            default:
                break;
        }

        return $response;
    }

    protected function getSteps()
    {
        return $this->steps;
    }

    protected function getStep()
    {
        return $this->getProperty("sync_step");
    }

    protected function getNextStep($step = '')
    {
        if (empty($step)) {
            $step = $this->getStep();
        }

        $steps = $this->getSteps();
        $index = array_search(strtolower($step), array_map('strtolower', $steps));
        if ($index !== false AND $step) {
            $index++;
        }
        $index = (int)$index;
        $step = isset($steps[$index]) ? $steps[$index] : null;

        return $step;
    }

    protected function getStepMethod($name = '')
    {
        return $this->Sync->getMethodName(trim($name), 'step');
    }


    public function processSync()
    {
        if (!$step = $this->getStep()) {
            return $this->failure("err_step_ns");
        }

        $stepMethod = $this->getStepMethod($step);
        if (method_exists($this, $stepMethod)) {
            return $this->$stepMethod();
        }

        return $this->failure("err_step_un", $this->properties);
    }

    /********************* INIT *********************/
    public function stepSyncInit($data = array())
    {
        $this->flushSyncProperties();
        $this->clearSyncTable();

        return $this->nextStep('', '', $data);
    }

    /********************* READ *********************/
    public function stepSyncReadConfig($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadCurrency($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadMetadata($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadProductMetadata($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadCategory($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadProduct($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadModificationMetadata($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadStore($data = array())
    {
        return $this->nextStep('', '', $data);
    }
    
    public function stepSyncReadStock($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadModificationStock($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncReadProductStock($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    /* "sync_read_service_metadata" */
    public function stepSyncReadServiceMetadata($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    /* "sync_read_service" */
    public function stepSyncReadService($data = array())
    {
        return $this->nextStep('', '', $data);
    }


    /********************* IMPORT *********************/
    public function stepSyncImport($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportCurrency($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportCategory($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportUpdCategory($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportCreCategory($data = array())
    {
        return $this->nextStep('', '', $data);
    }


    public function stepSyncImportProduct($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportUpdProduct($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportCreProduct($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportUpdModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportStock($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportUpdProductStock($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncImportUpdModificationStock($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    /* "sync_import_upd_service" */
    public function stepSyncImportUpdService($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    /* "sync_import_cre_service" */
    public function stepSyncImportCreService($data = array())
    {
        return $this->nextStep('', '', $data);
    }


    /********************* EXPORT *********************/
    public function stepSyncExport($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportCurrency($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUnlCategory($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUnlNewCategory($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    /* "sync_export_unl_service" */
    public function stepSyncExportUnlService($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    /* "sync_export_unl_new_service" */
    public function stepSyncExportUnlNewService($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUpdCategory($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportCreCategory($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUnlProduct($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUnlNewProduct($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUpdProduct($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportCreProduct($data = array())
    {

        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportProduct($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUnlModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUpdModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportUnlNewModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportCreModification($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    public function stepSyncExportStock($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    /* "sync_export_service" */
    public function stepSyncExportService($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    /* "sync_export_upd_service" */
    public function stepSyncExportUpdService($data = array())
    {
        return $this->nextStep('', '', $data);
    }

    /* "sync_export_cre_service" */
    public function stepSyncExportCreService($data = array())
    {
        return $this->nextStep('', '', $data);
    }


    /********************* CLOSE *********************/
    public function stepSyncClose($data = array())
    {
        if ($this->getOption('process_tmp', null)) {
            $this->SyncTools->clearTempDir();
        }

        return $this->success('sync_step_sync_close');
    }

    /********************* BASE FUNCTIONS *********************/

    public function getOption($key, $config = array(), $default = null, $skipEmpty = false)
    {
        return $this->Sync->getOption($this->syncService . '_' . $key, $config, $default, $skipEmpty);
    }

    public function setOption($key, $value)
    {
        $this->Sync->setOption($this->syncService . '_' . $key, $value);
    }

    public function log($message = '', $data = array(), $showLog = false)
    {
        $this->Sync->log($message, $data, $showLog);
    }

    public function lexicon($message, $pls = array())
    {
        $pls = array_merge((array)$pls, array(
            'sync_count'  => $this->getSyncCount(),
            'sync_errors' => $this->getSyncErrors(),
            'sync_time'   => strftime('%Y-%m-%d %H:%M:%S', time()),
        ));

        return $this->Sync->lexicon($message, $pls);
    }

    public function explodeAndClean($array, $delimiter = ',')
    {
        return $this->Sync->explodeAndClean($array, $delimiter);
    }

    public function cleanAndImplode($array, $delimiter = ',')
    {
        return $this->Sync->cleanAndImplode($array, $delimiter);
    }

    public function & getSyncProperties()
    {
        return $this->Sync->getSyncProperties();
    }

    public function getSyncPropertiesValue($key)
    {
        return $this->Sync->getSyncPropertiesValue($key);
    }

    public function setSyncPropertiesValue($key, $value)
    {
        return $this->Sync->setSyncPropertiesValue($key, $value);
    }

    public function flushSyncProperties()
    {
        return $this->Sync->flushSyncProperties();
    }

    public function clearSyncTable($action = '', $class = 'syncObject')
    {
        return $this->Sync->clearSyncTable($this->syncService, $action, $class);
    }

    public function getSyncCount()
    {
        return $this->getSyncPropertiesValue("sync_count");
    }

    public function nextSyncCount()
    {
        $count = $this->getSyncPropertiesValue("sync_count");
        $count += 1;
        $this->setSyncPropertiesValue("sync_count", $count);

        return $count;
    }

    public function setSyncFilters($filters = array())
    {
        $this->setSyncPropertiesValue("sync_filters", (array)$filters);

        return $filters;
    }

    public function getSyncFilters($filters = array())
    {
        $filters = array_merge((array)$filters, $this->getSyncPropertiesValue("sync_filters"));

        return $filters;
    }

    public function getSyncErrors()
    {
        if ($this->getSyncPropertiesValue("sync_step") == 'sync_close') {
            $classSync = "syncObject";
            $q = $this->modx->newQuery($classSync);
            $q->where(array(
                "{$classSync}.sync_service" => $this->syncService,
                "{$classSync}.sync_error"   => 1,
            ));
            $q->limit(20);
            $q->sortby("{$classSync}.sync_idx", "ASC");

            $count = $this->modx->getCount($classSync, $q);
            if (!empty($count)) {
                $this->log("[" . $this->syncService . "] All errors: " . $count, '', true);

                /** @var  xPDOObject|$error */
                foreach ($this->modx->getIterator($classSync, $q) as $error) {
                    $type = $error->get('sync_type');
                    $action = $error->get('sync_action');
                    $msg = $error->get('sync_error_msg');

                    $this->log($type . ':' . $action, $msg, true);
                }
            }
        } else {
            $count = $this->err;
        }

        return $count;
    }

    public function createSyncObject($type = '', $action = '', $id, array $data = array(), $class = 'syncObject')
    {
        $data['sync_idx'] = $this->getSyncCount();

        return $this->Sync->createSyncObject($this->syncService, $type, $action, $id, $data, $class);
    }

    public function processSyncObject($object, $syncType, $syncAction, $class = 'syncEventObject')
    {
        return $this->SyncTools->processSyncObject($object, $syncType, $syncAction, $class);
    }

    public function processSyncResource($object, $syncType, $syncAction, $keys = array(), $exclude = false)
    {
        return $this->SyncTools->processSyncResource($object, $syncType, $syncAction, $keys, $exclude);
    }

    public function processExpense()
    {
        // Get used memory
        $memoryUsed = memory_get_peak_usage(false);
        // Get Diffrence
        $memoryDiff = $memoryUsed - $this->memoryStart;
        // Start memory Usage again
        $this->memoryStart = memory_get_peak_usage(false);

        $this->expense['highest_memory'] = $memoryUsed > $this->expense['highest_memory'] ? $memoryUsed : $this->expense['highest_memory'];
        $this->expense['memory_diff'] = $memoryDiff > $this->expense['memory_diff'] ? $memoryDiff : $this->expense['memory_diff'];
        $this->expense['average'][] = $memoryDiff;


        $memoryPercent = (($memoryUsed + $this->expense['memory_diff']) / $this->memoryAvailable) * 100;

        if ($memoryPercent > $this->memoryPeekPoint) {
            $this->expense['memory_break'] = $memoryPercent;

            return false;
        }

        $timeUsed = microtime(true);
        $timeDiff = $timeUsed - $this->timeStart;
        $this->expense['highest_time'] = $timeDiff;
        $timePercent = $timeDiff / $this->timeAvailable * 100;

        if ($timePercent > $this->timePeekPoint) {
            $this->expense['time_break'] = $timePercent;

            return false;
        }

        return true;
    }

    public function getExpense()
    {
        $highestMemory = isset($this->expense["highest_memory"]) ? $this->expense["highest_memory"] : 0;
        $highestTime = isset($this->expense["highest_time"]) ? $this->expense["highest_time"] : 0;
        $memoryBreak = isset($this->expense["memory_break"]) ? $this->expense["memory_break"] : 0;
        $timeBreak = isset($this->expense["time_break"]) ? $this->expense["time_break"] : 0;

        $expense = array(
            "highest_memory" => sprintf("%2.2f Mb", $highestMemory / (1024 * 1024)),
            "highest_time"   => sprintf("%2.2f s", $highestTime),
            "memory_break"   => sprintf("%0.2f", $memoryBreak),
            "time_break"     => sprintf("%0.2f", $timeBreak),
            "idx"            => $this->idx,
            "err"            => $this->err
        );

        return $expense;
    }

}

return 'modSyncSyncProcessor';