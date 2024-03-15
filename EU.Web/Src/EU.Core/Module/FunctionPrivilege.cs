using EU.Core.CacheManager;
using EU.Core.Enums;
using EU.Core.Utilities;
using EU.Model.System.Privilege;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EU.Core.Module
{
    public class FunctionPrivilege
    {
        private static RedisCacheService Redis = new RedisCacheService(2);

        #region 获取模块
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static List<SmFunctionPrivilege> GetList(string ModuleId)
        {
            List<SmFunctionPrivilege> moduleList = Redis.Get<List<SmFunctionPrivilege>>(CacheKeys.SmFunctionPrivilege.ToString(), ModuleId);
            if (moduleList == null)
            {
                string sql = "SELECT A.* FROM SmFunctionPrivilege A WHERE A.SmModuleId='{0}' AND IsDeleted='false'";
                sql = string.Format(sql, ModuleId);
                moduleList = DBHelper.Instance.QueryList<SmFunctionPrivilege>(sql);
                Redis.AddObject(CacheKeys.SmFunctionPrivilege.ToString(), ModuleId, moduleList);
            }
            return moduleList;
        }
        #endregion

        /// <summary>
        /// 初始化
        /// </summary>
        public static void Init()
        {
            Redis.Remove(CacheKeys.SmFunctionPrivilege.ToString());
        }
    }
}
