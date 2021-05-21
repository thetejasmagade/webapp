const experienceLevels = [
  {
    label: 'New',
    description: 'I\'ve never written a line of code',
    upperLimit: 10
  },
  {
    label: 'Student',
    description: 'I\'ve taken courses or classes before but have never finished a project',
    upperLimit: 20
  },
  {
    label: 'Entry-Level Developer',
    description: 'I\'ve completed coding projects or classes but have never been payed to code',
    upperLimit: 30
  },
  {
    label: 'Junior Developer',
    description: 'I have an entry-level programming job',
    upperLimit: 40
  },
  {
    label: 'Mid-Level Developer',
    description: 'I have a degree or have worked in the industry for at least 3 years',
    upperLimit: 60
  },
  {
    label: 'Senior Developer',
    description: 'I\'ve been called a senior engineer',
    upperLimit: 100
  }
];

export function experienceLevelToObj(experienceLevel){
  for (const obj of experienceLevels){
    if (obj.upperLimit > experienceLevel){
      return obj;
    }
  }
  return experienceLevels[experienceLevels.length - 1];
}

export function experienceLevelLabels(){
  const labels = [];
  for (const obj of experienceLevels){
    labels.push(obj.label);
  }
  return labels;
}

export function experienceLevelLabelToUpperLimit(label){
  for (const obj of experienceLevels){
    if (obj.label === label){
      return obj.upperLimit;
    }
  }
  return null;
}

export function experienceLevelUpperLimitToLabel(upperLimit){
  for (const obj of experienceLevels){
    if (obj.upperLimit === upperLimit){
      return obj.label;
    }
  }
  return null;
}
