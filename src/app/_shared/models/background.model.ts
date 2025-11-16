export type EducationEntry = {
  title: string;
  institution: string;
  start: string;
  end: string;
  description: string;
};

export type WorkExperience = {
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  description: string;
};
