﻿/* 代码由框架生成,任何更改都可能导致被代码生成器覆盖，可自行修改。
* SdOrderDetail.cs
*
*功 能： N / A
* 类 名： SdOrderDetail
*
* Ver 变更日期 负责人 变更内容
* ───────────────────────────────────
*V0.01 2020/12/27 21:41:17 SimonHsiao 初版
*
* Copyright(c) 2020 SUZHOU EU Corporation. All rights reserved.
*┌──────────────────────────────────┐
*│　此技术信息为本公司机密信息，未经本公司书面同意禁止向第三方披露．　│
*│　版权所有：苏州一优信息技术有限公司                                │
*└──────────────────────────────────┘
*/
using EU.Entity;
using System;
using System.ComponentModel.DataAnnotations;

namespace EU.Model
{
    /// <summary>
    /// 销售订单明细
    /// </summary>
    [Entity(TableCnName = "", TableName = "SdOrderDetail")]
    public class OrderDetail : Base.PersistPoco
    {


        /// <summary>
        /// 订单ID
        /// </summary>
        [Display(Name = "OrderId")]
        public Guid? OrderId { get; set; }

        /// <summary>
        /// 序号
        /// </summary>
        [Display(Name = "SerialNumber")]
        public int SerialNumber { get; set; }

        /// <summary>
        /// 货品编号
        /// </summary>
        [Display(Name = "MaterialId")]
        public Guid? MaterialId { get; set; }

        /// <summary>
        /// 货品名称
        /// </summary>
        [Display(Name = "MaterialName")]
        public string MaterialName { get; set; }

        /// <summary>
        /// 单位
        /// </summary>
        [Display(Name = "MaterialUnitId")]
        public Guid? MaterialUnitId { get; set; }

        /// <summary>
        /// 数量
        /// </summary>
        [Display(Name = "Amount")]
        public decimal QTY { get; set; }

        /// <summary>
        /// 单价
        /// </summary>
        [Display(Name = "Price")]
        public decimal Price { get; set; }

        /// <summary>
        /// 未税金额
        /// </summary>
        [Display(Name = "NoTaxAmount")]
        public decimal NoTaxAmount { get; set; }

        /// <summary>
        /// 税额
        /// </summary>
        [Display(Name = "TaxAmount")]
        public decimal TaxAmount { get; set; }

        /// <summary>
        /// 含税金额
        /// </summary>
        [Display(Name = "TaxIncludedAmount")]
        public decimal TaxIncludedAmount { get; set; }

        /// <summary>
        /// 客户物料编码
        /// </summary>
        [Display(Name = "CustomerMaterialCode")]
        public string CustomerMaterialCode { get; set; }

        /// <summary>
        /// 交货日期
        /// </summary>
        [Display(Name = "DeliveryrDate")]
        public DateTime? DeliveryrDate { get; set; }

        /// <summary>
        /// 出货数量
        /// </summary>
        [Display(Name = "DeliveryrQTY")]
        public decimal DeliveryrQTY { get; set; }

        /// <summary>
        /// 退货数量
        /// </summary>
        [Display(Name = "SalesReturnQTY")]
        public decimal SalesReturnQTY { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [Display(Name = "ExtRemark1")]
        public string ExtRemark1 { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [Display(Name = "ExtRemark2")]
        public string ExtRemark2 { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [Display(Name = "ExtRemark3")]
        public string ExtRemark3 { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [Display(Name = "ExtRemark4")]
        public string ExtRemark4 { get; set; }
    }
}