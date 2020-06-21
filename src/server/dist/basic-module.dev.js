"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateUpInstitutionsBasicInfo = exports.GetInstitutionsBasicInfo = exports.getBuildingsPullDown = exports.getSemesterSpinnerData = exports.getAcademicYearSpinnerData = exports.ClearTimeTable = exports.getDailySchedule = exports.updateDailySchedule = exports.createDailySchedule = exports.getDefaultSemester = exports.updateTeachCalendar = exports.createTeachCalendar = exports.getTeachCalendar = exports.updateAcademicYearStatus = exports.deleteAcademicYear = exports.updateAcademicYear = exports.createAcademicYear = exports.getAcademicYearList = exports.updateDefaultSemesterStatus = exports.updateSemesterStatus = exports.deleteSemester = exports.updateSemester = exports.createSemester = exports.getSemesterList = exports.updateBuildingStatus = exports.updateBuilding = exports.getBuildingById = exports.deleteBuilding = exports.getBuildingList = exports.createBuilding = exports.getSiteDropdown = exports.getSiteListByBuilding = exports.updateSiteStatus = exports.updateSite = exports.getSiteById = exports.deleteSite = exports.getSiteList = exports.createSite = exports.updateCourseStatus = exports.updateCourseToMajor = exports.createCourse = exports.getCourseList = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.MajorUnBindWarehouse = exports.MajorBindWarehouse = exports.getMajorWarehouseList = exports.updateMajorStatus = exports.createMajor = exports.getMajorList = exports.deleteMajor = exports.updateMajor = exports.getMajorById = exports.updateInstitutionStatus = exports.getInstitutionById = exports.deleteInstitutionById = exports.updateInstitution = exports.createInstitution = exports.getInstitutionListByCampusId = exports.getInstitutionList = exports.updateCampusStatus = exports.deleteCampusById = exports.updateCampus = exports.createCampus = exports.getCampusList = exports.getCampusById = exports.updateSchool = exports.createSchool = exports.getSchoolList = exports.getSchoolById = exports.updateEnterpriseEnable = exports.updateEnterprise = exports.createEnterprise = exports.getEnterpriseList = exports.getEnterpriseById = exports.getKnowledgeTree = exports.getSectionTree = exports.getChapterTree = exports.getCourseTree = exports.getMajorTree = exports.getMajorCourseTree = exports.getBuildingTree = exports.getGradeTree = exports.getTrainingProgramsByAuditTree = exports.getTrainingProgramsTree = exports.getWarehouseTree = exports.getEnterpriseTree = exports.getSchoolTree = exports.getDictionaryItemsInfo = exports.getDictionaryItems = exports.updateDictionaryItemStatus = exports.deleteDictionaryById = exports.updateDictionaryById = exports.createDictionaryById = exports.getDictionaryById = exports.deleteDictionary = exports.updateDictionary = exports.createDictionary = exports.getDictionary = void 0;
exports.UpdateSupportingMaterials = exports.GetGovernmentInformation = exports.UpdateSort = exports.UpdateStatus = exports.SubmitReview = exports.GetSupportingMaterialsAuditInfo = exports.DeleteSupportingMaterials = exports.UpdateCertificate = exports.CreateSupportingMaterials = exports.GetSupportingMaterialsPageList = exports.DeleteCertificatesGrant = exports.UpdateCertificatesGrantStatus = exports.GetCertificateInfo = exports.UpCertificateStatus = exports.GetCertificateCoreLatest = exports.GetCertificateList = exports.CreateCertificatesGrant = exports.GetGraduationStudentInfo = exports.ApproveCertificate = exports.StudentCertificate = exports.GraduationRequirementsList = exports.DeleteCertificate = exports.SetBackgroundImg = exports.GetCertificate = exports.CreateCertificate = exports.GetCertificatePageList = void 0;

var _http = _interopRequireDefault(require("./http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* ----------------------------- 数据字典 -------------------------- */
// 分页查询，可根据字典名称或code查询
var getDictionary = function getDictionary(data) {
  return (0, _http["default"])('/Api/Dictionary', data);
}; // 创建字典


exports.getDictionary = getDictionary;

var createDictionary = function createDictionary(data) {
  return (0, _http["default"])('/Api/Dictionary', data, 'POST');
}; // 修改字典


exports.createDictionary = createDictionary;

var updateDictionary = function updateDictionary(data) {
  return (0, _http["default"])('/Api/Dictionary?id=' + data.id, data, 'PUT');
}; // 删除字典


exports.updateDictionary = updateDictionary;

var deleteDictionary = function deleteDictionary(data) {
  return (0, _http["default"])('/Api/Dictionary', data, 'DELETE');
}; // 字典详情查询,通过字典id查询字典项列表


exports.deleteDictionary = deleteDictionary;

var getDictionaryById = function getDictionaryById(id) {
  return (0, _http["default"])('/Api/Dictionary/' + id, {});
}; // 创建字典项


exports.getDictionaryById = getDictionaryById;

var createDictionaryById = function createDictionaryById(data) {
  return (0, _http["default"])('/Api/Dictionary/' + data.id, data, 'POST');
}; // 修改字典项


exports.createDictionaryById = createDictionaryById;

var updateDictionaryById = function updateDictionaryById(id, data) {
  return (0, _http["default"])('/Api/Dictionary/' + id, data, 'PUT');
}; // 删除字典


exports.updateDictionaryById = updateDictionaryById;

var deleteDictionaryById = function deleteDictionaryById(id, entryId) {
  return (0, _http["default"])('/Api/Dictionary/' + id + '?entryId=' + entryId, {}, 'DELETE');
}; // 设置数据字典项目状态


exports.deleteDictionaryById = deleteDictionaryById;

var updateDictionaryItemStatus = function updateDictionaryItemStatus(id, entryId, status) {
  return (0, _http["default"])('/Api/Dictionary/Status?id=' + id + '&entryId=' + entryId + '&status=' + status, {}, 'PUT');
}; // 根据字典代码查询字典项下拉


exports.updateDictionaryItemStatus = updateDictionaryItemStatus;

var getDictionaryItems = function getDictionaryItems(code) {
  return (0, _http["default"])('/Api/Dictionary/PullDown?code=' + code, {});
}; // 根据字典代码和字典项代码查询 字典项详细信息


exports.getDictionaryItems = getDictionaryItems;

var getDictionaryItemsInfo = function getDictionaryItemsInfo(dictionaryCode, entryCode) {
  return (0, _http["default"])('/Api/Dictionary/Entry?dictionaryCode=' + dictionaryCode + '&entryCode=' + entryCode, {});
};
/* ----------------------------- 基础数据---树结构 -------------------------- */
// 获取学校信息树形数据


exports.getDictionaryItemsInfo = getDictionaryItemsInfo;

var getSchoolTree = function getSchoolTree(data) {
  return (0, _http["default"])('/Api/TreeData/School', data);
}; // 获取企业信息树形数据


exports.getSchoolTree = getSchoolTree;

var getEnterpriseTree = function getEnterpriseTree(data) {
  return (0, _http["default"])('/Api/TreeData/Enterprise', data);
}; // 获取资源库树形数据


exports.getEnterpriseTree = getEnterpriseTree;

var getWarehouseTree = function getWarehouseTree(data) {
  return (0, _http["default"])('/Api/TreeData/Warehouse', data);
}; // 获取学习项目树形数据


exports.getWarehouseTree = getWarehouseTree;

var getTrainingProgramsTree = function getTrainingProgramsTree(data) {
  return (0, _http["default"])('/Api/TreeData/TrainingPrograms', data);
}; // 获取培训项目树形，报名审核


exports.getTrainingProgramsTree = getTrainingProgramsTree;

var getTrainingProgramsByAuditTree = function getTrainingProgramsByAuditTree() {
  return (0, _http["default"])('/Api/TreeData/TrainingProgramsByAudit', {});
}; // 获取培训班级树形数据---学生档案模块   {status: '1,4'}查询状态码为1和4的数据，不传参表示查询所有


exports.getTrainingProgramsByAuditTree = getTrainingProgramsByAuditTree;

var getGradeTree = function getGradeTree(data) {
  return (0, _http["default"])('/Api/TreeData/Grade', data);
}; // 获取楼栋树形数据


exports.getGradeTree = getGradeTree;

var getBuildingTree = function getBuildingTree(data) {
  return (0, _http["default"])('/Api/TreeData/Building', data);
}; // 获取专业课程树形数据


exports.getBuildingTree = getBuildingTree;

var getMajorCourseTree = function getMajorCourseTree(data) {
  return (0, _http["default"])('/Api/TreeData/MajorCourse', data);
}; // 获取专业树形数据


exports.getMajorCourseTree = getMajorCourseTree;

var getMajorTree = function getMajorTree(data) {
  return (0, _http["default"])('/Api/TreeData/Major', data);
}; // --------懒加载--课程知识点树----------------
// 获取课程列表树形数据


exports.getMajorTree = getMajorTree;

var getCourseTree = function getCourseTree(data) {
  return (0, _http["default"])('/Api/TreeData/Course', data);
}; // 获取章列表树形数据


exports.getCourseTree = getCourseTree;

var getChapterTree = function getChapterTree(data) {
  return (0, _http["default"])('/Api/TreeData/Chapter', data);
}; // 获取节列表树形数据


exports.getChapterTree = getChapterTree;

var getSectionTree = function getSectionTree(data) {
  return (0, _http["default"])('/Api/TreeData/Section', data);
}; // 获取知识点列表树形数据


exports.getSectionTree = getSectionTree;

var getKnowledgeTree = function getKnowledgeTree(data) {
  return (0, _http["default"])('/Api/TreeData/KnowledgePoint', data);
};
/* ------------------------------ 基础数据-企业------------------------------------- */
// 根据id获取企业信息详情


exports.getKnowledgeTree = getKnowledgeTree;

var getEnterpriseById = function getEnterpriseById(id) {
  return (0, _http["default"])('/Api/Enterprise/' + id, {});
}; // 获取企业信息列表


exports.getEnterpriseById = getEnterpriseById;

var getEnterpriseList = function getEnterpriseList(data) {
  return (0, _http["default"])('/Api/Enterprise', data);
}; // 创建新的企业


exports.getEnterpriseList = getEnterpriseList;

var createEnterprise = function createEnterprise(data) {
  return (0, _http["default"])('/Api/Enterprise', data, 'POST');
}; // 更新企业信息


exports.createEnterprise = createEnterprise;

var updateEnterprise = function updateEnterprise(data) {
  return (0, _http["default"])('/Api/Enterprise/?id=' + data.id, data, 'PUT');
}; // 设置企业启用状态


exports.updateEnterprise = updateEnterprise;

var updateEnterpriseEnable = function updateEnterpriseEnable(data) {
  return (0, _http["default"])('/Api/Enterprise/Enable/?id=' + data.id + '&enable=' + data.enable, data, 'PUT');
};
/* ------------------------------ 基础数据-学校------------------------------------- */
// 获取学校信息


exports.updateEnterpriseEnable = updateEnterpriseEnable;

var getSchoolById = function getSchoolById(id) {
  return (0, _http["default"])('/Api/School/' + id, {});
}; // 获取学校信息列表


exports.getSchoolById = getSchoolById;

var getSchoolList = function getSchoolList(data) {
  return (0, _http["default"])('/Api/School', data);
}; // 创建新的学校


exports.getSchoolList = getSchoolList;

var createSchool = function createSchool(data) {
  return (0, _http["default"])('/Api/School', data, 'POST');
}; // 更新学校信息


exports.createSchool = createSchool;

var updateSchool = function updateSchool(data) {
  return (0, _http["default"])('/Api/School/?id=' + data.id, data, 'PUT');
};
/* ------------------------------ 基础数据-校区------------------------------------- */
// 获取校区信息详情


exports.updateSchool = updateSchool;

var getCampusById = function getCampusById(id) {
  return (0, _http["default"])('/Api/Campus/' + id, {});
}; // 获取校区信息列表


exports.getCampusById = getCampusById;

var getCampusList = function getCampusList(data) {
  return (0, _http["default"])('/Api/Campus', data);
}; // 创建新的校区


exports.getCampusList = getCampusList;

var createCampus = function createCampus(data) {
  return (0, _http["default"])('/Api/Campus', data, 'POST');
}; // 更新校区信息


exports.createCampus = createCampus;

var updateCampus = function updateCampus(data) {
  return (0, _http["default"])('/Api/Campus/?id=' + data.id, data, 'PUT');
}; // 删除校区信息


exports.updateCampus = updateCampus;

var deleteCampusById = function deleteCampusById(data) {
  return (0, _http["default"])('/Api/Campus?id=' + data.id, data, 'DELETE');
}; // 启用/停用 校区


exports.deleteCampusById = deleteCampusById;

var updateCampusStatus = function updateCampusStatus(data) {
  return (0, _http["default"])('/Api/Campus/SetUsageStatus?id=' + data.id + '&enable=' + data.enable, data, 'PUT');
};
/* ------------------------------ 基础数据-机构------------------------------------- */
// 根据上级机构id查机构列表


exports.updateCampusStatus = updateCampusStatus;

var getInstitutionList = function getInstitutionList(data) {
  return (0, _http["default"])('/Api/Institution', data);
}; // 根据校区id查机构列表


exports.getInstitutionList = getInstitutionList;

var getInstitutionListByCampusId = function getInstitutionListByCampusId(data) {
  return (0, _http["default"])('/Api/Institution/ByCampusId', data);
}; // 创建机构


exports.getInstitutionListByCampusId = getInstitutionListByCampusId;

var createInstitution = function createInstitution(data) {
  return (0, _http["default"])('/Api/Institution', data, 'POST');
}; // 修改场地


exports.createInstitution = createInstitution;

var updateInstitution = function updateInstitution(data) {
  return (0, _http["default"])('/Api/Institution/?id=' + data.id, data, 'PUT');
}; // 删除场地


exports.updateInstitution = updateInstitution;

var deleteInstitutionById = function deleteInstitutionById(data) {
  return (0, _http["default"])('/Api/Institution?id=' + data.id, data, 'DELETE');
}; // 机构详情查询


exports.deleteInstitutionById = deleteInstitutionById;

var getInstitutionById = function getInstitutionById(id) {
  return (0, _http["default"])('/Api/Institution/' + id, {});
}; // 设置机构状态


exports.getInstitutionById = getInstitutionById;

var updateInstitutionStatus = function updateInstitutionStatus(data) {
  return (0, _http["default"])('/Api/Institution/Status?id=' + data.id + '&status=' + data.status, data, 'PUT');
};
/* ------------------------------ 基础数据-专业信息------------------------------------- */
// 获取专业信息详情


exports.updateInstitutionStatus = updateInstitutionStatus;

var getMajorById = function getMajorById(id) {
  return (0, _http["default"])('/Api/Major/' + id, {});
}; // 更新专业信息


exports.getMajorById = getMajorById;

var updateMajor = function updateMajor(data) {
  return (0, _http["default"])('/Api/Major/' + data.id, data, 'PUT');
}; // 删除专业信息


exports.updateMajor = updateMajor;

var deleteMajor = function deleteMajor(data) {
  return (0, _http["default"])('/Api/Major/' + data.id, data, 'DELETE');
}; // 获取专业信息列表


exports.deleteMajor = deleteMajor;

var getMajorList = function getMajorList(data) {
  return (0, _http["default"])('/Api/Major', data);
}; // 创建新的专业


exports.getMajorList = getMajorList;

var createMajor = function createMajor(data) {
  return (0, _http["default"])('/Api/Major', data, 'POST');
}; // 启用/停用 专业


exports.createMajor = createMajor;

var updateMajorStatus = function updateMajorStatus(data) {
  return (0, _http["default"])('/Api/Major/Enable?id=' + data.id + '&enable=' + data.enable, data, 'PUT');
}; // 获得已绑定的资源库列表


exports.updateMajorStatus = updateMajorStatus;

var getMajorWarehouseList = function getMajorWarehouseList(id) {
  return (0, _http["default"])('/Api/Major/WarehouseList?id=' + id, {});
}; // 为专业绑定资源库


exports.getMajorWarehouseList = getMajorWarehouseList;

var MajorBindWarehouse = function MajorBindWarehouse(data) {
  return (0, _http["default"])('/Api/Major/BindWarehouse?id=' + data.id + '&warehouseId=' + data.warehouseId, data, 'PUT');
}; // 为专业解绑资源库


exports.MajorBindWarehouse = MajorBindWarehouse;

var MajorUnBindWarehouse = function MajorUnBindWarehouse(data) {
  return (0, _http["default"])('/Api/Major/UnBindWarehouse?id=' + data.id + '&warehouseId=' + data.warehouseId, data, 'PUT');
};
/* ------------------------------ 基础数据-课程信息------------------------------------- */
// 获取课程信息详情


exports.MajorUnBindWarehouse = MajorUnBindWarehouse;

var getCourseById = function getCourseById(id) {
  return (0, _http["default"])('/Api/Course/' + id, {});
}; // 更新课程信息


exports.getCourseById = getCourseById;

var updateCourse = function updateCourse(data) {
  return (0, _http["default"])('/Api/Course/' + data.id, data, 'PUT');
}; // 删除课程信息


exports.updateCourse = updateCourse;

var deleteCourse = function deleteCourse(data) {
  return (0, _http["default"])('/Api/Course/' + data.id, data, 'DELETE');
}; // 获取课程信息列表


exports.deleteCourse = deleteCourse;

var getCourseList = function getCourseList(data) {
  return (0, _http["default"])('/Api/Course', data);
}; // 创建新的课程


exports.getCourseList = getCourseList;

var createCourse = function createCourse(data) {
  return (0, _http["default"])('/Api/Course', data, 'POST');
}; // 将课程添加至专业


exports.createCourse = createCourse;

var updateCourseToMajor = function updateCourseToMajor(data) {
  return (0, _http["default"])('/Api/Course/AttachToMajor?id=' + data.id + '&majorId=' + data.majorId, data, 'PUT');
}; // 启用/停用 课程


exports.updateCourseToMajor = updateCourseToMajor;

var updateCourseStatus = function updateCourseStatus(data) {
  return (0, _http["default"])('/Api/Course/Enable?id=' + data.id + '&enable=' + data.enable, data, 'PUT');
};
/* ------------------------------ 基础数据-教室场所------------------------------------- */
// 创建场地


exports.updateCourseStatus = updateCourseStatus;

var createSite = function createSite(data) {
  return (0, _http["default"])('/Api/Site', data, 'POST');
}; // 分页获取场地列表，可以根据教室名称，可用状态进行查询


exports.createSite = createSite;

var getSiteList = function getSiteList(data) {
  return (0, _http["default"])('/Api/Site', data);
}; // 删除场地


exports.getSiteList = getSiteList;

var deleteSite = function deleteSite(data) {
  return (0, _http["default"])('/Api/Site/' + data.id, data, 'DELETE');
}; // 根据Id获取场地信息


exports.deleteSite = deleteSite;

var getSiteById = function getSiteById(id) {
  return (0, _http["default"])('/Api/Site/' + id, {});
}; // 更新场地信息


exports.getSiteById = getSiteById;

var updateSite = function updateSite(data) {
  return (0, _http["default"])('/Api/Site/' + data.id, data, 'PUT');
}; // 修改场地状态


exports.updateSite = updateSite;

var updateSiteStatus = function updateSiteStatus(data) {
  return (0, _http["default"])('/Api/Site/Status?id=' + data.id + '&Status=' + data.status, data, 'PUT');
}; // 根据楼栋查询场地，不分页


exports.updateSiteStatus = updateSiteStatus;

var getSiteListByBuilding = function getSiteListByBuilding(buildingId) {
  return (0, _http["default"])('/Api/Site/ByBuilding?buildingId=' + buildingId, {});
}; // 获取场地下拉框数据


exports.getSiteListByBuilding = getSiteListByBuilding;

var getSiteDropdown = function getSiteDropdown(data) {
  return (0, _http["default"])('/Api/Site/GetSiteSpinnerData', data);
};
/* ------------------------------ 基础数据-楼栋信息------------------------------------- */
// 创建楼栋


exports.getSiteDropdown = getSiteDropdown;

var createBuilding = function createBuilding(data) {
  return (0, _http["default"])('/Api/Building', data, 'POST');
}; // 分页查询楼栋列表,可按照名称和状态查询


exports.createBuilding = createBuilding;

var getBuildingList = function getBuildingList(data) {
  return (0, _http["default"])('/Api/Building', data);
}; // 删除楼栋


exports.getBuildingList = getBuildingList;

var deleteBuilding = function deleteBuilding(data) {
  return (0, _http["default"])('/Api/Building?id=' + data.id, data, 'DELETE');
}; // 根据Id获取楼栋信息


exports.deleteBuilding = deleteBuilding;

var getBuildingById = function getBuildingById(id) {
  return (0, _http["default"])('/Api/Building/' + id, {});
}; // 更新楼栋信息


exports.getBuildingById = getBuildingById;

var updateBuilding = function updateBuilding(data) {
  return (0, _http["default"])('/Api/Building?id=' + data.id, data, 'PUT');
}; // 修改楼栋状态


exports.updateBuilding = updateBuilding;

var updateBuildingStatus = function updateBuildingStatus(data) {
  return (0, _http["default"])('/Api/Building/Status?id=' + data.id + '&Status=' + data.status, data, 'PUT');
};
/* ------------------------------ 基础数据-学期------------------------------------- */
// 分页查询学期,可按照名称和状态查询


exports.updateBuildingStatus = updateBuildingStatus;

var getSemesterList = function getSemesterList(data) {
  return (0, _http["default"])('/Api/Semester', data);
}; // 创建学期


exports.getSemesterList = getSemesterList;

var createSemester = function createSemester(data) {
  return (0, _http["default"])('/Api/Semester', data, 'POST');
}; // 修改学期


exports.createSemester = createSemester;

var updateSemester = function updateSemester(data) {
  return (0, _http["default"])('/Api/Semester?id=' + data.id, data, 'PUT');
}; // 删除学期


exports.updateSemester = updateSemester;

var deleteSemester = function deleteSemester(data) {
  return (0, _http["default"])('/Api/Semester?id=' + data.id, data, 'DELETE');
}; // 修改学期状态


exports.deleteSemester = deleteSemester;

var updateSemesterStatus = function updateSemesterStatus(data) {
  return (0, _http["default"])('/Api/Semester/Status?id=' + data.id + '&Status=' + data.status, data, 'PUT');
}; // 设置学期默认状态


exports.updateSemesterStatus = updateSemesterStatus;

var updateDefaultSemesterStatus = function updateDefaultSemesterStatus(data) {
  return (0, _http["default"])('/Api/Semester/defaultSemester?id=' + data.id + '&defaultSemester=' + data.defaultSemester, data, 'PUT');
};
/* ------------------------------ 基础数据-学年------------------------------------- */
// 分页查询学年,可按照名称和状态查询


exports.updateDefaultSemesterStatus = updateDefaultSemesterStatus;

var getAcademicYearList = function getAcademicYearList(data) {
  return (0, _http["default"])('/Api/AcademicYear', data);
}; // 创建学年


exports.getAcademicYearList = getAcademicYearList;

var createAcademicYear = function createAcademicYear(data) {
  return (0, _http["default"])('/Api/AcademicYear', data, 'POST');
}; // 修改学年


exports.createAcademicYear = createAcademicYear;

var updateAcademicYear = function updateAcademicYear(data) {
  return (0, _http["default"])('/Api/AcademicYear?id=' + data.id, data, 'PUT');
}; // 删除学年


exports.updateAcademicYear = updateAcademicYear;

var deleteAcademicYear = function deleteAcademicYear(data) {
  return (0, _http["default"])('/Api/AcademicYear?id=' + data.id, data, 'DELETE');
}; // 修改学年状态


exports.deleteAcademicYear = deleteAcademicYear;

var updateAcademicYearStatus = function updateAcademicYearStatus(data) {
  return (0, _http["default"])('/Api/AcademicYear/Status?id=' + data.id + '&Status=' + data.status, data, 'PUT');
};
/* ------------------------------ 基础数据-教学日程------------------------------------- */
// 获取教学日程


exports.updateAcademicYearStatus = updateAcademicYearStatus;

var getTeachCalendar = function getTeachCalendar(id) {
  return (0, _http["default"])('/Api/TeachCalendar?semesterId=' + id, {});
}; // 创建教学日程


exports.getTeachCalendar = getTeachCalendar;

var createTeachCalendar = function createTeachCalendar(data) {
  return (0, _http["default"])('/Api/TeachCalendar', data, 'POST');
}; // 更新教学日程


exports.createTeachCalendar = createTeachCalendar;

var updateTeachCalendar = function updateTeachCalendar(data) {
  return (0, _http["default"])('/Api/TeachCalendar?id=' + data.id, data, 'PUT');
}; // 获取已经设置的默认学期数据


exports.updateTeachCalendar = updateTeachCalendar;

var getDefaultSemester = function getDefaultSemester(data) {
  return (0, _http["default"])('/Api/Semester/getDefaultSemester', data);
};
/* ------------------------------ 基础数据-作息时间------------------------------------- */
// 保存作息时间


exports.getDefaultSemester = getDefaultSemester;

var createDailySchedule = function createDailySchedule(data) {
  return (0, _http["default"])('/Api/DailySchedule', data, 'POST');
}; // 编辑作息时间


exports.createDailySchedule = createDailySchedule;

var updateDailySchedule = function updateDailySchedule(data) {
  return (0, _http["default"])('/Api/DailySchedule', data, 'PUT');
}; // 获取作息时间


exports.updateDailySchedule = updateDailySchedule;

var getDailySchedule = function getDailySchedule(data) {
  return (0, _http["default"])('/Api/DailySchedule', data);
}; // 清空作息时间


exports.getDailySchedule = getDailySchedule;

var ClearTimeTable = function ClearTimeTable() {
  return (0, _http["default"])('/Api/DailySchedule/ClearTimeTable', {}, 'PUT');
};
/* ------------------------------ 基础数据-下拉选项------------------------------------- */
// 获取学年下拉框数据


exports.ClearTimeTable = ClearTimeTable;

var getAcademicYearSpinnerData = function getAcademicYearSpinnerData(data) {
  return (0, _http["default"])('/Api/AcademicYear/GetSpinnerData', {});
}; // 根据学年获取下属学期


exports.getAcademicYearSpinnerData = getAcademicYearSpinnerData;

var getSemesterSpinnerData = function getSemesterSpinnerData(academicYearId) {
  return (0, _http["default"])('/Api/Semester/GetSpinnerData?academicYearId=' + academicYearId, {});
}; // 楼栋下拉


exports.getSemesterSpinnerData = getSemesterSpinnerData;

var getBuildingsPullDown = function getBuildingsPullDown(name) {
  return (0, _http["default"])('/Api/Building/BuildingsPullDown?name=' + name, {});
};
/* ------------------------------ 毕业证书-机构基本信息------------------------------------- */
// 获取机构基本信息


exports.getBuildingsPullDown = getBuildingsPullDown;

var GetInstitutionsBasicInfo = function GetInstitutionsBasicInfo() {
  return (0, _http["default"])('Api/InstitutionsBasicInfo/GetInstitutionsBasicInfo', {});
}; // 上传机构logo


exports.GetInstitutionsBasicInfo = GetInstitutionsBasicInfo;

var CreateUpInstitutionsBasicInfo = function CreateUpInstitutionsBasicInfo(data) {
  return (0, _http["default"])('Api/InstitutionsBasicInfo/CreateUpInstitutionsBasicInfo', data, 'POST');
}; // 获取证书列表


exports.CreateUpInstitutionsBasicInfo = CreateUpInstitutionsBasicInfo;

var GetCertificatePageList = function GetCertificatePageList(data) {
  return (0, _http["default"])('Api/Certificate/GetCertificatePageList', data);
}; // 创建证书列表


exports.GetCertificatePageList = GetCertificatePageList;

var CreateCertificate = function CreateCertificate(data) {
  return (0, _http["default"])('Api/Certificate/CreateCertificate', data, 'POST');
}; // 获取详情


exports.CreateCertificate = CreateCertificate;

var GetCertificate = function GetCertificate(id) {
  return (0, _http["default"])('Api/Certificate/GetCertificate?id=' + id, {});
}; // 选择证书背景


exports.GetCertificate = GetCertificate;

var SetBackgroundImg = function SetBackgroundImg(data) {
  return (0, _http["default"])('Api/Certificate/SetBackgroundImg?id=' + data.id + '&backgroundImg=' + data.backgroundImg, {}, 'put');
}; // 证书列表删除（批量）


exports.SetBackgroundImg = SetBackgroundImg;

var DeleteCertificate = function DeleteCertificate(list) {
  return (0, _http["default"])('Api/Certificate/DeleteCertificate?id=' + list, {}, 'DELETE');
}; // 获取毕业要求审批列表


exports.DeleteCertificate = DeleteCertificate;

var GraduationRequirementsList = function GraduationRequirementsList(data) {
  return (0, _http["default"])('/Api/StudentInfo/GraduationRequirementsList', data);
}; // 获取学生证书列表


exports.GraduationRequirementsList = GraduationRequirementsList;

var StudentCertificate = function StudentCertificate(data) {
  return (0, _http["default"])('/Api/StudentInfo/StudentCertificate', data);
}; // 审批证书


exports.StudentCertificate = StudentCertificate;

var ApproveCertificate = function ApproveCertificate(data) {
  return (0, _http["default"])('/Api/StudentInfo/ApproveCertificate', data, 'PUT');
}; // 获取证书学生列表
// export const GetGraduationStudentInfo = (data) => http(`/Api/CertificateGrant/GetGraduationStudentInfo`, data)


exports.ApproveCertificate = ApproveCertificate;

var GetGraduationStudentInfo = function GetGraduationStudentInfo(data) {
  return (0, _http["default"])("/Api/CertificateGrant/GetGraduationStudentInfo", data);
}; //创建证书发放记录信息


exports.GetGraduationStudentInfo = GetGraduationStudentInfo;

var CreateCertificatesGrant = function CreateCertificatesGrant(data) {
  return (0, _http["default"])("/Api/CertificateGrant/CreateCertificatesGrant", data, 'POST');
}; //获取证书名称


exports.CreateCertificatesGrant = CreateCertificatesGrant;

var GetCertificateList = function GetCertificateList(type) {
  return (0, _http["default"])('/Api/Certificate/GetCertificateList?type=' + type, {});
}; //获取证书发放详情


exports.GetCertificateList = GetCertificateList;

var GetCertificateCoreLatest = function GetCertificateCoreLatest(data) {
  return (0, _http["default"])("/Api/CertificateGrant/GetCertificateCoreLatest?type=".concat(data.type, "&studentIds=[").concat(data.studentIds, "]&classId=").concat(data.classId, "&certificateId=").concat(data.certificateId), {});
}; //证书启用或禁用


exports.GetCertificateCoreLatest = GetCertificateCoreLatest;

var UpCertificateStatus = function UpCertificateStatus(data) {
  return (0, _http["default"])("/Api/Certificate/UpCertificateStatus?id=".concat(data.id, "&status=").concat(data.status), {}, 'PUT');
}; //点击打印


exports.UpCertificateStatus = UpCertificateStatus;

var GetCertificateInfo = function GetCertificateInfo(data) {
  return (0, _http["default"])("/Api/CertificateGrant/GetCertificateInfo?id=".concat(data.id, "&classId=").concat(data.classId, "&tpId=").concat(data.tpId), {});
}; //打印状态


exports.GetCertificateInfo = GetCertificateInfo;

var UpdateCertificatesGrantStatus = function UpdateCertificatesGrantStatus(id) {
  return (0, _http["default"])("/Api/CertificateGrant/UpdateCertificatesGrantStatus?id=".concat(id), {}, 'PUT');
}; //删除


exports.UpdateCertificatesGrantStatus = UpdateCertificatesGrantStatus;

var DeleteCertificatesGrant = function DeleteCertificatesGrant(id) {
  return (0, _http["default"])('/Api/CertificateGrant/DeleteCertificatesGrant?id=' + id, {}, 'DELETE');
}; // -------------------------------------------------------------佐证材料---------------------------------------------------------------------------
//获取佐证栏目列表


exports.DeleteCertificatesGrant = DeleteCertificatesGrant;

var GetSupportingMaterialsPageList = function GetSupportingMaterialsPageList(data) {
  return (0, _http["default"])('/Api/StudentInfoImportingExport/GetSupportingMaterialsPageList', data);
}; //创建佐证栏目


exports.GetSupportingMaterialsPageList = GetSupportingMaterialsPageList;

var CreateSupportingMaterials = function CreateSupportingMaterials(data) {
  return (0, _http["default"])('/Api/StudentInfoImportingExport/CreateSupportingMaterials', data, 'POST');
}; //修改佐证栏目


exports.CreateSupportingMaterials = CreateSupportingMaterials;

var UpdateCertificate = function UpdateCertificate(data) {
  return (0, _http["default"])('/Api/Certificate/UpdateCertificate', data, 'PUT');
}; //删除佐证栏目


exports.UpdateCertificate = UpdateCertificate;

var DeleteSupportingMaterials = function DeleteSupportingMaterials(list) {
  return (0, _http["default"])('/Api/StudentInfoImportingExport/DeleteSupportingMaterials?id=' + list, {}, 'DELETE');
}; //获取佐证材料列表


exports.DeleteSupportingMaterials = DeleteSupportingMaterials;

var GetSupportingMaterialsAuditInfo = function GetSupportingMaterialsAuditInfo(id) {
  return (0, _http["default"])('/Api/StudentInfoImportingExport/GetSupportingMaterialsAuditInfo?classId=' + id, {});
}; //提交审核


exports.GetSupportingMaterialsAuditInfo = GetSupportingMaterialsAuditInfo;

var SubmitReview = function SubmitReview(data) {
  return (0, _http["default"])('/Api/StudentInfoImportingExport/SubmitReview', data, 'POST');
}; //佐证材料启用或禁用


exports.SubmitReview = SubmitReview;

var UpdateStatus = function UpdateStatus(data) {
  return (0, _http["default"])("/Api/StudentInfoImportingExport/UpdateStatus?id=".concat(data.id, "&status=").concat(data.status), {}, 'PUT');
}; //佐证材料排序


exports.UpdateStatus = UpdateStatus;

var UpdateSort = function UpdateSort(data) {
  return (0, _http["default"])("/Api/StudentInfoImportingExport/UpdateSort?id=".concat(data.id, "&sort=").concat(data.sort), {}, 'PUT');
}; // 获取政府端列表


exports.UpdateSort = UpdateSort;

var GetGovernmentInformation = function GetGovernmentInformation(id) {
  return (0, _http["default"])("/Api/StudentInfoImportingExport/GetGovernmentInformation?classId=".concat(id), {});
}; //修改佐证栏目


exports.GetGovernmentInformation = GetGovernmentInformation;

var UpdateSupportingMaterials = function UpdateSupportingMaterials(data) {
  return (0, _http["default"])("/Api/StudentInfoImportingExport/UpdateSupportingMaterials", data, 'PUT');
};

exports.UpdateSupportingMaterials = UpdateSupportingMaterials;