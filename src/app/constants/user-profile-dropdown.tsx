import navigations from "@/app/constants/navigations";
import { DropDownListType } from "../shared/dataPass";

export const UserProfile : DropDownListType = [
  {
    name: '',
    icon:'',
    navigation:'',
    value: 0,
  },
  {
    name: 'Profile Settings',
    icon:'',
    navigation: navigations.userProfile,
    value: 1,
  },
  {
    name: 'Business Preferences',
    icon:'',
    navigation: navigations.businessProfile,
    value: 2
  },
  {
    name: 'Manage Subscription',
    icon:'',
    navigation: '',
    value: 3
  },
  {
    name: 'Sign Out',
    icon: 'log-out-red.svg',
    navigation: navigations.login,
    value: 4
  }
];
