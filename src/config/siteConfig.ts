// Site configuration for controlling which sections are displayed.
// Every flag here must be read by src/pages/IntroPage.tsx. Do not add one
// without wiring it up, or it becomes documentation for behaviour that
// does not exist.

export interface SiteConfig {
  sections: {
    hero: boolean;
    researchInterests: boolean;
    publications: boolean;
  };
}

export const siteConfig: SiteConfig = {
  sections: {
    hero: true,
    researchInterests: true,
    publications: true,
  }
};
