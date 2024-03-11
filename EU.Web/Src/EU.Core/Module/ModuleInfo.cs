using EU.Core.CacheManager;
using EU.Core.Enums;
using EU.Core.Utilities;
using EU.Model.System;
using Senparc.Weixin.MP.AdvancedAPIs.CustomService;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;

namespace EU.Core.Module
{
    public class ModuleInfo
    {
        private static RedisCacheService Redis = new RedisCacheService(2);

        #region 获取模块
        /// <summary>
        /// 获取模块
        /// </summary>
        /// <param name="moduleCode">模块代码</param>
        /// <returns></returns>
        public static SmModule GetModuleInfo(string moduleCode)
        {
            SmModule module = Redis.Get<SmModule>("SM_MODULE", moduleCode);
            if (module == null)
            {
                List<SmModule> moduleList = GetModuleList();
                module = moduleList.Where(x => x.ModuleCode == moduleCode).FirstOrDefault();

                Redis.Remove("SM_MODULE");
                foreach (SmModule item in moduleList)
                    Redis.AddObject("SM_MODULE", item.ModuleCode, item);

            }
            return module;
        }

        //public static SmModule GetModuleInfo(string moduleCode)
        //{
        //    List<SmModule> moduleList = GetModuleList();
        //    SmModule module = moduleList.Where(x => x.ModuleCode == moduleCode).FirstOrDefault();
        //    return module;
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static List<SmModule> GetModuleList()
        {
            var code = CacheKeys.SmModule.ToString();
            List<SmModule> moduleList = Redis.Get<List<SmModule>>(code);
            if (moduleList == null)
            {
                string sql = "SELECT A.* FROM SmModules A WHERE A.IsDeleted='false' ORDER BY A.ModuleCode ASC";
                moduleList = DBHelper.Instance.QueryList<SmModule>(sql);
                Redis.AddObject(code, moduleList);
            }
            return moduleList;
        }

        public static string GetModuleNameById(Guid? ID)
        {
            string name = string.Empty;
            List<SmModule> moduleList = GetModuleList();
            SmModule module = moduleList.Where(x => x.ID == ID).FirstOrDefault();
            if (module != null)
                name = module.ModuleName;
            return name;
        }
        #endregion

        #region 获取模块是否自动执行查询
        /// <summary>
        /// 获取模块是否自动执行查询
        /// </summary>
        /// <param name="moduleCode">模块代码</param>
        /// <returns></returns>
        public static bool GetIsExecQuery(string moduleCode)
        {
            try
            {
                bool result = false;
                SmModule Module = GetModuleInfo(moduleCode);
                if (Module != null)
                    result = Module.IsExecQuery;
                return result;
            }
            catch (Exception) { throw; }
        }
        #endregion

        /// <summary>
        /// 初始化
        /// </summary>
        public static void Init()
        {
            Redis.Remove("SM_MODULE");
            Redis.Remove("SmModule");
            GetModuleList();
            GetModuleInfo("");
        }


        public static string FormatSqlVariable(string sqlString)
        {
            try
            {
                if (sqlString.IndexOf("[CompanyId]") > -1)
                    sqlString = sqlString.Replace("[CompanyId]", Utility.GetCompanyId());

                //if (sqlString.IndexOf("[QueryGroupId]") > -1)
                //{
                //    sqlString = sqlString.Replace("[QueryGroupId]", QueryGroupId);
                //}

                if (sqlString.IndexOf("[UserId]") > -1)
                    sqlString = sqlString.Replace("[UserId]", Utility.GetUserIdString());

                //if (sqlString.IndexOf("[UserCode]") > -1)
                //{
                //    sqlString = sqlString.Replace("[UserCode]", UserCode);
                //}

                //if (sqlString.IndexOf("[Language]") > -1)
                //{
                //    sqlString = sqlString.Replace("[Language]", Resource.GetCultureInfoName());
                //}

                //if (sqlString.IndexOf("[EmployeeId]") > -1)
                //{
                //    sqlString = sqlString.Replace("[EmployeeId]", EmployeeId);
                //}

                return sqlString;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
