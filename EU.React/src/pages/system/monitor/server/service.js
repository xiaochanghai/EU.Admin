import request from '@/utils/request';



export async function GetServerBase(params) {
    return request('/api/Server/GetServerBase', {
        params,
    });
}
export async function GetServerUsed(params) {
  return request('/api/Server/GetServerUsed', {
    params,
});
}
export async function Delete(params) {
    return request('/api/SmModule/Delete', {
        params
    });
}
export async function BatchDelete(params) {
    return request('/api/SmModule/BatchDelete', {
        method: 'POST',
        data: params
    });
}
//模块列
export async function queryDetail(params) {
    if (!params.parentId)
        return;
    return request('/api/SmModuleColumn/GetPageList', {
        params,
    });
}
export async function SaveAddDetailFormData(params) {
    return request('/api/SmModuleColumn/Add', {
        method: 'POST',
        data: params
    });
}
export async function SaveEditDetailFormData(params) {
    return request('/api/SmModuleColumn/Update', {
        method: 'POST',
        data: params
    });
}
export async function GetDetailById(params) {
    return request('/api/SmModuleColumn/GetById', {
        params
    });
}
export async function DeleteDetail(params) {
    return request('/api/SmModuleColumn/Delete', {
        params
    });
}
export async function BatchDetailDelete(params) {
    return request('/api/SmModuleColumn/BatchDelete', {
        method: 'POST',
        data: params
    });
}
export async function GetModuleSqlInfo(params) {
    return request('/api/SmModuleSql/GetByModuleId/' + params.moduleId, {
        method: 'POST',
        params
    });
}
export async function SaveModuleSqlAddFormData(params) {
    return request('/api/SmModuleSql/Add', {
        method: 'POST',
        data: params
    });
}
export async function SaveModuleSqlEditFormData(params) {
    return request('/api/SmModuleSql/Update', {
        method: 'POST',
        data: params
    });
}
export async function ExportModuleSqlScript(params) {
    return request('/api/SmModule/ExportModuleSqlScript', {
        method: 'POST',
        data: params
    });
}
