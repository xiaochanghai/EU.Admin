﻿/* 代码由框架生成,任何更改都可能导致被代码生成器覆盖，可自行修改。
* SdOrderPrepayment.cs
*
*功 能： N / A
* 类 名： SdOrderPrepayment
*
* Ver 变更日期 负责人 变更内容
* ───────────────────────────────────
*V0.01 2021/11/17 17:21:07 SimonHsiao 初版
*
* Copyright(c) 2021 SUZHOU EU Corporation. All Rights Reserved.
*┌──────────────────────────────────┐
*│　此技术信息为本公司机密信息，未经本公司书面同意禁止向第三方披露．　│
*│　版权所有：苏州一优信息技术有限公司                                │
*└──────────────────────────────────┘
*/
using EU.Entity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EU.Model
{

    /// <summary>
    /// 销售单预付账款
    /// </summary>
    [Entity(TableCnName = "销售单预付账款", TableName = "SdOrderPrepayment")]
    public class OrderPrepayment : Base.PersistPoco
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
        public int? SerialNumber { get; set; }

        /// <summary>
        /// 预付比例
        /// </summary>
        [Display(Name = "Percent"), Column(TypeName = "decimal(20,2)")]
        public decimal? Percent { get; set; }

        /// <summary>
        /// 预付金额
        /// </summary>
        [Display(Name = "Amount"), Column(TypeName = "decimal(20,2)")]
        public decimal? Amount { get; set; }

        /// <summary>
        /// 预付时间
        /// </summary>
        [Display(Name = "PayTime")]
        public DateTime? PayTime { get; set; }

        /// <summary>
        /// 已付金额
        /// </summary>
        [Display(Name = "HasAmount"), Column(TypeName = "decimal(20,2)")]
        public decimal? HasAmount { get; set; }

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