<?php
require MODX_CORE_PATH . 'model/modx/processors/resource/getlist.class.php';
class byResourceGetListProcessor extends modResourceGetListProcessor {
	//public $item_id = 0;

	/**
	 * {@inheritDoc}
	 * @return mixed
	 */
	public function process() {
		$beforeQuery = $this->beforeQuery();
		if ($beforeQuery !== true) {
			return $this->failure($beforeQuery);
		}
		$data = $this->getData();
		$list = $this->iterate($data);
		return $this->outputArray($list,$data['total']);
	}

	function afterIteration(array $list) {
		if ($query = $this->getProperty('query')) {
			if (strpos($query, '/') === 0 || strpos($query, '://') !== false) {
				$list[] = array('pagetitle' => $query, 'url' => $query);
			}
		}
		return $list;
	}


	/**
	 * Get the data of the query
	 * @return array
	 */
	public function getData() {
		$data = array();
		$limit = intval($this->getProperty('limit'));
		$start = intval($this->getProperty('start'));

		/* query for chunks */
		$c = $this->modx->newQuery($this->classKey);
		$c = $this->prepareQueryBeforeCount($c);
		$data['total'] = $this->modx->getCount($this->classKey,$c);
		$c = $this->prepareQueryAfterCount($c);

		$sortClassKey = $this->getSortClassKey();
		$sortKey = $this->modx->getSelectColumns($sortClassKey,$this->getProperty('sortAlias',$sortClassKey),'',array($this->getProperty('sort')));
		if (empty($sortKey)) $sortKey = $this->getProperty('sort');
		$c->sortby($sortKey,$this->getProperty('dir'));
		if ($limit > 0) {
			$c->limit($limit,$start);
		}

		if ($c->prepare() && $c->stmt->execute()) {
			$data['results'] = $c->stmt->fetchAll(PDO::FETCH_ASSOC);
		}

		return $data;
	}


	/**
	 * Iterate across the data
	 *
	 * @param array $data
	 * @return array
	 */
	public function iterate(array $data) {
		$list = array();
		$list = $this->beforeIteration($list);
		$this->currentIndex = 0;
		/** @var xPDOObject|modAccessibleObject $object */
		foreach ($data['results'] as $array) {
			$objectArray = $this->prepareResult($array);
			if (!empty($objectArray) && is_array($objectArray)) {
				$list[] = $objectArray;
				$this->currentIndex++;
			}
		}
		$list = $this->afterIteration($list);
		return $list;
	}

	/**
	 * {@inheritDoc}
	 * @return xPDOQuery
	 */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
		$c->select('id,parent,pagetitle,context_key');
		if ($query = $this->getProperty('query')) {
			$c->where(array('pagetitle:LIKE' => "%$query%"));
		}

		return $c;
	}

	/**
	 * {@inheritDoc}
	 * @return array
	 */
	public function prepareResult(array $resourceArray) {
		$resourceArray['parents'] = array();
		$parents = $this->modx->getParentIds($resourceArray['id'], 2, array('context' => $resourceArray['context_key']));
		if (!empty($parents) && $parents[count($parents) - 1] == 0) {
			unset($parents[count($parents) - 1]);
		}
		if (!empty($parents) && is_array($parents)) {
			$q = $this->modx->newQuery('modResource', array('id:IN' => $parents));
			$q->select('id,pagetitle');
			if ($q->prepare() && $q->stmt->execute()) {
				while ($row = $q->stmt->fetch(PDO::FETCH_ASSOC)) {
					$key = array_search($row['id'], $parents);
					if ($key !== false) {
						$parents[$key] = $row;
					}
				}
			}
			$resourceArray['parents'] = array_reverse($parents);
		}
		$resourceArray['url'] = '[[~'.$resourceArray['id'].']]';

		return $resourceArray;
	}

}

return 'byResourceGetListProcessor';
