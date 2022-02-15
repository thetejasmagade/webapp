export const unitTypeCourse = "course";

export const unitTypeProject = "project";

export function createProjectUnit(project) {
  return {
    type: unitTypeProject,
    project,
  };
}

export function createCourseUnit(course) {
  return {
    type: unitTypeCourse,
    course,
  };
}

export function getUnitData(unit) {
  if (unit.type === unitTypeCourse) {
    return unit.course;
  }
  if (unit.type === unitTypeProject) {
    return unit.project;
  }
  throw "bad unit type";
}
