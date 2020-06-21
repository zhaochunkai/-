"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EvaluationList = exports.getExamPaperRecord = exports.OnlineStudy = exports.LiveStudy = exports.StudentBasicInfo = exports.getLivingCheckInHistoryItems = exports.getLivingCheckInHistoryStatistic = exports.getAttendanceItemByStudentId = exports.getAttendanceStatisticByStudentId = void 0;

var _http = _interopRequireDefault(require("./http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* ------------------------------ 学生档案-考勤信息------------------------------------- */
// 获取学生考勤信息统计
var getAttendanceStatisticByStudentId = function getAttendanceStatisticByStudentId(data) {
  return (0, _http["default"])('/Api/Attendance/AttendanceStatisticByStudentId', data);
}; // 获取学生考勤详情


exports.getAttendanceStatisticByStudentId = getAttendanceStatisticByStudentId;

var getAttendanceItemByStudentId = function getAttendanceItemByStudentId(data) {
  return (0, _http["default"])('/Api/Attendance/AttendanceItemByStudentId', data);
}; // 获取直播考勤统计


exports.getAttendanceItemByStudentId = getAttendanceItemByStudentId;

var getLivingCheckInHistoryStatistic = function getLivingCheckInHistoryStatistic(data) {
  return (0, _http["default"])('/Api/LiveRoom/CheckInHistoryStatistic', data);
}; // 获取直播学习记录


exports.getLivingCheckInHistoryStatistic = getLivingCheckInHistoryStatistic;

var getLivingCheckInHistoryItems = function getLivingCheckInHistoryItems(data) {
  return (0, _http["default"])('/Api/LiveRoom/CheckInHistoryItems', data);
}; //获取学生基本信息


exports.getLivingCheckInHistoryItems = getLivingCheckInHistoryItems;

var StudentBasicInfo = function StudentBasicInfo(data) {
  return (0, _http["default"])("Api/StudyReport/StudentBasicInfo?studentId=".concat(data.studentId, "&projectId=").concat(data.projectId), {});
}; //直播学习


exports.StudentBasicInfo = StudentBasicInfo;

var LiveStudy = function LiveStudy(data) {
  return (0, _http["default"])("Api/StudyReport/LiveStudy?studentId=".concat(data.studentId, "&projectId=").concat(data.projectId), {});
}; //在线学习


exports.LiveStudy = LiveStudy;

var OnlineStudy = function OnlineStudy(data) {
  return (0, _http["default"])("Api/StudyReport/OnlineStudy?studentId=".concat(data.studentId, "&projectId=").concat(data.projectId), {});
}; // 获取学生成绩信息


exports.OnlineStudy = OnlineStudy;

var getExamPaperRecord = function getExamPaperRecord(data) {
  return (0, _http["default"])('/Api/ExamPaperRecord/ExamPaperByStudent', data);
}; //评价


exports.getExamPaperRecord = getExamPaperRecord;

var EvaluationList = function EvaluationList(data) {
  return (0, _http["default"])("Api/StudyReport/EvaluationList?studentId=".concat(data.studentId, "&projectId=").concat(data.projectId), {});
};

exports.EvaluationList = EvaluationList;