const  navigations = {

    // auth
    login : '/auth/signin' ,
    registration : '/auth/signup',
    confirmCode : '/auth/confirm-mail' ,
    forgotPassword: '/auth/forgot-password',
    resetPassword : '/auth/reset-password',
    onboarding :'/auth/on-boarding',

    // dashboard 
    dashboard : '/user/dashboard',

    // user profile
    userProfile : '/user/profile/profile-setting',
    businessProfile : '/user/profile/business-preference',

    // approval queue
    approvalQueue:'/user/approval-queue',

    // social links
    socialLinks : '/user/link-social',

    // calendar

    eventCalendar : '/user/event-calendar',

    // post history

    postHistory : '/user/post-history',

    // support 

    userSupport : '/user/support',


    protectedRoute : '/user'
    

}

export default navigations;