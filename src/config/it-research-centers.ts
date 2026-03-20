export type ItalyResearchCenterType = 'university' | 'research_center' | 'private_lab';

export interface ItalyResearchCenter {
  id: string;
  name: string;
  type: ItalyResearchCenterType;
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  focus: string[];
  website?: string;
}

export const ITALY_RESEARCH_CENTERS: ItalyResearchCenter[] = [
  {
    id: 'polimi-ai',
    name: 'Politecnico di Milano - AI Lab',
    type: 'university',
    city: 'Milan',
    region: 'Lombardia',
    country: 'Italy',
    lat: 45.4782,
    lon: 9.2277,
    focus: ['AI', 'Robotics', 'Computer Vision'],
    website: 'https://www.polimi.it',
  },
  {
    id: 'iit-genova',
    name: 'IIT',
    type: 'research_center',
    city: 'Genoa',
    region: 'Liguria',
    country: 'Italy',
    lat: 44.4112,
    lon: 8.9326,
    focus: ['AI', 'Neuroscience', 'Robotics'],
    website: 'https://www.iit.it',
  },
];

