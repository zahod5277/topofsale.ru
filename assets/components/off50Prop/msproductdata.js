//extend grid
var sexitems = new Ext.data.ArrayStore({
    id: 'minishop2-product-sex'
    ,fields: ['value',{name: 'name', type: 'string'}]
    ,data: [['мужской','мужской'],['женский','женский'],['унисекс','унисекс']]
});
var statusitems = new Ext.data.ArrayStore({
    id: 'minishop2-product-stat'
    ,fields: ['value',{name: 'name', type: 'string'}]
    ,data: [['новые','новые'],['б/у','б/у']]
});

miniShop2.combo.ProductSex = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: sexitems
        ,displayField: 'name'
        ,valueField: 'value'
        ,hiddenName: 'sex' //не забудьте поменять
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,selectOnFocus: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    miniShop2.combo.ProductSex.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.combo.ProductSex,MODx.combo.ComboBox);
Ext.reg('minishop2-combo-product-sex',miniShop2.combo.ProductSex);

miniShop2.combo.ProductStat = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: statusitems
        ,displayField: 'name'
        ,valueField: 'value'
        ,hiddenName: 'stat' //не забудьте поменять
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,selectOnFocus: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    miniShop2.combo.ProductStat.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.combo.ProductStat,MODx.combo.ComboBox);
Ext.reg('minishop2-combo-product-stat',miniShop2.combo.ProductStat);
//plugin
miniShop2.plugin.off50Prop = {
    getFields: function (config) {
        return {
            body_diameter: {
                xtype: 'textfield',
                description: '<b>[[+body_diameter]]</b><br />' + _('ms2_product_body_diameter_help')
            },
            complect: {
                xtype: 'textfield',
                description: '<b>[[+complect]]</b><br />' + _('ms2_product_complect_help')
            },
            body_material: {
                xtype: 'textfield',
                description: '<b>[[+body_material]]</b><br />' + _('ms2_product_body_material_help')
            },
            clockwork: {
                xtype: 'textfield',
                description: '<b>[[+clockwork]]</b><br />' + _('ms2_product_clockwork_help')
            },
            sex: {
                xtype: 'minishop2-combo-product-sex',fieldLabel: 'Пол',
                description: '<b>[[+sex]]</b><br />' + _('ms2_product_sex_help')
            },
            strap_type: {
                xtype: 'textfield',
                description: '<b>[[+strap_type]]</b><br />' + _('ms2_product_strap_type_help')
            },
            strap_color: {
                xtype: 'textfield',
                description: '<b>[[+strap_color]]</b><br />' + _('ms2_product_strap_color_help')
            },
            dial_color: {
                xtype: 'textfield',
                description: '<b>[[+dial_color]]</b><br />' + _('ms2_product_dial_color_help')
            },
            stat: {
                xtype: 'minishop2-combo-product-stat',
                description: '<b>[[+stat]]</b><br />' + _('ms2_product_stat_help')
            },
            forma: {
                xtype: 'textfield',
                description: '<b>[[+forma]]</b><br />' + _('ms2_product_forma_help')
            },
            complication: {
                xtype: 'minishop2-combo-options',
                description: '<b>[[+complication]]</b><br />' + _('ms2_product_complication_help')
            },
            functions: {
                xtype: 'minishop2-combo-options',
                description: '<b>[[+functions]]</b><br />' + _('ms2_product_functions_help')
            },
            water_resist: {
                xtype: 'textfield',
                description: '<b>[[+water_resist]]</b><br />' + _('ms2_product_water_resist_help')
            },
            glass: {
                xtype: 'textfield',
                description: '<b>[[+glass]]</b><br />' + _('ms2_product_glass_help')
            },
            calibr: {
                xtype: 'textfield',
                description: '<b>[[+calibr]]</b><br />' + _('ms2_product_calibr_help')
            },
            power_reserve: {
                xtype: 'textfield',
                description: '<b>[[+power_reserve]]</b><br />' + _('ms2_product_power_reserve_help')
            },
            limited: {
                xtype: 'textfield',
                description: '<b>[[+limited]]</b><br />' + _('ms2_product_limited_help')
            },
            year: {
                xtype: 'textfield',
                description: '<b>[[+year]]</b><br />' + _('ms2_product_year_help')
            },
            bezel: {
                xtype: 'textfield',
                description: '<b>[[+bezel]]</b><br />' + _('ms2_product_bezel_help')
            },
            body_comment: {
                xtype: 'textfield',
                description: '<b>[[+body_comment]]</b><br />' + _('ms2_product_body_comment_help')
            },
            strap_comment: {
                xtype: 'textfield',
                description: '<b>[[+strap_comment]]</b><br />' + _('ms2_product_strap_comment_help')
            },
            backcap: {
                xtype: 'textfield',
                description: '<b>[[+backcap]]</b><br />' + _('ms2_product_backcap_help')
            },
            jewerl_count: {
                xtype: 'textfield',
                description: '<b>[[+jewerl_count]]</b><br />' + _('ms2_product_jewerl_count_help')
            },
            sale: {
                xtype: 'xcheckbox',
                inputValue: 1,
                checked: parseInt(config.record.sale|| 1),
                description: '<b>[[+sale]]</b><br />' + _('ms2_product_sale_help')
            }
        };
    },
    getColumns: function () {
        return {
            body_diameter: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'body_diameter'}
            },
            complect: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'complect'}
            },
            body_material: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'body_material'}
            },
            clockwork: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'clockwork'}
            },
            sex: {
                width: 50,
                sortable: false,
                editor: {xtype: 'minishop2-product-sex', name: 'sex'}
            },
            strap_type: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'strap_type'}
            },
            strap_color: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'strap_color'}
            },
            dial_color: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'dial_color'}
            },
            stat: {
                width: 50,
                sortable: false,
                editor: {xtype: 'minishop2-combo-product-stat', name: 'stat'}
            },
            forma: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'forma'}
            },
            complication: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'complication'}
            },
            functions: {
                width: 50,
                sortable: false,
                editor: {xtype: 'minishop2-combo-options', name: 'functions'}
            },
            water_resist: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'water_resist'}
            },
            glass: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'glass'}
            },
            calibr: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'calibr'}
            },
            power_reserve: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'power_reserve'}
            },
            limited: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'limited'}
            },
            year: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'year'}
            },
            bezel: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'bezel'}
            },
            body_comment: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'body_comment'}
            },
            strap_comment: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'strap_comment'}
            },
            backcap: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'strap_comment'}
            },
            jewerl_count: {
                width: 50,
                sortable: false,
                editor: {xtype: 'textfield', name: 'jewerl_count'}
            },
            sale: {
                width: 50,
                sortable: false,
                editor: {xtype:'combo-boolean', renderer:'boolean', name: 'sale'}
            }
        };
    }
};