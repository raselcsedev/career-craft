import { UserProfile } from '@/lib/auth-context';

export interface PortfolioProject {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  displayOrder: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioThemeConfig {
  primaryColor?: string;
  fontFamily?: string;
  darkMode?: boolean;
  sections?: {
    about?: boolean;
    skills?: boolean;
    projects?: boolean;
    contact?: boolean;
    experience?: boolean;
    education?: boolean;
  };
}

export interface PortfolioTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail?: string;
  layout: string;
  isActive: boolean;
}

export interface PortfolioDocument {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  slug: string;
  bio?: string;
  themeConfig?: PortfolioThemeConfig;
  isPublished: boolean;
  publishedAt?: string;
  template?: PortfolioTemplate;
  projects?: PortfolioProject[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicPortfolioData {
  id: string;
  title: string;
  slug: string;
  bio?: string;
  themeConfig?: PortfolioThemeConfig;
  publishedAt?: string;
  template: PortfolioTemplate;
  projects: PortfolioProject[];
  owner: UserProfile;
}
