<?php

/**
 * The base class for currencyrate.
 */
class currencyrate
{
    /* @var modX $modx */
    public $modx;
    public $namespace = 'currencyrate';
    public $cache = null;
    public $active = false;
    public $config = array();

    protected $list = array();
    protected $rub = array(
        'numcode'  => 643,
        'charcode' => 'RUB',
        'name'     => 'Российский рубль',
        'rate'     => 0
    );
    public $currency;
    /* @var pdoTools $pdoTools */
    public $pdoTools;

    /**
     * @param modX  $modx
     * @param array $config
     */
    function __construct(modX &$modx, array $config = array())
    {
        $this->modx =& $modx;

        $this->namespace = $this->getOption('namespace', $config, 'currencyrate');
        $corePath = $this->modx->getOption('currencyrate_core_path', $config,
            $this->modx->getOption('core_path') . 'components/currencyrate/');
        $assetsUrl = $this->modx->getOption('currencyrate_assets_url', $config,
            $this->modx->getOption('assets_url') . 'components/currencyrate/');
        $connectorUrl = $assetsUrl . 'connector.php';

        $this->config = array_merge(array(
            'assetsUrl'    => $assetsUrl,
            'cssUrl'       => $assetsUrl . 'css/',
            'jsUrl'        => $assetsUrl . 'js/',
            'imagesUrl'    => $assetsUrl . 'images/',
            'connectorUrl' => $connectorUrl,

            'corePath'       => $corePath,
            'modelPath'      => $corePath . 'model/',
            'chunksPath'     => $corePath . 'elements/chunks/',
            'templatesPath'  => $corePath . 'elements/templates/',
            'chunkSuffix'    => '.chunk.tpl',
            'snippetsPath'   => $corePath . 'elements/snippets/',
            'processorsPath' => $corePath . 'processors/',

            'last_date' => $this->modx->getOption('currencyrate_last_date'),
            'currency'  => & $_COOKIE['currency'],

        ), $config);

        $this->modx->addPackage('currencyrate', $this->config['modelPath']);
        $this->modx->lexicon->load('currencyrate:default');
        $this->active = $this->modx->getOption('currencyrate_active', $config, false);
        $this->currency = &$this->config['currency'];
        if (empty($this->currency)) {
            $this->currency = $this->modx->getOption('currencyrate_currency', null, $this->rub['charcode']);
        }
    }

    /**
     * @param       $key
     * @param array $config
     * @param null  $default
     *
     * @return mixed|null
     */
    public function getOption($key, $config = array(), $default = null)
    {
        $option = $default;
        if (!empty($key) && is_string($key)) {
            if ($config != null && array_key_exists($key, $config)) {
                $option = $config[$key];
            } elseif (array_key_exists($key, $this->config)) {
                $option = $this->config[$key];
            } elseif (array_key_exists("{$this->namespace}.{$key}", $this->modx->config)) {
                $option = $this->modx->getOption("{$this->namespace}.{$key}");
            }
        }

        return $option;
    }

    /**
     * Initializes msOptionsPrice into different contexts.
     *
     * @param string $ctx The context to load. Defaults to web.
     * @param array  $scriptProperties array with additional parameters
     *
     * @return boolean
     */
    public function initialize($ctx = 'web', $scriptProperties = array())
    {
        $this->config = array_merge($this->config, $scriptProperties);
        if (!$this->pdoTools) {
            $this->loadPdoTools();
        }
        $this->pdoTools->setConfig($this->config);
        $this->config['ctx'] = $ctx;
        if (!empty($this->initialized[$ctx])) {
            return true;
        }
        switch ($ctx) {
            case 'mgr':
                break;
            default:
                if (!defined('MODX_API_MODE') || !MODX_API_MODE) {
                    $config = $this->makePlaceholders($this->config);
                    $css = !empty($this->config['front_css'])
                        ? $this->config['front_css']
                        : $this->modx->getOption('currencyrate_front_css');
                    if (!empty($css) && preg_match('/\.css/i', $css)) {
                        $this->modx->regClientCSS(str_replace($config['pl'], $config['vl'], $css));
                    }
                    $js = !empty($this->config['front_js'])
                        ? $this->config['front_js']
                        : $this->modx->getOption('currencyrate_front_js');
                    if (!empty($js) && preg_match('/\.js/i', $js)) {
                        $this->modx->regClientScript(str_replace($config['pl'], $config['vl'], $js));
                    }
                }
                $this->initialized[$ctx] = true;
                break;
        }

        return true;
    }

    /**
     * формируем массив валют
     *
     * @return bool
     */
    public function loadRate()
    {
        $xml = new DOMDocument();
        $url = $this->modx->getOption('currencyrate_url', '',
                'http://www.cbr.ru/scripts/XML_daily.asp?date_req=') . date('d/m/Y');
        if (@$xml->load($url)) {
            $this->list = array();
            $root = $xml->documentElement;
            $items = $root->getElementsByTagName('Valute');

            foreach ($items as $item) {
                $numcode = $item->getElementsByTagName('NumCode')->item(0)->nodeValue;
                $charcode = $item->getElementsByTagName('CharCode')->item(0)->nodeValue;
                $nominal = $item->getElementsByTagName('Nominal')->item(0)->nodeValue;
                $name = $item->getElementsByTagName('Name')->item(0)->nodeValue;
                $value = $item->getElementsByTagName('Value')->item(0)->nodeValue;
                $value = floatval(str_replace(',', '.', $value));

                $this->list[] = array(
                    'numcode'  => $numcode,
                    'charcode' => $charcode,
                    'nominal'  => $nominal,
                    'name'     => $name,
                    'value'    => $value,
                );
            }
            if ($setting = $this->modx->getObject('modSystemSetting', 'currencyrate_last_date')) {
                $setting->set('value', date('Y-m-d H:i:s'));
                $setting->save();
            }

            return true;
        }
        else {
            $this->modx->log(1, print_r('[CR:Error] not cyrrency for url - ' . $url, 1));
        }

        return false;
    }

    /**
     * @return bool
     */
    public function rateIntoDb()
    {
        if ($this->loadRate()) {
            // add RUB
            if (!$itemFromDb = $this->modx->getObject('CRlist', array('numcode' => $this->rub['numcode']))) {
                $itemFromDb = $this->modx->newObject('CRlist');
                $itemFromDb->fromArray(array_merge(
                    $this->rub,
                    array(
                        'nominal'   => 1,
                        'value'     => 1,
                        'valuerate' => 1,
                        'rank'      => 0
                    )));
                if (!$itemFromDb->save()) {
                    $this->modx->log(1,
                        print_r('[CR:Error] save to db for charcode - ' . $itemFromDb->get('charcode'), 1));
                }
            }
            foreach ($this->list as $item) {
                if (!$itemFromDb = $this->modx->getObject('CRlist', array('numcode' => $item['numcode']))) {
                    $itemFromDb = $this->modx->newObject('CRlist');
                    $itemFromDb->set('rank', $this->modx->getCount('CRlist'));
                }
                $item['rate'] = $itemFromDb->get('rate');
                $item = $this->calcData($item);
                $itemFromDb->fromArray($item);
                if (!$itemFromDb->save()) {
                    $this->modx->log(1, print_r('[CR:Error] save to db for charcode - ' . $item['charcode'], 1));
                }
            }
            $this->cleanCache();

            return true;
        }
        $this->modx->log(1, print_r('[CR:Error] NO loadRate()', 1));

        return false;
    }

    /**
     * @param array $data
     *
     * @return array
     */
    public function calcData($data = array())
    {
        if (empty($data['nominal'])) {
            $data['nominal'] = 1;
        }
        $data['valuerate'] = round(($data['value'] / $data['nominal']), 4);
        $valuerate = $this->calcValueRate($data['valuerate'], $data['rate']);
        if ((float)$valuerate == (float)$data['valuerate']) {
            $data['rate'] = '';
        }
        $data['valuerate'] = $valuerate;
        $data['charcode'] = strtoupper($data['charcode']);
        if ($data['rate'] == '') {
            $data['rate'] = 0;
        }

        return $data;
    }

    /**
     * @param $value
     * @param $rate
     *
     * @return float
     */
    public function calcValueRate($value, $rate)
    {
        if (preg_match('/%$/', $rate)) {
            $rate = str_replace('%', '', $rate);
            $rate = $value / 100 * $rate;
        }
        $value += $rate;

        return round($value, 4);
    }

    /**
     * from
     * https://github.com/bezumkin/Tickets/blob/9c09152ae4a1cdae04fb31d2bc0fa57be5e0c7ea/core/components/tickets/model/tickets/tickets.class.php#L1120
     *
     * Loads an instance of pdoTools
     * @return boolean
     */
    public function loadPdoTools()
    {
        if (!is_object($this->pdoTools) || !($this->pdoTools instanceof pdoTools)) {
            /** @var pdoFetch $pdoFetch */
            $fqn = $this->modx->getOption('pdoFetch.class', null, 'pdotools.pdofetch', true);
            if ($pdoClass = $this->modx->loadClass($fqn, '', false, true)) {
                $this->pdoTools = new $pdoClass($this->modx, $this->config);
            } elseif ($pdoClass = $this->modx->loadClass($fqn, MODX_CORE_PATH . 'components/pdotools/model/', false,
                true)
            ) {
                $this->pdoTools = new $pdoClass($this->modx, $this->config);
            } else {
                $this->modx->log(modX::LOG_LEVEL_ERROR,
                    'Could not load pdoFetch from "MODX_CORE_PATH/components/pdotools/model/".');
            }
        }

        return !empty($this->pdoTools) && $this->pdoTools instanceof pdoTools;
    }

    /**
     * from
     * https://github.com/bezumkin/Tickets/blob/9c09152ae4a1cdae04fb31d2bc0fa57be5e0c7ea/core/components/tickets/model/tickets/tickets.class.php#L1147
     *
     * Process and return the output from a Chunk by name.
     *
     * @param string  $name The name of the chunk.
     * @param array   $properties An associative array of properties to process the Chunk with, treated as placeholders
     *     within the scope of the Element.
     * @param boolean $fastMode If false, all MODX tags in chunk will be processed.
     *
     * @return string The processed output of the Chunk.
     */
    public function getChunk($name, array $properties = array(), $fastMode = false)
    {
        if (!$this->modx->parser) {
            $this->modx->getParser();
        }
        if (!$this->pdoTools) {
            $this->loadPdoTools();
        }

        return $this->pdoTools->getChunk($name, $properties, $fastMode);
    }

    /**
     * Method for transform array to placeholders
     *
     * @var array  $array With keys and values
     * @var string $prefix Prefix for array keys
     *
     * @return array $array Two nested arrays with placeholders and values
     */
    public function makePlaceholders(array $array = array(), $prefix = '')
    {
        if (!$this->pdoTools) {
            $this->loadPdoTools();
        }

        return $this->pdoTools->makePlaceholders($array, $prefix);
    }

    /**
     * @param string $message
     * @param array  $data
     * @param array  $placeholders
     *
     * @return array|string
     */
    public function error($message = '', $data = array(), $placeholders = array())
    {
        $response = array(
            'success' => false,
            'message' => $this->modx->lexicon($message, $placeholders),
            'data'    => $data,
        );

        return $this->config['json_response']
            ? $this->modx->toJSON($response)
            : $response;
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
            'message' => $this->modx->lexicon($message, $placeholders),
            'data'    => $data,
        );

        return $this->config['json_response']
            ? $this->modx->toJSON($response)
            : $response;
    }

    /**
     * from
     * https://github.com/Mark-H/ClientConfig/blob/master/core/components/clientconfig/model/clientconfig/clientconfig.class.php#L75
     *
     * Grab settings (from cache if possible) as key => value pairs.
     * @return array|mixed
     */
    public function getList()
    {
        /* Attempt to get from cache */
        $cacheOptions = array(xPDO::OPT_CACHE_KEY => 'crlist');
        $list = $this->modx->getCacheManager()->get('crlist', $cacheOptions);
        if (empty($list) && $this->modx->getCount('CRlist') > 0) {
            $collection = $this->modx->getCollection('CRlist');
            $list = array();
            /* @var CRlist $setting */
            foreach ($collection as $value) {
                $list[$value->get('charcode')] = $value->get('valuerate');
            }
            /* Write to cache again */
            $this->modx->cacheManager->set('crlist', $list, 0, $cacheOptions);
        }

        return (is_array($list)) ? $list : array();
    }

    /**
     * Function for formatting price
     *
     * @param string $price
     * @param string $format
     * @param bool   $no_zeros
     *
     * @return mixed|string
     */
    public function formatPrice($price = '0', $format = '[2, ".", " "]', $no_zeros = true)
    {
        $pf = $this->modx->fromJSON($format);
        if (is_array($pf)) {
            $price = number_format($price, $pf[0], $pf[1], $pf[2]);
        }
        if ($no_zeros) {
            if (preg_match('/\..*$/', $price, $matches)) {
                $tmp = rtrim($matches[0], '.0');
                $price = str_replace($matches[0], $tmp, $price);
            }
        }

        return $price;
    }

    /**
     * clean cache
     */
    public function cleanCache()
    {
        $cacheOptions = array(xPDO::OPT_CACHE_KEY => 'crlist');
        $this->modx->cacheManager->clean($cacheOptions);
        $this->modx->log(modX::LOG_LEVEL_INFO, '[CR:Info] Clearing the cache. Path: crlist');
    }

    /*
     *
     * Events
     *
     */

    /**
     * @param $sp
     */
    public function OnHandleRequest($sp)
    {
        $list = $this->getList();
        $this->modx->setPlaceholders($list, '+');
    }

    /**
     * @param $sp
     */
    public function OnBeforeCacheUpdate($sp)
    {
        $this->cleanCache();
    }

}