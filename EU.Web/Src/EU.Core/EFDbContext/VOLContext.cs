﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyModel;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using EU.Core.Configuration;
using EU.Core.DBManager;
using EU.Core.Extensions;
using EU.Core.Extensions.AutofacManager;
using EU.Entity.SystemModels;

namespace EU.Core.EFDbContext
{
    public class VOLContext : DbContext, IDependency
    {
        /// <summary>
        /// 数据库连接名称 
        /// </summary>
        public string DataBaseName = null;
        public VOLContext()
                : base()
        {
        }
        public VOLContext(string connction)
            : base()
        {
            DataBaseName = connction;
        }

        public VOLContext(DbContextOptions<VOLContext> options)
            : base(options)
        {

        }
        public override void Dispose()
        {
            base.Dispose();
        }
        public override int SaveChanges()
        {
            try
            {
                return base.SaveChanges();
            }
            catch (Exception ex)//DbUpdateException 
            {
                throw (ex.InnerException as Exception ?? ex);
            }
        }
        public override DbSet<TEntity> Set<TEntity>()
        {
            return base.Set<TEntity>();
        }
        //public DbSet<TEntity> Set<TEntity>(bool trackAll = false) where TEntity : class
        //{
        //    return base.Set<TEntity>();
        //}
        /// <summary>
        /// 设置跟踪状态
        /// </summary>
        public bool QueryTracking
        {
            set
            {
                this.ChangeTracker.QueryTrackingBehavior =
                       value ? QueryTrackingBehavior.TrackAll
                       : QueryTrackingBehavior.NoTracking;
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = DBServerProvider.GetConnectionString(null);
            if (Const.DBType.Name == Enums.DbCurrentType.MySql.ToString())
            {
                //optionsBuilder.UseMySql(connectionString);
            }
            else
            {
                optionsBuilder.UseSqlServer(connectionString);
            }
            //默认禁用实体跟踪
            optionsBuilder = optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            //var loggerFactory = new LoggerFactory();
            //loggerFactory.AddProvider(new EFLoggerProvider());
            //  optionsBuilder.UseLoggerFactory(loggerFactory);
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Type type = null;
            try
            {
                //获取所有类库
                var compilationLibrary = DependencyContext
                    .Default
                    .CompileLibraries
                    .Where(x => !x.Serviceable && x.Type != "package" && x.Type == "project");

                foreach (var _compilation in compilationLibrary)
                {
                    //加载指定类
                    AssemblyLoadContext.Default
                    .LoadFromAssemblyName(new AssemblyName(_compilation.Name))
                    .GetTypes()
                    .Where(x =>
                        x.GetTypeInfo().BaseType != null
                        && x.BaseType == (typeof(BaseEntity)))
                        .ToList().ForEach(t =>
                        {
                            modelBuilder.Entity(t);
                            //  modelBuilder.Model.AddEntityType(t);
                        });
                }
                if (AppSetting.GlobalFilter.Assemblys != null)
                {
                    if (AppSetting.GlobalFilter.Assemblys.Length > 0)
                    {
                        foreach (var _name in AppSetting.GlobalFilter.Assemblys)
                        {
                            if (!string.IsNullOrEmpty(_name))
                            {
                                try
                                {
                                    AssemblyLoadContext.Default
                                                        .LoadFromAssemblyName(new AssemblyName(_name))
                                                        .GetTypes()
                                                        .Where(x =>
                                                            x.GetTypeInfo().BaseType != null
                                                            && x.BaseType == (typeof(BaseEntity)))
                                                            .ToList().ForEach(t =>
                                                            {
                                                                modelBuilder.Entity(t);
                                                                //  modelBuilder.Model.AddEntityType(t);
                                                            });
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine(_name + ex.Message);
                                }
                            }
                        }
                    }
                }
                //modelBuilder.AddEntityConfigurationsFromAssembly(GetType().Assembly);
                base.OnModelCreating(modelBuilder);
            }
            catch (Exception ex)
            {
                string mapPath = ($"Log/").MapPath();
                Utilities.FileHelper.WriteFile(mapPath,
                    $"syslog_{DateTime.Now.ToString("yyyyMMddHHmmss")}.txt",
                    type?.Name + "--------" + ex.Message + ex.StackTrace + ex.Source);
            }

        }
    }
}
