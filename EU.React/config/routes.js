export default
  [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',

            },
            {
              component: './attachment',
            }
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [{
            path: '/',
            name: "首页",
            redirect: '/welcome',
          },
          {
            component: '404',
            name: '404',
            path: '/404',
          },
          {
            path: '/welcome',
            name: '首页',
            icon: 'smile',
            component: './dashboard/analysis',
          },
          {
            path: '/dashboard/analysis',
            name: '分析',
            icon: 'smile',
            component: './dashboard/analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            icon: 'smile',
            component: './dashboard/monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            icon: 'smile',
            component: './dashboard/workplace',
          },
          {
            path: "/ap/check",
            name: "应付对账单",
            component: "./ap/check"
          },
          {
            path: "/ap/initaccount",
            name: "应付期初建账",
            component: "./ap/initaccount"
          },
          {
            path: "/ap/invoice",
            name: "应付发票维护",
            icon: "",
            component: "./ap/invoice"
          },
          {
            path: "/ap/payment",
            name: "应付付款单",
            component: "./ap/payment"
          },
          {
            path: "/ap/prepaid",
            name: "应付预付单",
            component: "./ap/prepaid"
          },
          {
            path: "/ar/check",
            name: "应收对账单",
            component: "./ar/check"
          },
          {
            path: "/ar/initaccount",
            name: "应收期初建账",
            component: "./ar/initaccount"
          },
          {
            path: "/ar/invoice",
            name: "销售发票开立",
            icon: "",
            component: "./ar/invoice"
          },
          {
            path: "/ar/prepaid",
            name: "销售预收款",
            component: "./ar/prepaid"
          },
          {
            path: "/ar/collection",
            name: "销售收款单",
            component: "./ar/collection"
          },
          {
            path: "/basedata/color",
            name: "颜色资料",
            component: "./basedata/color"
          },
          {
            path: "/basedata/currency",
            name: "币别设置",
            icon: "",
            component: "./basedata/currency"
          },
          {
            path: "/basedata/customer",
            name: "客户管理",
            component: "./basedata/customer"
          },
          {
            path: "/basedata/deliveryway",
            name: "送货方式",
            component: "./basedata/deliveryway"
          },
          {
            path: "/basedata/material",
            name: "物料管理",
            component: "./basedata/material"
          },
          {
            path: "/basedata/materialtype",
            name: "物料类型",
            component: "./basedata/materialtype"
          },
          {
            path: "/basedata/unit",
            name: "计量单位",
            component: "./basedata/unit"
          },
          {
            path: "/basedata/settlementway",
            name: "结算方式",
            component: "./basedata/settlementway"
          },
          {
            path: "/basedata/stock",
            name: "仓库管理",
            component: "./basedata/stock"
          },
          {
            path: "/basedata/supplier",
            name: "供应商管理",
            component: "./basedata/supplier"
          },
          {
            path: "/basedata/texture",
            name: "材质资料",
            component: "./basedata/texture"
          },
          {
            path: "/machine/machine",
            name: "设备基础资料",
            component: "./machine/machine"
          },
          {
            path: "/machine/type",
            name: "设备分类",
            component: "./machine/type"
          },
          {
            path: "/stock/ivavailableanalysisreport",
            name: "可用库存分析",
            component: "./stock/ivavailableanalysisreport"
          },
          {
            path: "/stock/ivsafeinventorywarningreport",
            name: "安全库存预警",
            component: "./stock/ivsafeinventorywarningreport"
          },
          {
            path: "/stock/actualcheck",
            name: "实际盘点录入",
            component: "./stock/actualcheck"
          },
          {
            path: "/stock/adjust",
            name: "库存调整单",
            component: "./stock/adjust"
          },
          {
            path: "/stock/check",
            name: "存货盘点建立",
            component: "./stock/check"
          },
          {
            path: "/stock/init",
            name: "库存初始化",
            component: "./stock/init"
          },
          {
            path: "/stock/otherin",
            name: "其他入库单",
            component: "./stock/otherin"
          },
          {
            path: "/stock/otherout",
            name: "其他出库单",
            component: "./stock/otherout"
          },
          {
            path: "/stock/change",
            name: "库存交易明细",
            component: "./stock/change"
          },
          {
            path: "/stock/query",
            name: "库存查询",
            component: "./stock/query"
          },
          {
            path: "/stock/transfers",
            name: "库存调拨单",
            component: "./stock/transfers"
          },
          {
            path: "/mf/in",
            name: "工模治具入账",
            component: "./mf/in"
          },
          {
            path: "/mf/mould",
            name: "工模治具",
            component: "./mf/mould"
          },
          {
            path: "/mf/type",
            name: "工模治具类别",
            component: "./mf/type"
          },
          {
            path: "/pd/close",
            name: "工单批量结清",
            component: "./pd/close"
          },
          {
            path: "/pd/complete",
            name: "产品完工入库",
            component: "./pd/complete"
          },
          {
            path: "/pd/order",
            name: "生产工单",
            component: "./pd/order"
          },
          {
            path: "/pd/out",
            name: "材料出库工单",
            component: "./pd/out"
          },
          {
            path: "/pd/plan",
            name: "生产计划工单",
            icon: "smile",
            component: "./pd/plan"
          },
          {
            path: "/pd/reissue",
            name: "材料补发工单",
            component: "./pd/reissue"
          },
          {
            path: "/pd/require",
            name: "需求分析工单",
            component: "./pd/require"
          },
          {
            path: "/pd/return",
            name: "材料退库作业",
            component: "./pd/return"
          },
          {
            path: "/purchase/arrival",
            name: "采购到货通知",
            component: "./purchase/arrival"
          },
          {
            path: "/purchase/deduction",
            name: "采购扣款单",
            component: "./purchase/deduction"
          },
          {
            path: "/purchase/fee",
            name: "采购费用单",
            component: "./purchase/fee"
          },
          {
            path: "/purchase/in",
            name: "采购入库单",
            component: "./purchase/in"
          },
          {
            path: "/purchase/poorderanalysisreport",
            name: "采购单分析",
            component: "./purchase/poorderanalysisreport"
          },
          {
            path: "/purchase/order",
            name: "采购单建立",
            component: "./purchase/order"
          },
          {
            path: "/purchase/porequestiondetailreport",
            name: "请购单明细表",
            component: "./purchase/porequestiondetailreport"
          },
          {
            path: "/purchase/requestion",
            name: "请购单作业",
            component: "./purchase/requestion"
          },
          {
            path: "/purchase/return",
            name: "采购退货单",
            component: "./purchase/return"
          },
          {
            path: "/purchase/pounarrivalanalysisreport",
            name: "采购未到货分析",
            component: "./purchase/pounarrivalanalysisreport"
          },
          {
            path: "/ps/reason",
            name: "工序不良原因",
            component: "./ps/reason"
          },
          {
            path: "/ps/bom",
            name: "工程BOM建立",
            component: "./ps/bom"
          },
          {
            path: "/ps/process",
            name: "工序建立",
            component: "./ps/process"
          },
          {
            path: "/ps/template",
            name: "工序模板",
            component: "./ps/template"
          },
          {
            path: "/ps/workshop",
            name: "制造车间建立",
            component: "./ps/workshop"
          },
          {
            path: "/sales/outorder",
            name: "销售出库单",
            component: "./sales/outorder"
          },
          {
            path: "/sales/returnorder",
            name: "销售退货单",
            component: "./sales/returnorder"
          },
          {
            path: "/sales/salesunoutanalysisreport",
            name: "订单未出货分析",
            component: "./sales/salesunoutanalysisreport"
          },
          {
            path: "/sales/salesorder",
            name: "销售订单建立",
            component: "./sales/salesorder"
          },
          {
            path: "/sales/salesreport",
            name: "销售订单分析",
            component: "./sales/salesreport"
          },
          {
            path: "/sales/shiporder",
            name: "计划发货作业",
            component: "./sales/shiporder"
          },
          {
            path: "/system/setup/autocode",
            name: "自动编号",
            component: "./system/setup/autocode"
          },
          {
            path: "/system/city",
            name: "城市维护",
            icon: "smile",
            component: "./system/city"
          },
          {
            path: "/system/clear",
            name: "清空缓存",
            component: "./system/clear"
          },
          {
            path: "/system/companystructure/company",
            name: "组织管理",
            icon: "smile",
            component: "./system/companystructure/company"
          },
          {
            path: "/system/setup/paramconfig",
            name: "系统参数配置",
            icon: "user",
            component: "./system/setup/paramconfig"
          },
          {
            path: "/system/companystructure/department",
            name: "部门管理",
            icon: "smile",
            component: "./system/companystructure/department"
          },
          {
            path: "/system/companystructure/employee",
            name: "员工管理",
            icon: "smile",
            component: "./system/companystructure/employee"
          },
          {
            path: "/system/privilege/functionpriv",
            name: "功能权限",
            icon: "smile",
            component: "./system/privilege/functionpriv"
          },
          {
            path: "/import/config",
            name: "导入模板定义",
            component: "./import/config"
          },
          {
            path: "/system/monitor/job",
            name: "任务管理",
            component: "./system/monitor/job"
          },
          {
            path: "/system/monitor/server",
            name: "服务器信息",
            component: "./system/monitor/server"
          },
          {
            path: "/system/setup/setparam",
            name: "参数管理",
            component: "./system/setup/setparam"
          },
          {
            path: "/system/module",
            name: "系统模块",
            icon: "appstoreadd",
            component: "./system/module"
          },
          {
            path: "/system/province",
            name: "省份维护",
            icon: "smile",
            component: "./system/province"
          },
          {
            path: "/system/privilege/role",
            name: "用户角色",
            icon: "userswitch",
            component: "./system/privilege/role"
          },
          {
            path: "/system/workplace/schedule",
            name: "待办事项",
            icon: "smile",
            component: "./system/workplace/schedule"
          },
          {
            path: "/system/table",
            name: "系统表字典",
            component: "./system/table"
          },
          {
            path: "/system/privilege/user",
            name: "用户管理",
            icon: "user",
            component: "./system/privilege/user"
          },
          {
            path: "/system/setup/workflow",
            name: "流程设计",
            component: "./system/setup/workflow"
          },
          {
            path: "/wx/config",
            name: "账号配置",
            component: "./wx/config"
          },
          {
            path: "/account/settings",
            name: "个人设置",
            icon: "",
            component: "./account/settings"
          }
          ],
        },
      ],
    },
  ];
