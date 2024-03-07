//using EU.Core;
//using EU.Core.Const;
//using EU.Core.LogHelper;
using System;
using System.ComponentModel.Design;
using System.Data;
using System.IO;
using System.Linq;
using EU.Core;
using EU.Core.Configuration;
using EU.Core.Const;
using EU.Core.LogHelper;
using EU.Core.Utilities;
using EU.TaskHelper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.DependencyInjection;

namespace EU.Web.BackgroundJobs
{
    /// <summary>
    /// 任务处理中心
    /// </summary>
    public class TaskCenter
    {
        private readonly ISchedulerCenter _schedulerCenter;

        public static IConfiguration Configuration { get; set; }
        static TaskCenter()
        {
            //ReloadOnChange = true 当appsettings.json被修改时重新加载

        }

        /// <summary>
        /// 初始化
        /// </summary>
        public TaskCenter(ISchedulerCenter schedulerCenter)
        {
            _schedulerCenter = schedulerCenter;
            Configuration = new ConfigurationBuilder()
           .Add(new JsonConfigurationSource { Path = "appsettings.json", ReloadOnChange = true })
           .Build();
        }

        #region 启动任务服务
        /// <summary>
        /// 启动任务服务
        /// </summary>
        public void Start()
        {
            var container = new ServiceCollection();

            AppSetting.Init(container, Configuration);

            _schedulerCenter.InitJobAsync();
            Logger.WriteLog("[Task]启动消息订阅");
            RabbitMQHelper.ConsumeMsg<TaskMsg>(RabbitMQConsts.CLIENT_ID_TASK_JOB, msg =>
            {
                Logger.WriteLog($"[Task] {RabbitMQConsts.CLIENT_ID_TASK_JOB} msg:{msg}");
                System.Threading.ThreadPool.QueueUserWorkItem(TaskHelper.TaskHelper.TaskHandleAsync, msg);
                return ConsumeAction.Accept;
            });
            RabbitMQHelper.ConsumeMsg<TaskMonitor>(RabbitMQConsts.CLIENT_ID_TASK_MONITOR, msg =>
            {
                Logger.WriteLog($"[Task] {RabbitMQConsts.CLIENT_ID_TASK_MONITOR} msg:{msg}");
                return ConsumeAction.Accept;
            });
        }

        #endregion

    }
    public class TaskMonitor
    {
        /// <summary>
        /// 消息ID，用于回传消息
        /// </summary>
        public Guid MsgId { get; set; }


        public string RCP_CHANGE_TIME { get; set; }
        public string RCP_NAME { get; set; }
        public string CRYSTAL_FURNACE_NUM { get; set; }
        public float[] Monitor { get; set; } = new float[100];

        ///// <summary>
        ///// 重写ToString()
        ///// </summary>
        ///// <returns></returns>
        //public override string ToString()
        //{
        //    return $"\r\n消息ID {MsgId}\r\n任务ID {TaskId}\r\n任务类型 {TaskType}\r\n任务编码 {TaskCode}\r\n操作类型 {Oprate}\r\n操作参数 {Args}\r\n内容 {Content}";
        //}
    }
}
