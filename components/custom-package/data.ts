export type CustomService = {
  titleKey: string;
  id: string;
  price: number;
};

export const SERVICES_MAP: CustomService[] = [
  // Digital Marketing Services
  { titleKey: 'dm_smm_title', id: 'dm_smm', price: 3000 },
  { titleKey: 'dm_marketing_title', id: 'dm_marketing', price: 15000 },
  { titleKey: 'dm_visual_title', id: 'dm_visual', price: 2000 },
  { titleKey: 'dm_influencer_title', id: 'dm_influencer', price: 2500 },
  { titleKey: 'dm_content_title', id: 'dm_content', price: 1200 },
  { titleKey: 'dm_exhibitions_title', id: 'dm_exhibitions', price: 2000 },
  { titleKey: 'dm_advertising_title', id: 'dm_advertising', price: 4000 },
  { titleKey: 'dm_consultation_title', id: 'dm_consultation', price: 1000 },
  { titleKey: 'dm_seo_title', id: 'dm_seo', price: 6000 },

  // Innovation & Development Services
  { titleKey: 'id_apps_title', id: 'id_apps', price: 40000 },
  { titleKey: 'id_website_title', id: 'id_website', price: 25000 },
  { titleKey: 'id_branding_title', id: 'id_branding', price: 15000 },
  { titleKey: 'id_software_title', id: 'id_software', price: 35000 },
  { titleKey: 'id_cloud_title', id: 'id_cloud', price: 12000 },

  // Real Estate Marketing Services
  { titleKey: 're_appraisal_title', id: 're_appraisal', price: 0 },
  { titleKey: 're_marketing_title', id: 're_marketing', price: 60000 },
  { titleKey: 're_management_title', id: 're_management', price: 80000 },
  { titleKey: 're_photography_title', id: 're_photography', price: 2500 },
  { titleKey: 're_campaign_title', id: 're_campaign', price: 2000 },
  { titleKey: 're_project_images_title', id: 're_project_images', price: 3000 },
  { titleKey: 're_current_eval_title', id: 're_current_eval', price: 1500 },
  { titleKey: 're_project_naming_title', id: 're_project_naming', price: 1000 },
];

export const DIGITAL_MARKETING_SERVICES: CustomService[] = [
  { titleKey: 'dm_smm_title', id: 'dm_smm', price: 3000 },
  { titleKey: 'dm_marketing_title', id: 'dm_marketing', price: 15000 },
  { titleKey: 'dm_visual_title', id: 'dm_visual', price: 2000 },
  { titleKey: 'dm_influencer_title', id: 'dm_influencer', price: 2500 },
  { titleKey: 'dm_content_title', id: 'dm_content', price: 1200 },
  { titleKey: 'dm_exhibitions_title', id: 'dm_exhibitions', price: 2000 },
  { titleKey: 'dm_advertising_title', id: 'dm_advertising', price: 4000 },
  { titleKey: 'dm_consultation_title', id: 'dm_consultation', price: 1000 },
  { titleKey: 'dm_seo_title', id: 'dm_seo', price: 6000 },
];

export const INNOVATION_DEVELOPMENT_SERVICES: CustomService[] = [
  { titleKey: 'id_apps_title', id: 'id_apps', price: 40000 },
  { titleKey: 'id_website_title', id: 'id_website', price: 25000 },
  { titleKey: 'id_branding_title', id: 'id_branding', price: 15000 },
  { titleKey: 'id_software_title', id: 'id_software', price: 35000 },
  { titleKey: 'id_cloud_title', id: 'id_cloud', price: 12000 },
];

export const REAL_ESTATE_MARKETING_SERVICES: CustomService[] = [
  { titleKey: 're_appraisal_title', id: 're_appraisal', price: 0 },
  { titleKey: 're_marketing_title', id: 're_marketing', price: 60000 },
  { titleKey: 're_management_title', id: 're_management', price: 80000 },
  { titleKey: 're_photography_title', id: 're_photography', price: 2500 },
  { titleKey: 're_campaign_title', id: 're_campaign', price: 2000 },
  { titleKey: 're_project_images_title', id: 're_project_images', price: 3000 },
  { titleKey: 're_current_eval_title', id: 're_current_eval', price: 1500 },
  { titleKey: 're_project_naming_title', id: 're_project_naming', price: 1000 },
];