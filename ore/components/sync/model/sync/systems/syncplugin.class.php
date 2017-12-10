<?php

abstract class syncPlugin
{
    /** @var modX $modx */
    protected $modx;
    /** @var Sync $Sync */
    protected $Sync;
    /** @var array $scriptProperties */
    protected $scriptProperties;

    public function __construct(modX $modx, &$scriptProperties)
    {
        $this->modx = &$modx;
        $this->scriptProperties =& $scriptProperties;

        if (!$this->Sync = &$this->modx->sync) {
            return;
        }
        
        $this->Sync->initialize($this->modx->context->key);
    }

    abstract public function run();
}