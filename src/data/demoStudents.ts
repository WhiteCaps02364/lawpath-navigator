export interface DemoStudent {
  id: string;
  name: string;
  institution: string;
  completedLabel: string;
  readiness: 'High' | 'Developing' | 'Needs Preparation';
  gpa: number;
  testStatus: string;
  resumeUploaded: boolean;
}

export const demoStudents: DemoStudent[] = [
  { id: 'alex-johnson', name: 'Alex Johnson', institution: 'Duke University', completedLabel: '3 days ago', readiness: 'Developing', gpa: 3.6, testStatus: 'No test', resumeUploaded: false },
  { id: 'maria-chen', name: 'Maria Chen', institution: 'Duke University', completedLabel: '1 week ago', readiness: 'High', gpa: 3.85, testStatus: 'LSAT 168', resumeUploaded: true },
  { id: 'james-williams', name: 'James Williams', institution: 'Duke University', completedLabel: '2 weeks ago', readiness: 'Needs Preparation', gpa: 3.1, testStatus: 'No test', resumeUploaded: false },
  { id: 'sarah-park', name: 'Sarah Park', institution: 'Duke University', completedLabel: '2 weeks ago', readiness: 'Developing', gpa: 3.55, testStatus: 'JD-Next', resumeUploaded: true },
  { id: 'marcus-thompson', name: 'Marcus Thompson', institution: 'Duke University', completedLabel: '1 month ago', readiness: 'High', gpa: 3.9, testStatus: 'LSAT 172', resumeUploaded: true },
];

export function getDemoStudent(id: string) {
  return demoStudents.find(s => s.id === id);
}