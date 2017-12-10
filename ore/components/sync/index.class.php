<?php

/**
 * Class syncMainController
 */
abstract class syncMainController extends modExtraManagerController
{
    /** @var sync $sync */
    public $sync;


    /**
     * @return void
     */
    public function initialize()
    {
        $corePath = $this->modx->getOption('sync_core_path', null,
            $this->modx->getOption('core_path') . 'components/sync/');
        require_once $corePath . 'model/sync/sync.class.php';

        $this->sync = new sync($this->modx);
        $this->addCss($this->sync->config['cssUrl'] . 'mgr/main.css');
        $this->addJavascript($this->sync->config['jsUrl'] . 'mgr/sync.js');
        $this->addHtml('
		<script type="text/javascript">
			sync.config = ' . $this->modx->toJSON($this->sync->config) . ';
			sync.config.connector_url = "' . $this->sync->config['connectorUrl'] . '";
		</script>
		');

        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return array('sync:default');
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }
}


/**
 * Class IndexManagerController
 */
class IndexManagerController extends syncMainController
{

    /**
     * @return string
     */
    public static function getDefaultController()
    {
        return 'home';
    }
}