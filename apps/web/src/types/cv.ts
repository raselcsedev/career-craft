export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatarUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies?: string;
  url?: string;
  github?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface CvContent {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
}

export interface CvStyling {
  primaryColor: string;
  fontFamily: 'Inter' | 'Roboto' | 'Merriweather' | 'Poppins' | 'Fira Code';
  fontSize: 'small' | 'normal' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  sectionOrder?: string[];
}

export interface CvTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  layout: string;
  thumbnail?: string;
  isActive: boolean;
}

export interface CvDocument {
  id: string;
  userId: string;
  templateId: string;
  template?: CvTemplate;
  title: string;
  slug?: string;
  content: CvContent;
  styling: CvStyling;
  createdAt: string;
  updatedAt: string;
}
