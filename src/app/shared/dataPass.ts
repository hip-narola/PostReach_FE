export interface DataContextResponseType {
    email? :string,
    type? : string,
    code? : string,
    password?:string,
    data?:object
}

export interface ErrorType {
  code? :string,
  email?:string
}

export interface DropDownType {
  name : string,
  navigation :string,
  value : number,
  icon?:string
}
export type DropDownListType = DropDownType[];

export interface SidebarType {
  name : string,
  navigation : string,
  value :number
  icon : string,
}

export interface UserData {
    name : string,
    email:string,
    id: number,
    cognitoId?: string,
    profilePicture: string,
    profilePictureUrl:string,
    phone: string,
    isActive: boolean,
    createdAt?: Date,
    updatedAt?: Date
}
export type UserDataType = UserData[];

export interface BusinessDataType {
  image: string
  brand_name: string
  location: string
  website: string
  use: string
  updated_at?: Date
  user_id: string
  created_at?: Date
  overview: string
}

export interface localStorageType {
  accessToken : string,
  refreshToken: string,
  idToken:string
  userId:string
}

export interface OnboardQuestionType {
  StepId: string;
  Questions: {
    id: number;
    Question: string;
    QuestionDescription?: string | null;
    QuestionType: string | null;
    ControlLabel?: string  | null;
    ControlPlaceholder?: string | null;
    QuestionOrder?: number ;
    ReferenceId?: string | null;
    IsRequired:boolean;
    isPartner:boolean;
    Options?: {
      id: number;  // Updated to string as per your JSON data
      QuestionId: number;
      Name: string;
      SubQuestionId?: number | null;  // Optional to handle null values
    }[];
    Answers:{
      answer_text : string | boolean
      question_option_id: object
    }
  }[];
}

export interface QuestionTypes {
    id: number;
    Question: string;
    QuestionDescription?: string | null;
    QuestionType: string | null;
    ControlLabel?: string | undefined;
    ControlPlaceholder?: string | undefined;
    QuestionOrder?: number;
    ReferenceId?: string | null;
    IsRequired:boolean;
    regex?:string,
    isPartner:boolean;
    Options?: {
      id: number;
      QuestionId: number;
      Name: string;
      SubQuestionId: number;
    }[];
    Answers:{
      answer_text : string | boolean;
      question_option_id: string[];
    }
}
export type QuestionnaireTypes = QuestionTypes[];
export interface OptionsList {
          id:number,
          QuestionId: number,
          Name: string,
          SubQuestionId: number
}
export interface AnswerType{
  questionId  : number ,
  question_option_id? : string[],
  answer_text?: string | boolean;
}

export interface SelectedAnswersType{
  questionId:number;
  answer_text? : string | boolean;
  question_option_id?: string[];
}
export interface Questionnaire {
  completeStep: number;
  icon: string;
  id: number;
  minutes: string;
  name: string;
  percentage: number;
  time: string;
  totalStep: number;
}

export type QuestionnaireListType = Questionnaire[];
export interface InfiniteScrollType{
  limit:number ,
  pageNumber: number,
  userId:number | null
}

export type Post = {
  id: string;
  postId:string,
  image: string;
  content: string;
  hashtags: string[];
  channel: number;
  scheduled_at: string;
  start: Date; // Add these
  end: Date;   // Add these
  profileImage:string;
  user:string;
  analytics?: { [key: string]: number }[];
  time?:string
  allDay?:boolean;
  isPast?:boolean;
};

export type PostListType = Post[]; // An array of Post objects
export interface CalendarListType{
  startWeekDate: string ,
  endWeekDate: string,
  userId:number | null
}

export interface ApproveRejectType{
  id:  string[],
  isApproved: boolean,
  rejectreasonId:string,
  rejectReason:string
}

export interface DeletePostType{
  postIds:  string[],
}

export interface CustomDateEventType{
  startDate: Date,
  endDate: Date
}

export interface LinkSocialResponse {
  platform: number,
  encrypted_access_token: string
}

export type LinkSocialResponseType = LinkSocialResponse[];

export interface OrganizationResponse{
  pageId: number,
  pageName: string,
  industry: string,
  logoUrl: string,
  isPage:boolean,
  instagramId?:string,
  facebookId?:string,
  access_token?:string,
  filePath?:string,
  facebook_Profile_access_token:string
}


export interface PostOrganizationObject{
  userId: number;
  pageId: number, 
  isPage: boolean,
  platform: number,
  logoUrl:string
  linkedInTokenParamDto?: {
    encrypted_access_token:string;
    refresh_token:string;
    refresh_token_expire_in:string;
    expires_in:string;
  },
  facebookConnectProfileParamDto?: {
    access_token: string,
    pageName: string,
    faceBookId: string,
    instagramId: string,
    filePath?: string,
    facebook_Profile_access_token: string
  }
}

export interface DisconnectSocial{
  userId: number,
  platform: number
}

export interface NotificationList{
  id: number,
  user_id: number,
  type: string,
  content: string,
  is_read: boolean,
  created_at: Date,
  modified_at: Date
}

export type NotificationListType = NotificationList[];

export interface NotificationPost{
  userId: number,
  isAllRead: boolean
}

export interface ManageSubscription{
  url :string
}







