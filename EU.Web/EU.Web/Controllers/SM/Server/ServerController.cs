﻿using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Net.Mail;
using System.Runtime.InteropServices;
using EU.Core.Extensions;
using EU.Core.Utilities;
using EU.DataAccess;
using EU.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NetTaste;
using static EU.Core.Const.Consts;

namespace EU.Web.Controllers.System;

/// <summary>
/// 系统服务器监控服务
/// </summary>
//[ApiController, Authorize(Policy = "Permission"), Route("api/[controller]/[action]"), GlobalActionFilter, ApiExplorerSettings(GroupName = Grouping.System)]
[GlobalActionFilter, ApiExplorerSettings(GroupName = Grouping.SM)]
public class ServerController : BaseController1<Model.SmApiLog>
{
    private readonly IWebHostEnvironment _hostingEnvironment;
    public ServerController(DataContext _context, IWebHostEnvironment env, IBaseCRUDVM<Model.SmApiLog> BaseCrud) : base(_context, BaseCrud)
    {
        _hostingEnvironment = env;
    }

    /// <summary>
    /// 获取服务器配置信息
    /// </summary>
    /// <param name="module"></param>
    /// <returns></returns>
    [HttpGet, AllowAnonymous]
    public dynamic GetServerBase()
    {
        dynamic obj = new
        {
            HostName = Environment.MachineName, // 主机名称
            SystemOs = ComputerHelper.GetOSInfo(),//RuntimeInformation.OSDescription, // 操作系统
            OsArchitecture = Environment.OSVersion.Platform.ToString() + " " + RuntimeInformation.OSArchitecture.ToString(), // 系统架构
            ProcessorCount = Environment.ProcessorCount + " 核", // CPU核心数
            SysRunTime = ComputerHelper.GetRunTime(), // 系统运行时间
            RemoteIp = ComputerHelper.GetIpFromOnline(), // 外网地址
            LocalIp = HttpContextExtension.GetUserIp(Core.Utilities.HttpContext.Current), // 本地地址
            RuntimeInformation.FrameworkDescription, // NET框架
            Environment = _hostingEnvironment.IsDevelopment() ? "Development" : "Production",
            Wwwroot = _hostingEnvironment.WebRootPath, // 网站根目录
            Stage = _hostingEnvironment.IsStaging() ? "Stage环境" : "非Stage环境", // 是否Stage环境
        };

        return obj;
    }


    /// <summary>
    /// 获取服务器使用信息
    /// </summary>
    /// <returns></returns>
    [DisplayName("获取服务器使用信息")]
    public dynamic GetServerUsed()
    {
        var programStartTime = Process.GetCurrentProcess().StartTime;
        var totalMilliseconds = (DateTime.Now - programStartTime).TotalMilliseconds.ToString();
        var ts = totalMilliseconds.Contains('.') ? totalMilliseconds.Split('.')[0] : totalMilliseconds;
        var programRunTime = DateTimeHelper.FormatTime(ts.ParseToLong());

        var memoryMetrics = ComputerHelper.GetComputerInfo();
        return new
        {
            memoryMetrics.FreeRam, // 空闲内存
            memoryMetrics.UsedRam, // 已用内存
            memoryMetrics.TotalRam, // 总内存
            memoryMetrics.RamRate, // 内存使用率
            memoryMetrics.CpuRate, // Cpu使用率
            StartTime = programStartTime.ToString("yyyy-MM-dd HH:mm:ss"), // 服务启动时间
            RunTime = programRunTime, // 服务运行时间
        };
    }

    /// <summary>
    /// 获取服务器磁盘信息
    /// </summary>
    /// <returns></returns>
    [DisplayName("获取服务器磁盘信息")]
    public dynamic GetServerDisk()
    {
        return ComputerHelper.GetDiskInfos();
    }

    /// <summary>
    /// 获取框架主要程序集
    /// </summary>
    /// <returns></returns>
    [DisplayName("获取框架主要程序集")]
    public dynamic GetAssemblyList()
    {
        //var furionAssembly = typeof(App).Assembly.GetName();
        //var sqlSugarAssembly = typeof(ISqlSugarClient).Assembly.GetName();
        //var yitIdAssembly = typeof(YitIdHelper).Assembly.GetName();
        //var redisAssembly = typeof(Redis).Assembly.GetName();
        var jsonAssembly = typeof(NewtonsoftJsonMvcCoreBuilderExtensions).Assembly.GetName();
        //var excelAssembly = typeof(IExcelImporter).Assembly.GetName();
        //var pdfAssembly = typeof(IPdfExporter).Assembly.GetName();
        //var captchaAssembly = typeof(ICaptcha).Assembly.GetName();
        //var wechatApiAssembly = typeof(WechatApiClient).Assembly.GetName();
        //var wechatTenpayAssembly = typeof(WechatTenpayClient).Assembly.GetName();
        //var ossAssembly = typeof(IOSSServiceFactory).Assembly.GetName();
        var parserAssembly = typeof(Parser).Assembly.GetName();
        //var nestAssembly = typeof(IElasticClient).Assembly.GetName();
        //var limitAssembly = typeof(IpRateLimitMiddleware).Assembly.GetName();
        //var htmlParserAssembly = typeof(HtmlParser).Assembly.GetName();
        var fluentEmailAssembly = typeof(SmtpClient).Assembly.GetName();

        return new[]
        {
            //new { furionAssembly.Name, furionAssembly.Version },
            //new { sqlSugarAssembly.Name, sqlSugarAssembly.Version },
            //new { yitIdAssembly.Name, yitIdAssembly.Version },
            //new { redisAssembly.Name, redisAssembly.Version },
            new { jsonAssembly.Name, jsonAssembly.Version },
            //new { excelAssembly.Name, excelAssembly.Version },
            //new { pdfAssembly.Name, pdfAssembly.Version },
            //new { captchaAssembly.Name, captchaAssembly.Version },
            //new { wechatApiAssembly.Name, wechatApiAssembly.Version },
            //new { wechatTenpayAssembly.Name, wechatTenpayAssembly.Version },
            //new { ossAssembly.Name, ossAssembly.Version },
            new { parserAssembly.Name, parserAssembly.Version },
            //new { nestAssembly.Name, nestAssembly.Version },
            //new { limitAssembly.Name, limitAssembly.Version },
            //new { htmlParserAssembly.Name, htmlParserAssembly.Version },
            new { fluentEmailAssembly.Name, fluentEmailAssembly.Version },
        };
    }
}