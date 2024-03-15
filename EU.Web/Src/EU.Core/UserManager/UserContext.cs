using EU.Core.CacheManager;
using EU.Core.DBManager;
using EU.Core.Utilities;
using EU.Model.System;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EU.Core.UserManager
{
    public class UserContext
    {
        private static RedisCacheService Redis = new RedisCacheService(4);


        /// <summary>
        /// 为了尽量减少redis或Memory读取,保证执行效率,将UserContext注入到DI，
        /// 每个UserContext的属性至多读取一次redis或Memory缓存从而提高查询效率
        /// </summary>
        public static UserContext Current
        {
            get
            {
                //try
                //{
                //    return Context.RequestServices.GetService(typeof(UserContext)) as UserContext;
                //}
                //catch (Exception)
                //{
                //    return new UserContext();
                //}
                return new UserContext();
            }
        }

        private static Microsoft.AspNetCore.Http.HttpContext Context
        {
            get
            {
                return Utilities.HttpContext.Current;
            }
        }

        /// <summary>
        /// 用户ID
        /// </summary>
        public Guid? User_Id
        {
            get
            {
                try
                {
                    //string aa = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                    string userId = Context?.User?.Identity?.Name;
                    return string.IsNullOrEmpty(userId) ? null : Guid.Parse(userId);
                }
                catch (Exception)
                {
                    return Guid.Empty; //匿名访问
                }
            }
        }

        private SmUser _userInfo { get; set; }

        public SmUser UserInfo
        {
            get
            {
                if (_userInfo != null)
                {
                    return _userInfo;
                }
                return GetUserInfo(User_Id);
            }
        }

        public SmUser GetUserInfo(Guid? userId)
        {
            if (_userInfo != null) return _userInfo;
            if (userId is null)
            {
                _userInfo = new SmUser();
                return _userInfo;
            }
            _userInfo = Redis.Get<SmUser>(userId.ToString());
            if (_userInfo == null)
            {
                string sql = "SELECT A.* FROM SmUsers A WHERE A.IsDeleted='false' AND ID='{0}'";
                sql = string.Format(sql, userId);
                _userInfo = DBHelper.Instance.QueryList<SmUser>(sql).SingleOrDefault();
                Redis.AddObject(userId.ToString(), _userInfo, new TimeSpan(0, 1, 0, 0, 0));
            }
            return _userInfo ?? new SmUser();
        }

        /// <summary>
        /// 公司ID
        /// </summary>
        public Guid? CompanyId
        {
            get { return UserInfo.CompanyId ?? Utility.GetCompanyGuidId(); }
        }

        /// <summary>
        /// 集团ID
        /// </summary>
        public Guid? GroupId
        {
            get { return UserInfo.GroupId ?? Utility.GetGroupGuidId(); }
        }
    }
}
