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

export function getUnitLinkLanding(unit) {
  const unitData = getUnitData(unit);
  if (unit.type === unitTypeCourse) {
    return {
      name: "CourseLanding",
      params: { courseSlug: unitData.Slug },
    };
  }
  return {
    name: "ProjectLanding",
    params: { projectSlug: unitData.Slug },
  };
}

export function getUnitLink(unit) {
  const unitData = getUnitData(unit);
  if (unit.type === unitTypeCourse) {
    return {
      name: "Course",
      params: { courseUUID: unitData.UUID },
    };
  }
  return {
    name: "Project",
    params: { projectUUID: unitData.UUID },
  };
}
