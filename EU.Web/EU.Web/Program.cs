using System;
using Autofac.Extensions.DependencyInjection;
using EU.Web;
using EU.DataAccess;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using EU.Core.DBManager;

var app = CreateHostBuilder(args).Build();
var builder = WebApplication.CreateBuilder(args);

// ≈‰÷√÷–º‰º˛
var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
try
{
    var dbContext = scope.ServiceProvider.GetService<DataContext>();

    dbContext.Database.EnsureCreated();
    dbContext.Database.Migrate();
}
catch (Exception e)
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    logger.LogError(e, "Database Migration Error!");
}
builder.Services.AddSqlsugarSetup();
builder.Services.AddDbSetup();
/// <summary>
/// CreateHostBuilder
/// </summary>
/// <param name="args"></param>
/// <returns></returns>
static IHostBuilder CreateHostBuilder(string[] args) =>
  Host.CreateDefaultBuilder(args)
      .UseServiceProviderFactory(new AutofacServiceProviderFactory())
      .ConfigureWebHostDefaults(webBuilder =>
      {
          webBuilder.UseStartup<Startup>();
      });
app.Run();
