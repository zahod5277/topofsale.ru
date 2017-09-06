<?php

/**
 * The home manager controller for currencyrate.
 *
 */
class currencyrateHomeManagerController extends currencyrateMainController
{
    /* @var currencyrate $currencyrate */
    public $currencyrate;


    /**
     * @param array $scriptProperties
     */
    public function process(array $scriptProperties = array())
    {
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('currencyrate');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addJavascript($this->currencyrate->config['jsUrl'] . 'mgr/misc/combo.js');
        $this->addJavascript($this->currencyrate->config['jsUrl'] . 'mgr/misc/utils.js');
        $this->addJavascript($this->currencyrate->config['jsUrl'] . 'mgr/widgets/window.js');
        $this->addJavascript($this->currencyrate->config['jsUrl'] . 'mgr/widgets/list.grid.js');
        $this->addJavascript($this->currencyrate->config['jsUrl'] . 'mgr/widgets/home.panel.js');
        $this->addJavascript($this->currencyrate->config['jsUrl'] . 'mgr/sections/home.js');
        $this->addHtml('<script type="text/javascript">
		Ext.onReady(function() {
			MODx.load({ xtype: "currencyrate-page-home"});
		});
		</script>');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        return $this->currencyrate->config['templatesPath'] . 'home.tpl';
    }
}