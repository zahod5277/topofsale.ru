<?php

/**
 * The home manager controller for sync.
 *
 */
class syncHomeManagerController extends syncMainController
{
    /* @var sync $sync */
    public $sync;


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
        return $this->modx->lexicon('sync');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->sync->config['cssUrl'] . 'mgr/main.css');
        $this->addCss($this->sync->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        $this->addJavascript($this->sync->config['jsUrl'] . 'mgr/misc/utils.js');
        $this->addJavascript($this->sync->config['jsUrl'] . 'mgr/widgets/items.grid.js');
        $this->addJavascript($this->sync->config['jsUrl'] . 'mgr/widgets/items.windows.js');
        $this->addJavascript($this->sync->config['jsUrl'] . 'mgr/widgets/home.panel.js');
        $this->addJavascript($this->sync->config['jsUrl'] . 'mgr/sections/home.js');
        $this->addHtml('<script type="text/javascript">
		Ext.onReady(function() {
			MODx.load({ xtype: "sync-page-home"});
		});
		</script>');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        return $this->sync->config['templatesPath'] . 'home.tpl';
    }
}