import navigations from "@/app/constants/navigations";
export const  Menu = 
[

  {
    name : 'Dashboard',
    icon : 'dashboard.svg',
    navigation : navigations.dashboard,
    value : 0
   },
   // {
   //    name : 'Chat AI Expert',
   //    icon : 'chat-ai-expert.svg',
   //    navigation : '/user/dashboard',
   //    value : 2
   // },
   {
      name : 'Approval Queue',
      icon : 'approval-queue.svg',
      navigation : navigations.approvalQueue,
      value : 1
   },
  {
      name : 'Calendar',
      icon : 'calendar.svg',
      navigation : navigations.eventCalendar,
      value : 2
   },
  {
      name : 'Post History',
      icon : 'post-history.svg',
      navigation : navigations.postHistory,
      value : 3
   }
]

export const  LowerMenu = 
[

  {
    name : 'Support',
    icon : 'support.svg',
    navigation : navigations.userSupport,
    value : 0
   },
   {
      name : 'Link Socials',
      icon : 'link-socials.svg',
      navigation : navigations.socialLinks,
      value : 1
   },
]

