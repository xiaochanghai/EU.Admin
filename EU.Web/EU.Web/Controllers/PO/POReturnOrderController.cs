﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using EU.Common;
using EU.Core;
using EU.Core.Utilities;
using EU.DataAccess;
using EU.Domain;
using EU.Model;
using Microsoft.AspNetCore.Mvc;
using static EU.Core.Const.Consts;

namespace EU.Web.Controllers.PO
{
    [GlobalActionFilter, ApiExplorerSettings(GroupName = Grouping.PO)]
    public class POReturnOrderController : BaseController1<POReturnOrder>
    {

        public POReturnOrderController(DataContext _context, IBaseCRUDVM<POReturnOrder> BaseCrud) : base(_context, BaseCrud)
        {
        }

        #region 新增重写
        [HttpPost]
        public override IActionResult Add(POReturnOrder Model)
        {


            dynamic obj = new ExpandoObject();
            string status = "error";
            string message = string.Empty;

            try
            {
                //#region 检查是否存在相同的编码
                //Utility.CheckCodeExist("", "BdColor", "ColorNo", Model.ColorNo, ModifyType.Add, null, "材质编号");
                //#endregion 

                var supplier = _context.BdSupplier.Where(x => x.ID == Model.SupplierId).SingleOrDefault();
                if (supplier != null)
                {
                    Model.SupplierName = supplier.FullName;
                }
                Model.OrderNo = Utility.GenerateContinuousSequence("PoReturnOrderNo");
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

        #region 更新重写
        /// <summary>
        /// 更新重写
        /// </summary>
        /// <param name="modelModify"></param>
        /// <returns></returns>
        [HttpPost]
        public override IActionResult Update(dynamic modelModify)
        {

            dynamic obj = new ExpandoObject();
            string status = "error";
            string message = string.Empty;

            try
            {

                //#region 检查是否存在相同的编码
                //Utility.CheckCodeExist("", "BdColor", "ColorNo", modelModify.ColorNo.Value, ModifyType.Edit, modelModify.ID.Value, "材质编号");
                //#endregion

                string SupplierId = modelModify.SupplierId;
                var supplier = _context.BdSupplier.Where(x => x.ID == Guid.Parse(SupplierId)).SingleOrDefault();
                if (supplier != null)
                {
                    modelModify.SupplierName = supplier.FullName;
                }

                Update<POReturnOrder>(modelModify);
                _context.SaveChanges();

                status = "ok";
                message = "修改成功！";
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
        /// <param name="orderId"></param>
        /// <param name="auditStatus"></param>
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

                    //#region 检查单据是否被引用
                    //sql = @"SELECT A.*
                    //        FROM PoOrderDetail A
                    //             LEFT JOIN PoRequestionDetail B ON A.SourceOrderDetailId = B.ID
                    //        WHERE B.OrderId = '{0}' AND A.IsDeleted = 'false' AND A.IsActive = 'true'";
                    //sql = string.Format(sql, orderId);
                    //DataTable dt = DBHelper.Instance.GetDataTable(sql);
                    //#endregion

                    //if (dt.Rows.Count == 0)
                    auditStatus = "Add";
                    //else throw new Exception("该单据已被引用，不可撤销！");
                }

                #endregion

                DbUpdate du = new DbUpdate("PoReturnOrder");
                du.Set("AuditStatus", auditStatus);
                du.Where("ID", "=", orderId);
                DBHelper.Instance.ExecuteScalar(du.GetSql());

                #region 导入订单操作历史
                DBHelper.RecordOperateLog(User.Identity.Name, "PO_RETURN_ORDER_MNG", "PoReturnOrder", orderId, OperateType.Update, "Audit", "修改订单审核状态为：" + auditStatus);
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

        #region 获取详情
        [HttpGet]
        public override async Task<IActionResult> GetById(Guid Id)
        {
            dynamic obj = new ExpandoObject();
            string status = "error";
            string message = string.Empty;
            int count = 0;

            try
            {
                string sql = @"SELECT COUNT (0)
                            FROM PoReturnOrderDetail A
                            WHERE     A.IsDeleted = 'false'
                                  AND A.IsActive = 'true'
                                  AND A.OrderId = '{0}'";
                sql = string.Format(sql, Id);
                count = Convert.ToInt32(DBHelper.Instance.ExecuteScalar(sql));

                obj.data = _BaseCrud.GetById(Id);

            }
            catch (Exception E)
            {
                message = E.Message;
            }
            obj.count = count;
            obj.status = status;
            obj.message = message;
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
                var Order = _context.PoReturnOrder.Where(x => x.ID == Id).SingleOrDefault();

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

        #region 确认退货
        /// <summary>
        /// 确认退货
        /// </summary>
        /// <param name="id">退货单ID</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult ConfirmReturn(Guid Id)
        {

            dynamic obj = new ExpandoObject();
            string status = "error";
            string message = string.Empty;
            string sql = string.Empty;

            IDbTransaction trans = DBHelper.Instance.GetNewTransaction();

            try
            {

                Utility.IsNullOrEmpty(Id, "退货单ID不能为空！");

                sql = @"SELECT A.*
                            FROM PoReturnOrderDetail A
                            WHERE     A.OrderId = '{0}'
                                  AND A.IsDeleted = 'false'
                                  AND A.IsActive = 'true' AND A.OrderSource = 'InOrder'
                            ORDER BY A.SerialNumber ASC";
                sql = string.Format(sql, Id);
                List<POReturnOrderDetail> list = DBHelper.Instance.QueryList<POReturnOrderDetail>(sql);

                #region 更新订单状态
                DbUpdate du = new DbUpdate("PoReturnOrder");
                du.Set("AuditStatus", "CompleteReturn");
                du.Where("ID", "=", Id);
                DBHelper.Instance.ExecuteDML(du.GetSql(), null, null, trans);
                #endregion

                #region 批量更新退货数量
                sql = @"UPDATE A
                            SET A.ReturnQTY = (A.ReturnQTY + B.ReturnQTY)
                            FROM PoInOrderDetail A
                                 JOIN
                                 (SELECT SUM (A.ReturnQTY) ReturnQTY, A.SourceOrderDetailId
                                  FROM PoReturnOrderDetail A
                                  WHERE     A.OrderId = '{0}'
                                        AND A.IsDeleted = 'false'
                                        AND A.IsActive = 'true'
                                        AND A.OrderSource = 'InOrder'
                                  GROUP BY A.SourceOrderDetailId) B
                                    ON A.ID = B.SourceOrderDetailId
                            WHERE A.IsDeleted = 'false' AND A.IsActive = 'true';

                            UPDATE A
                            SET A.ReturnQTY = (A.ReturnQTY + B.ReturnQTY)
                            FROM PoArrivalOrderDetail A
                                 JOIN
                                 (SELECT SUM (A.ReturnQTY) ReturnQTY, A.SourceOrderDetailId
                                  FROM PoReturnOrderDetail A
                                  WHERE     A.OrderId = '{0}'
                                        AND A.IsDeleted = 'false'
                                        AND A.IsActive = 'true'
                                        AND A.OrderSource = 'ArrivalOrder'
                                  GROUP BY A.SourceOrderDetailId) B
                                    ON A.ID = B.SourceOrderDetailId
                            WHERE A.IsDeleted = 'false' AND A.IsActive = 'true'";
                sql = string.Format(sql, Id);
                DBHelper.Instance.ExecuteDML(sql, null, null, trans);
                #endregion

                #region 还原物料库存
                foreach (POReturnOrderDetail item in list)
                {
                    decimal qty = IVChangeHelper.GetMaterialInventory(item.MaterialId, item.StockId, item.GoodsLocationId, trans);

                    MaterialIVChange change = new MaterialIVChange();
                    change.CreatedBy = Guid.Parse(User.Identity.Name);
                    change.MaterialId = item.MaterialId;
                    change.StockId = item.StockId;
                    change.GoodsLocationId = item.GoodsLocationId;
                    change.BeforeQTY = qty;
                    change.QTY = item.ReturnQTY;
                    change.AfterQTY = qty + item.ReturnQTY;
                    change.ChangeType = IVChangeHelper.ChangeType.PurchaseReturn.ToString();
                    change.OrderId = item.OrderId;
                    change.OrderDetailId = item.ID;
                    IVChangeHelper.Add(change, trans);

                    sql = @"UPDATE BdMaterialInventory
                            SET QTY = QTY+'{3}'
                            WHERE MaterialId = '{0}'
                                  AND StockId = '{1}'
                                  AND GoodsLocationId = '{2}'";

                    sql = string.Format(sql, item.MaterialId, item.StockId, item.GoodsLocationId, item.ReturnQTY);
                    DBHelper.Instance.ExecuteDML(sql, null, null, trans);
                }
                #endregion

                DBHelper.Instance.CommitTransaction(trans);

                #region 导入订单操作历史
                DBHelper.RecordOperateLog(User.Identity.Name, "PO_RETURN_ORDER_MNG", "PoReturnOrder", Id.ToString(), OperateType.Update, "CompleteReturn", "修改订单状态为：CompleteReturn");
                #endregion

                status = "ok";
                message = "退回成功！";
            }
            catch (Exception E)
            {
                DBHelper.Instance.RollbackTransaction(trans);
                message = E.Message;
            }

            obj.status = status;
            obj.message = message;
            return Ok(obj);
        }
        #endregion

    }
}
