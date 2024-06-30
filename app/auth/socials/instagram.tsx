const clientId = '2153953224988805';
const display = 'page';
const extras = '{"setup":{"channel":"IG_API_ONBOARDING"}}';

//local host  URi
const redirectUri = 'http://localhost:3000/auth/socials/callback/instagram'

// master branch Url
// const redirectUri = 'https://fyp-git-master-weih0ngs-projects.vercel.app/auth/socials/callback/instagram'; // Replace with your redirect URI

// production url
// const redirectUri = ""

const scope = 'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement'; // Replace with the required scopes
const responseType = 'token';

export const instagramOAuth = () => {
  const authUrl = `https://www.facebook.com/dialog/oauth?client_id=${clientId}&display=${display}&extras=${extras}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  window.open(authUrl, '_blank');
};
