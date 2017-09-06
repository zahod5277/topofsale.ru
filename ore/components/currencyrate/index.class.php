<?php

/**
 * Class currencyrateMainController
 */
abstract class currencyrateMainController extends modExtraManagerController
{
    /** @var currencyrate $currencyrate */
    public $currencyrate;


    /**
     * @return void
     */
    public function initialize()
    {
        $corePath = $this->modx->getOption('currencyrate_core_path', null,
            $this->modx->getOption('core_path') . 'components/currencyrate/');
        require_once $corePath . 'model/currencyrate/currencyrate.class.php';

        $this->currencyrate = new currencyrate($this->modx);

        $this->addCss($this->currencyrate->config['cssUrl'] . 'mgr/main.css');
        $this->addCss($this->currencyrate->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        $this->addCss($this->currencyrate->config['assetsUrl'] . 'vendor/fontawesome/css/font-awesome.min.css');
        $this->addJavascript($this->currencyrate->config['jsUrl'] . 'mgr/currencyrate.js');

        $this->addHtml('
		<script type="text/javascript">
			currencyrate.config = ' . $this->modx->toJSON($this->currencyrate->config) . ';
			currencyrate.config.connector_url = "' . $this->currencyrate->config['connectorUrl'] . '";
		</script>
		');

        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return array('currencyrate:default');
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
class IndexManagerController extends currencyrateMainController
{

    /**
     * @return string
     */
    public static function getDefaultController()
    {
        return 'home';
    }
}