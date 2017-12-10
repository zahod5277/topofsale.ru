<?php


/* button */

$_lang['sync_button_cancel'] = '<i class="icon icon-times red"></i>';
$_lang['sync_button_start'] = '<i class="icon icon-refresh blue"></i>';
$_lang['sync_button_stop'] = '<i class="icon icon-stop red"></i>';
$_lang['sync_button_play'] = '<i class="icon icon-play green"></i>';

/* tooltip */
$_lang['sync_tooltip_id'] = 'Id';
$_lang['sync_tooltip_clear'] = 'Очистить';
$_lang['sync_tooltip_cancel'] = 'Отменить';
$_lang['sync_tooltip_start'] = 'Стартовать заново';
$_lang['sync_tooltip_stop'] = 'Остановить/Запустить';
$_lang['sync_tooltip_category'] = 'Категория';

/* fields */
$_lang['sync_all'] = 'Все';
$_lang['sync_name'] = 'Имя';
$_lang['sync_data'] = 'Данные';
$_lang['sync_id'] = 'Идентификатор';
$_lang['sync_service'] = 'Сервис';


/* tabs */
$_lang['sync_tab_main'] = 'Основное';


/* action */
$_lang['sync_action_turnon'] = 'Включить';
$_lang['sync_action_turnoff'] = 'Выключить';
$_lang['sync_action_active'] = 'Активировать';
$_lang['sync_action_blocked'] = 'Блокировать';
$_lang['sync_action_remove'] = 'Удалить';
$_lang['sync_action_create'] = 'Создать';
$_lang['sync_action_update'] = 'Обновить';
$_lang['sync_action_show'] = 'Показать';

$_lang['sync_action_sync'] = 'Cинхронизация';
$_lang['sync_action_import'] = 'Импорт';
$_lang['sync_action_export'] = 'Экпорт';
$_lang['sync_action_stock'] = 'Остатки';
$_lang['sync_action_modification'] = 'Модификации';
$_lang['sync_action_remove_locks'] = 'Снять блокировки';
$_lang['sync_action_remove_bind'] = 'Снять привязку';

/* service */
$_lang['sync_service_system'] = 'Система';


/* info */
$_lang['sync_step_sync_running'] = 'Синхронизация...';
$_lang['sync_step_sync_init'] = '[[+sync_time]]: Инициализация';

$_lang['sync_step_sync_read_config'] = 'Получение конфигурации';
$_lang['sync_step_sync_set_sync_category'] = 'Установка корневой категории синхронизации';

$_lang['sync_step_sync_read_currency'] = 'Получение валют ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_category'] = 'Получение категорий ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_product'] = 'Получение продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_service'] = 'Получение услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_read_store'] = 'Получение складов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_stock'] = 'Получение остатков ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_product_stock'] = 'Получение остатков продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_modification_stock'] = 'Получение остатков модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_modification'] = 'Получение модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_metadata'] = 'Получение метаданных ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_product_metadata'] = 'Получение метаданных продукта ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_service_metadata'] = 'Получение метаданных услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_read_modification_metadata'] = 'Получение метаданных модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';


$_lang['sync_step_sync_import'] = 'Импорт';
$_lang['sync_step_sync_import_currency'] = 'Импорт валют';
$_lang['sync_step_sync_import_category'] = 'Импорт категорий';
$_lang['sync_step_sync_import_upd_category'] = 'Импорт обновление категорий ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_import_cre_category'] = 'Импорт создание категорий ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_import_product'] = 'Импорт продуктов';
$_lang['sync_step_sync_import_upd_product'] = 'Импорт обновление продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_import_cre_product'] = 'Импорт создание продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_import_modification'] = 'Импорт модификаций';
$_lang['sync_step_sync_import_upd_modification'] = 'Импорт обновление модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_import_stock'] = 'Импорт остатков';
$_lang['sync_step_sync_import_upd_stock'] = 'Импорт обновление остатков ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_import_upd_product_stock'] = 'Импорт обновление остатков продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_import_upd_modification_stock'] = 'Импорт обновление остатков модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_import_service'] = 'Импорт услуг';
$_lang['sync_step_sync_import_upd_service'] = 'Импорт обновление услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_import_cre_service'] = 'Импорт создание услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';


$_lang['sync_step_sync_export'] = 'Экспорт';
$_lang['sync_step_sync_export_currency'] = 'Экспорт валют';
$_lang['sync_step_sync_export_category'] = 'Экспорт категорий';
$_lang['sync_step_sync_export_service'] = 'Экспорт услуг';

$_lang['sync_step_sync_export_unl_category'] = 'Экспорт выгрузка категорий ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_unl_new_category'] = 'Экспорт выгрузка новых категорий ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_upd_category'] = 'Экспорт обновление категорий ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_cre_category'] = 'Экспорт создание категорий ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_export_unl_product'] = 'Экспорт выгрузка продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_unl_new_product'] = 'Экспорт выгрузка новых продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_cre_product'] = 'Экспорт создание продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_upd_product'] = 'Экспорт обновление продуктов ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_export_unl_modification'] = 'Экспорт выгрузка модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_unl_new_modification'] = 'Экспорт выгрузка новых модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_cre_modification'] = 'Экспорт создание модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_upd_modification'] = 'Экспорт обновление модификаций ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_export_unl_service'] = 'Экспорт выгрузка услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_unl_new_service'] = 'Экспорт выгрузка новых услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_cre_service'] = 'Экспорт создание услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';
$_lang['sync_step_sync_export_upd_service'] = 'Экспорт обновление услуг ([[+sync_count]] / <s>[[+sync_errors]]</s>)';

$_lang['sync_step_sync_export_product'] = 'Экспорт продуктов';
$_lang['sync_step_sync_export_modification'] = 'Экспорт модификаций';
$_lang['sync_step_sync_export_stock'] = 'Экспорт остатков';

$_lang['sync_step_sync_close'] = '[[+sync_time]]: Синхронизация окончена ([[+sync_errors]] ошибок)';


/* confirm */
$_lang['sync_confirm_remove'] = 'Вы уверены, что хотите удалить это?';
$_lang['sync_confirm_load'] = 'Вы уверены, что хотите загрузить это?';
$_lang['sync_confirm_remove_locks'] = 'Вы уверены, что хотите удалить блокировки?';
$_lang['sync_confirm_remove_bind'] = 'Вы уверены, что хотите удалить привязку синхронизации?';
