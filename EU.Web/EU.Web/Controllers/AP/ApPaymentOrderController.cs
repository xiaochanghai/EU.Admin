﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using EU.Core;
using EU.Core.Utilities;
using EU.DataAccess;
using EU.Domain;
using EU.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using static EU.Core.Const.Consts;
using EU.Model.PD.Extend;
using EU.Core.Module;

namespace EU.Web.Controllers.AP
{
    /// <summary>
    /// 采购付款单
    /// </summary>
    [GlobalActionFilter, ApiExplorerSettings(GroupName = Grouping.AP)]
    public class ApPaymentOrderController : BaseController1<ApPaymentOrder>
    {
        /// <summary>
        /// 采购付款单
        /// </summary>
        /// <param name="_context"></param>
        /// <param name="BaseCrud"></param>
        public ApPaymentOrderController(DataContext _context, IBaseCRUDVM<ApPaymentOrder> BaseCrud) : base(_context, BaseCrud)
        {
        }

        #region 新增重写
        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="Model"></param>
        /// <returns></returns>
        [HttpPost]
        public override IActionResult Add(ApPaymentOrder Model)
        {


            dynamic obj = new ExpandoObject();
            string status = "error";
            string message = string.Empty;

            try
            {
                //#region 检查是否存在相同的编码
                //Utility.CheckCodeExist("", "BdColor", "ColorNo", Model.ColorNo, ModifyType.Add, null, "材质编号");
                //#endregion 

                Model.OrderNo = Utility.GenerateContinuousSequence("ApPaymentOrderNo");

                return base.Add(Model);
            }
            catch (Exception E)
            {
                message = E.Message;
            }

            obj.status = status;
            obj.message = message;
            return Ok(obj);
        }
        #endregion

        #region 审核
        /// <summary>
        /// 审核
        /// </summary>
        /// <param name="modelModify">数据</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult AuditOrder(dynamic modelModify)
        {

            dynamic obj = new ExpandoObject();
            string status = "error";
            string message = string.Empty;
            string orderId = modelModify.orderId;
            string auditStatus = modelModify.auditStatus;
            string sql = string.Empty;
            try
            {


                #region 修改订单审核状态
                if (auditStatus == "Add")
                    auditStatus = "CompleteAudit";
                else if (auditStatus == "CompleteAudit")
                {

                    #region 检查单据是否被引用
                    sql = @"SELECT A.ID
                                FROM PdReissueDetail A
                                WHERE     A.SourceOrderId = '{0}'
                                      AND A.IsDeleted = 'false'
                                      AND A.IsActive = 'true'
                                UNION
                                SELECT A.ID
                                FROM PdOutDetail A
                                WHERE     A.SourceOrderId = '{0}'
                                      AND A.IsDeleted = 'false'
                                      AND A.IsActive = 'true'
                                UNION
                                SELECT A.ID
                                FROM PdCompleteDetail A
                                WHERE     A.SourceOrderId = '{0}'
                                      AND A.IsDeleted = 'false'
                                      AND A.IsActive = 'true'";
                    sql = string.Format(sql, orderId);
                    DataTable dt = DBHelper.Instance.GetDataTable(sql);
                    #endregion

                    if (dt.Rows.Count == 0)
                        auditStatus = "Add";
                    else throw new Exception("该单据已被引用，不可撤销！");
                }

                #endregion

                DbUpdate du = new DbUpdate("ApPaymentOrder");
                du.Set("AuditStatus", auditStatus);
                du.Where("ID", "=", orderId);
                DBHelper.Instance.ExecuteScalar(du.GetSql());

                #region 导入订单操作历史
                DBHelper.RecordOperateLog(UserId.ToString(), "PD_ORDER_MNG", "ApPaymentOrder", orderId, OperateType.Update, "Audit", "修改订单审核状态为：" + auditStatus);
                #endregion


                status = "ok";
                message = "提交成功！";
            }
            catch (Exception E)
            {
                message = E.Message;
            }

            obj.status = status;
            obj.message = message;
            obj.auditStatus = auditStatus;
            return Ok(obj);
        }
        #endregion

        #region 删除
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        public override IActionResult Delete(Guid Id)
        {
            dynamic obj = new ExpandoObject();
            string status = "error";
            string message = string.Empty;

            try
            {
                var Order = _context.ApPaymentOrder.Where(x => x.ID == Id).SingleOrDefault();

                if (Order == null)
                    throw new Exception("无效的数据ID！");

                if (Order.AuditStatus != "Add")
                    throw new Exception("该单据已审核通过，暂不可进行删除操作！");

                _BaseCrud.DoDelete(Id);

                status = "ok";
                message = "删除成功！";
            }
            catch (Exception E)
            {
                message = E.Message;
            }

            obj.status = status;
            obj.message = message;
            return Ok(obj);
        }
        #endregion

    }
}
