﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;

/// <summary>
/// 统一异常处理和返回
/// </summary>
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        this.next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            var statusCode = context.Response.StatusCode;
            if (ex is ArgumentException)
            {
                statusCode = 200;
            }
            await HandleExceptionAsync(context, statusCode, ex.Message);
        }
        finally
        {
            var statusCode = context.Response.StatusCode;
            var msg = "";
            if (statusCode == 401)
            {
                msg = "未授权";
            }
            else if (statusCode == 404)
            {
                msg = "未找到服务";
            }
            else if (statusCode == 502)
            {
                msg = "请求错误";
            }
            else if (statusCode != 200)
            {
                msg = "未知错误";
            }
            if (!string.IsNullOrWhiteSpace(msg))
            {
                await HandleExceptionAsync(context, statusCode, msg);
            }
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, int statusCode, string msg)
    {
        var data = new { code = statusCode.ToString(), is_success = false, msg = msg };
        var result = JsonConvert.SerializeObject(new { data = data });
        context.Response.ContentType = "application/json;charset=utf-8";
        return context.Response.WriteAsync(result);
    }
}

public static class ErrorHandlingExtensions
{
    public static IApplicationBuilder UseErrorHandling(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ErrorHandlingMiddleware>();
    }
}
