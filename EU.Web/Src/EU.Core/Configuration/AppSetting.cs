using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.IO;
using EU.Core.Const;
using EU.Core.Extensions;
using EU.Core.Utilities;
using System;
using System.Linq;
using System.Collections.Generic;
using EU.Core.Enums;
using NPOI.SS.Formula.Functions;
using System.Data.SqlClient;
using Util.Helpers;
using EU.Core.LogHelper;
using System.Data;

namespace EU.Core.Configuration
{
    public static class AppSetting
    {
        public static IConfiguration Configuration { get; private set; }

        public static string DbConnectionString
        {
            get { return _connection.DbConnectionString; }
        }
        public static string DBType
        {
            get { return _connection.DBType; }
        }

        public static string RedisConnectionString
        {
            get { return _connection.RedisConnectionString; }
        }

        public static string RedisKeyPrefix
        {
            get { return _connection.RedisKeyPrefix; }
        }

        public static bool UseRedis
        {
            get { return _connection.UseRedis; }
        }

        public static RabbitMQConfiguration RabbitMQConfiguration
        {
            get { return _RabbitMQConfiguration; }
        }

        public static Secret Secret { get; private set; }

        public static CreateMember CreateMember { get; private set; }

        public static ModifyMember ModifyMember { get; private set; }

        private static ConnectionStrings _connection;

        private static RabbitMQConfiguration _RabbitMQConfiguration;

        public static string TokenHeaderName = "Authorization";

        /// <summary>
        /// Actions权限过滤
        /// </summary>
        public static GlobalFilter GlobalFilter { get; set; }


        /// <summary>
        /// JWT有效期(分钟=默认120)
        /// </summary>
        public static int ExpMinutes { get; private set; } = 120;

        public static string CurrentPath { get; private set; } = null;
        public static string DownLoadPath { get { return CurrentPath + "\\Download\\"; } }
        public static string LogPath { get { return CurrentPath + "\\Log\\"; } }

        public static void Init(IServiceCollection services, IConfiguration configuration)
        {
            Configuration = configuration;
            services.Configure<Secret>(configuration.GetSection("Secret"));
            services.Configure<ConnectionStrings>(configuration.GetSection("ConnectionStrings"));
            services.Configure<CreateMember>(configuration.GetSection("CreateMember"));
            services.Configure<ModifyMember>(configuration.GetSection("ModifyMember"));
            services.Configure<GlobalFilter>(configuration.GetSection("GlobalFilter"));
            services.Configure<RabbitMQConfiguration>(configuration.GetSection("RabbitMQConfiguration"));

            var baseDirectory = AppContext.BaseDirectory;
            var provider = services.BuildServiceProvider();
            //IWebHostEnvironment environment = provider.GetRequiredService<IWebHostEnvironment>();
            CurrentPath = Path.Combine(baseDirectory, "").ReplacePath();

            Secret = provider.GetRequiredService<IOptions<Secret>>().Value;

            //设置修改或删除时需要设置为默认用户信息的字段
            CreateMember = provider.GetRequiredService<IOptions<CreateMember>>().Value ?? new CreateMember();
            ModifyMember = provider.GetRequiredService<IOptions<ModifyMember>>().Value ?? new ModifyMember();

            GlobalFilter = provider.GetRequiredService<IOptions<GlobalFilter>>().Value ?? new GlobalFilter();

            GlobalFilter.Actions = GlobalFilter.Actions ?? new string[0];
            ExpMinutes = (configuration["ExpMinutes"] ?? "120").GetInt();

            #region 初始化数据库
            _connection = provider.GetRequiredService<IOptions<ConnectionStrings>>().Value;
            Const.DBType.Name = _connection.DBType;
            if (string.IsNullOrEmpty(_connection.DbConnectionString))
                throw new System.Exception("未配置好数据库默认连接");

            try
            {
                _connection.DbConnectionString = _connection.DbConnectionString.DecryptDES(Secret.DB);
            }
            catch { }

            #region 检查服务是否可用 

            //bool mysql = Const.DBType.Name == DbCurrentType.MySql.ToString();
            //if (mysql)
            //{

            //}
            bool mssql = Const.DBType.Name == DbCurrentType.MsSql.ToString();

            if (mssql)
            {
                using var conn = new SqlConnection(_connection.DbConnectionString);
                while (true)
                {

                    if (Utility.IsPortOpen(conn.DataSource, 1433))
                    {
                        Logger.WriteLog("[数据库] 服务状态正常");
                        break;
                    }
                    else
                    {
                        Logger.WriteLog("[数据库] 服务状态异常, 稍后重试");
                        System.Threading.Thread.Sleep(5000);
                    }

                    //conn.Open();
                    //if (conn.State == ConnectionState.Open)
                    //{
                    //    conn.Close();
                    //    Logger.WriteLog("[数据库] 服务状态正常");
                    //    break;
                    //}
                    //else
                    //{
                    //    Logger.WriteLog("[数据库] 服务状态异常, 等待 5 秒后重试");
                    //    System.Threading.Thread.Sleep(5000);
                    //}
                }
            }
            #endregion


            if (!string.IsNullOrEmpty(_connection.RedisConnectionString))
            {
                try
                {
                    _connection.RedisConnectionString = _connection.RedisConnectionString.DecryptDES(Secret.Redis);
                }
                catch { }
            }



            #endregion

            #region 初始化RabbitMQ
            _RabbitMQConfiguration = provider.GetRequiredService<IOptions<RabbitMQConfiguration>>().Value;

            //if (Utility.IsPortOpen(_RabbitMQConfiguration.HostName, (_RabbitMQConfiguration.Port)))
            //{

            //}
            //else
            //{

            //}
            #endregion


        }
        // 多个节点name格式 ：["key:key1"]
        public static string GetSettingString(string key)
        {
            return Configuration[key];
        }
        // 多个节点,通过.GetSection("key")["key1"]获取
        public static IConfigurationSection GetSection(string key)
        {
            return Configuration.GetSection(key);
        }

        /// <summary>
        /// 封装要操作的字符
        /// </summary>
        /// <param name="sections">节点配置</param>
        /// <returns></returns>
        public static string app(params string[] sections)
        {
            try
            {

                if (sections.Any())
                {
                    return Configuration[string.Join(":", sections)];
                }
            }
            catch (Exception) { }

            return "";
        }

        /// <summary>
        /// 递归获取配置信息数组
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sections"></param>
        /// <returns></returns>
        public static List<T> app<T>(params string[] sections)
        {
            List<T> list = new List<T>();
            // 引用 Microsoft.Extensions.Configuration.Binder 包
            Configuration.Bind(string.Join(":", sections), list);
            return list;
        }
    }


    #region 数据库链接
    /// <summary>
    /// 数据库链接
    /// </summary>
    public class ConnectionStrings
    {
        /// <summary>
        /// 数据库类型
        /// </summary>
        public string DBType { get; set; }

        /// <summary>
        /// 数据库链接字符串
        /// </summary>
        public string DbConnectionString { get; set; }

        /// <summary>
        /// Redis键值前缀
        /// </summary>
        public string RedisKeyPrefix { get; set; }

        /// <summary>
        /// Redis链接地址
        /// </summary>
        public string RedisConnectionString { get; set; }

        /// <summary>
        /// 是否使用redis
        /// </summary>
        public bool UseRedis { get; set; }
    }
    #endregion

    public class CreateMember : TableDefaultColumns
    {
    }
    public class ModifyMember : TableDefaultColumns
    {
    }

    public abstract class TableDefaultColumns
    {
        public string UserIdField { get; set; }
        public string UserNameField { get; set; }
        public string DateField { get; set; }
    }
    public class GlobalFilter
    {
        public string Message { get; set; }
        public bool Enable { get; set; }
        public string[] Actions { get; set; }

        public string[] Assemblys { get; set; }
    }

    public class RabbitMQConfiguration
    {
        public string HostName { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        /// <summary>
        /// 默认最大保持可用连接数
        /// </summary>
        public int MaxConnectionCount { get; set; }

        /// <summary>
        /// 默认最大连接可访问次数
        /// </summary>
        public int MaxConnectionUsingCount { get; set; }
    }
}
