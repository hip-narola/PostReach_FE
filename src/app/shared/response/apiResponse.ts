export interface ApiResponse<T> {
 
    StatusCode: number;
    Data: T;
    Message: string;
    IsSuccess: boolean;
 
}

export interface loginResponseData {
    idToken: string ,
    accessToken: string ,
    refreshToken: string ,
    expiresIn: number,
    rememberMe: boolean,
    userId: string
}

export interface SignupResponseData {
    $metadata: {
        httpStatusCode: number,
        requestId: string,
        attempts: number,
        totalRetryDelay: number
    },
    CodeDeliveryDetails: {
        AttributeName: string,
        DeliveryMedium: string,
        Destination: string
    },
    UserConfirmed: boolean,
    UserSub: string
}

export interface ConfirmdCodeData {
    CodeDeliveryDetails: {
      Destination: string,
      DeliveryMedium: string,
      AttributeName: string
    }
}

export interface PostData<T> {
    details: T,
    totalCount: number,
    totalPages: number,
    currentPage: number
}

export interface ReasonListData {
    id: number,
    reason: string
}

export interface UserProfileData<T> {
    userProfileStatus: {
        socialMediaAccounts: T,
        maxStep: number,
        onboardingCompleted: boolean
    }
}

export interface SocialMediaData{
    SocialMediaAccount:string,
    isConnected:boolean
}

export type SocialMediaType = SocialMediaData[]; 


export interface SocialInsightsData{
        Posts: {
            TotalPost: number,
            ApprovedPost: number,
            RejectedPost: number
        },
        Impression: {
            Count: number,
            Percentage: number,
            Chart: [
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                }
            ]
        },
        Followers: {
            Count: number,
            Percentage: number,
            Chart: [
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                }
            ]
        },
        Engagements: {
            Count: number,
            Percentage: number,
            Chart: [
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                },
                {
                    day: string,
                    value: number
                }
            ]
        }
}

export interface DashboardData{
    days: number,
    userId: number,
    platform: number | undefined
}


