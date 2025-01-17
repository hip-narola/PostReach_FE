type Routes = {
    [key: string]: string;
  };
  
  const APIRoutes: Routes = {
    // auth
    login: 'auth/signin',
    registration: 'auth/signup',
    resendSignupCode: 'auth/signup/resendConfirmationCode',
    confirmSignup: 'auth/signup/confirmation',
    forgotPassword: 'auth/forgotPassword',
    resetPassword: 'auth/resetPassword',
  
    // user profile
    getUserData: 'user/',
    getBusinessOnBoradQuestionList: 'questionnaire/get/',
    updateUserDetails: 'user/',
  
    // third-party Sign-in
    googleSignIn: 'auth/google',
    facebookSignIn: 'auth/facebook',
    twitterSignIn: 'link-page/twitter-login',
    linkedinSignIn: 'link-page/linkedin-login',
    linkFacebookSignIn: 'link-page/facebook-link',
    facebookPageSignIn: 'link-page/facebook-page',
    instagramSignIn: 'link-page/instagram-link',
    getUserSocialLink: 'social-media-account/user/',
    organizationList: 'link-page/pages/',
    postOrganization: 'link-page/connect-profile',
    disconnectSocial :'link-page/disconnectProfile',
  
    // onboarding
    onboardUser: 'questionnaire/',
    userStatus: 'user/profile-status/',
    submitOnBoard: 'questionnaire/save/',
  
    // business preference
    getBusinessPreference: 'user-business/',
    submitBusinessPreference: 'user-business',
    getQuestionnairList: 'questionnaire/user/',
  
    // post details
    getPostList: 'approval-queue/getList',
    approveRejectPost: 'approval-queue/updateStatus',
    getRejectReason: 'approval-queue/RejectReasonList',
    deletePost: 'post-history/archive',
  
    // calendar list
    getCalendarList: 'calendar/getList',
  
    // post history
    getPostHistory: 'post-history/getList',
  
    // dashboard
    dashboardList: 'dashboard-insights/getSocialinsightsList',

    // interaction
    getIneractions :'notification/getList/',
    readInteractions:'notification/update',

    // subscription 
    trialSubscritption : 'payment/save-user-trial-subscription/'
  };
  
  export default APIRoutes;
  