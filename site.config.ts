type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  ga_measurement_id?: string;
};

export const siteConfig: SiteConfig = {
  site_name: "TomHay.es",
  site_description: "Personal website of Tom Hayes, a web developer from Birmingham, UK.",
  site_domain: "https://TomHay.es",
  ga_measurement_id: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};
