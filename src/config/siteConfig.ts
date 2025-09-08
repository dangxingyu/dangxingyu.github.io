// Site configuration for controlling which sections are displayed

export interface SiteConfig {
  sections: {
    hero: boolean;
    researchInterests: boolean;
    publications: boolean;
    projects: boolean;
  };
  // Additional configuration options can be added here
}

export const siteConfig: SiteConfig = {
  sections: {
    hero: true,
    researchInterests: false,  // Set to false to hide Research Interests section
    publications: true,        // Set to false to hide Publications section
    projects: false,           // Set to false to hide Projects section (currently hidden)
  }
};