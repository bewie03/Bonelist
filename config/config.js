// Supabase Configuration
export const SUPABASE_CONFIG = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
};

// Webflow Configuration
export const WEBFLOW_CONFIG = {
    SITE_ID: process.env.WEBFLOW_SITE_ID,
    COLLECTION_ID: process.env.WEBFLOW_COLLECTION_ID,
    API_TOKEN: process.env.WEBFLOW_API_TOKEN,
};

// Zapier Configuration
export const ZAPIER_CONFIG = {
    WEBHOOK_URL: process.env.ZAPIER_WEBHOOK_URL,
};

// Application Settings
export const APP_CONFIG = {
    MIN_BONE_PAYMENT: '1000', // Minimum BONE tokens required for listing
    VOTE_COOLDOWN: 24 * 60 * 60, // 24 hours in seconds
    MAX_PROJECTS_PER_PAGE: 50,
};
