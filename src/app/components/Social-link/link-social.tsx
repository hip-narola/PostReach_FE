"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import APIRoutes from '../../constants/API-Routes'
import { CommonWords, ErrorCode, LocalStorageType, PageConstant, SocialMedia } from "../../constants/pages";
import { useSearchParams } from 'next/navigation';
import { ApiResponse } from "../../shared/response/apiResponse";
import { disconnectSocial, getOrganizationList, getUserSocialLinks, selectPage } from "../../services/user-service";
import { DataContext } from "../../context/shareData";
import { logout } from "../../services/auth-service";
import { useRouter } from "next/navigation";
import { LinkSocialResponse, LinkSocialResponseType, OrganizationResponse } from "../../shared/dataPass";
import OrganizationPopup from "./organization-popup";
import { useLoading } from "@/app/context/LoadingContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationPopup from '../../common/custom-confirmation';
import navigations from "@/app/constants/navigations";

const LinkSocial: React.FC = () => {
  const context = useContext(DataContext);

  if (!context) {
      throw new Error('DataContext must be used within a DataProvider');
  }

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isSuccess , setSuccess] = useState<string | null>('false');
  const [token , setToken] = useState<string>('');
  const [refreshToken , setRefreshToken] = useState<string>('');
  const [tokenExpire , setTokenExpire] = useState<string>('');
  const [refreshExpire , setRefreshExpire] = useState<string>('');
  const [type , setType] = useState<number>(0);
  const [facebook , setFB] = useState(false);
  const [instagram , setInstagram] = useState(false);
  const [twitter , setTwitter] = useState(false);
  const [linkedin , setLinkedin] = useState(false);
  const [isOpen,setOpen] = useState<boolean>(false);
  const [organizationData,setOrganizationData] = useState<OrganizationResponse[]>([]);
  const [title,setTitle] = useState<string>('');
  const hasMounted = useRef(false);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (!hasMounted.current) {
      getConnection();
      hasMounted.current = true;
    }
  },[])

  useEffect(() => {
    const param = searchParams.get('isSuccess');
    const access_token = searchParams.get('encrypted_access_token');
    const refresh_token = searchParams.get('refresh_token');
    const refresh_expire = searchParams.get('refresh_token_expire_in');
    const token_expire = searchParams.get('expires_in');

    if(access_token) setToken(access_token)
    if(refresh_token) setRefreshToken(refresh_token)
    if(refresh_expire) setRefreshExpire(refresh_expire)
      if(token_expire) setTokenExpire(token_expire)
    setSuccess(param);
    checkConnected();
  }, [isSuccess]);

  const callSocialMedia = async(type: number) => {
    localStorage.setItem(LocalStorageType.SOCIAL_TYPE,JSON.stringify(type))
    
    if(type == SocialMedia.FACEBOOK){
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.facebookPageSignIn}`;
    }

    if(type == SocialMedia.TWITTER){
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.twitterSignIn}${parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')}`;
    }


    if(type == SocialMedia.LINKEDIN){
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.linkedinSignIn}`;
    }

    if(type == SocialMedia.INSTAGRAM){
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.instagramSignIn}`;
    }
  }

  const checkConnected = () => {
    setType(parseInt(localStorage.getItem(LocalStorageType.SOCIAL_TYPE) ||''));
    if(isSuccess == 'true'){

      if(type == SocialMedia.FACEBOOK ){
        getOrganization();
        setTitle('Connect a Facebook Page')
      }

      if(type == SocialMedia.TWITTER){
        setTwitter(true)
      }

      if(type == SocialMedia.LINKEDIN){
        getOrganization();
        setTitle('Connect a LinkedIn Profile')
      }
  
      if(type == SocialMedia.INSTAGRAM){
        getOrganization();
        setTitle('Connect a Instagram Profile')
      }
    }else{
    
    }
  }

  const disconnectAccount = async(type:number) => {
    setConfirmOpen(true);
    setType(type);
  }

  const confirmDisconnect = async() => {
    setIsLoading(true);
    const obj  = {
      userId: parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''),
      platform: type
    }
    const response : ApiResponse<[]> = await disconnectSocial(obj);
    if(response?.IsSuccess){
      setIsLoading(false);
      toast.success(response?.Data, {position: "top-right"});
      if(type == SocialMedia.FACEBOOK ){
        setFB(false)
      }

      if(type == SocialMedia.TWITTER){
        setTwitter(false)
      }

      if(type == SocialMedia.LINKEDIN){
        setLinkedin(false)
      }
  
      if(type == SocialMedia.INSTAGRAM){
        setInstagram(false)
      }
    }else{
      toast.error(response?.Data, {position: "top-right"});
      setIsLoading(false);
    }
  }

  const getConnection = async() => {
    setIsLoading(true);
    const response : ApiResponse<LinkSocialResponseType> = await getUserSocialLinks(localStorage.getItem(LocalStorageType.USER_ID) || '');
    if(response?.IsSuccess && response.Data.length > 0){
     
      context.setSidebarAccess(true);
      localStorage.setItem(LocalStorageType.SIDEBAR_ACCESS,JSON.stringify(true))
      response.Data.forEach((element:LinkSocialResponse) => {
        if(element.platform == SocialMedia.TWITTER && element.encrypted_access_token){
          setTwitter(true)
        }

        if(element.platform == SocialMedia.FACEBOOK && element.encrypted_access_token){
          setFB(true)
        }

        if(element.platform == SocialMedia.INSTAGRAM && element.encrypted_access_token){
          setInstagram(true)
        }

        if(element.platform == SocialMedia.LINKEDIN && element.encrypted_access_token){
          setLinkedin(true)
        }
      });
      // if(response.Data.length == 1){
        // handleSubscription();
      // }
      setIsLoading(false);
    }else{
      setIsLoading(false);
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
    }
  }

  const getOrganization = async() => {
    setIsLoading(true);
    const response : ApiResponse<OrganizationResponse[]> = await getOrganizationList(localStorage.getItem(LocalStorageType.USER_ID) || '',type,token);
    
    if(response.IsSuccess && response.Data){
      setIsLoading(false);
      if(response.Data.length > 1){
        setOpen(true);
        setOrganizationData(response.Data)
      }else{
        handlePopupSubmit(response.Data[0],type)
      }
    
    }else{
      setIsLoading(false);
    }
  }

  const handleClosePopup = () => {
    setOpen(false);
  }

  const handlePopupSubmit = async(selected:OrganizationResponse, type:number) => {
    setIsLoading(true);
    let obj;
    if(type == SocialMedia.LINKEDIN){
       obj = {
        userId :parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''),
        pageId : selected.pageId, 
        isPage: selected.isPage,
        platform: type,
        logoUrl:selected.logoUrl,
        inkedInTokenParamDto: {
          encrypted_access_token:token,
          refresh_token:refreshToken,
          refresh_token_expire_in:refreshExpire,
          expires_in:tokenExpire
        }
      }
    }else{
       obj = {
        userId :parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''),
        pageId : selected.pageId, 
        isPage: selected.isPage,
        platform: type,
        logoUrl:selected.logoUrl
      }
  
    }
    
    const response : ApiResponse<[]> = await selectPage(obj);
    console.log('response organization',response)
    if(response.IsSuccess){
      toast.success(response?.Data, {position: "top-right"});
      setOpen(false);
      setIsLoading(false);
      getConnection();
    }else{
      toast.error(response?.Data, {position: "top-right"});
      setIsLoading(false);
      setOpen(false);
    }
  }

  const handleClose = () => {
    setConfirmOpen(false);
  }

  const handleDisconnect = (type :string) => {
    if(type ===  CommonWords.YES){
      setConfirmOpen(false);
      confirmDisconnect()
   }else{
     setConfirmOpen(false);
   }
  }

  // const handleSubscription = async() => {
  //   setIsLoading(true);
  //   const response : ApiResponse<[]> = await trialSubscription(parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''));
  //   if(response?.IsSuccess){
  //     setIsLoading(false);
  //   }else{
  //     setIsLoading(false);
  //     if(response.StatusCode == ErrorCode.UNAUTHORISED){
  //       logoutFn();
  //     }
  //   }
  // }

  const logoutFn = async() => {
    localStorage.clear();
    router.push(navigations.login)
    await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '')
  }

  return (  
    <div>
      <div className="content px-6 py-6 lg:py-10 ">
           {/* bussiness profile */}
           <div className="mb-10">
           <h2 className="py-2 px-3 text-themeblue text-base leading-7 font-normal  border-0 border-b-2 border-b-themeblue w-max m-auto">Link Socials</h2>

         </div>
         <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 max-w-[204px] sm:max-w-[460px] lg:max-w-[880px] m-auto  md:gap-6">
           <div className="sm:col-span-1">
             <div className={`flex flex-col gap-2 p-3 rounded-lg h-full ${facebook ? 'bg-[#004bde1f] ': 'bg-[#FAFBFF]'}`} >
                <div className="flex items-center justify-center text-center h-16 w-16 rounded-full overflow-hidden mx-auto shadow-[0px_4px_12px_0px_#0000000D] p-3 bg-white;">
                  <img src="../assets/icons/1.svg" alt="facebook" />
               </div>
               <p className="mt-1  text-center text-[#323232]">Facebook</p>
               <p className="mb-4 border-b border-[#F3F3F3] text-center text-[#323232] font-semibold">{facebook ? 1 : 0}/1</p>
                {facebook ? 
                <a  onClick={() => disconnectAccount(SocialMedia.FACEBOOK)}  className="disconnect-btn">Disconnect Page</a> 
                :  
                <a  onClick={() => callSocialMedia(SocialMedia.FACEBOOK)}  className="connect-btn">Connect Page</a>}
               
             </div>
           </div>

           <div className="sm:col-span-1">
             <div  className={`flex flex-col gap-2 p-3 rounded-lg h-full ${instagram ? 'bg-[#004bde1f] ': 'bg-[#FAFBFF]'}`} >
              <div className="flex items-center justify-center text-center h-16 w-16 rounded-full overflow-hidden mx-auto shadow-[0px_4px_12px_0px_#0000000D] p-3 bg-white;">
                <img src="../assets/icons/2.svg" alt="instagram" />
              </div>
               <p className="mt-1  text-center text-[#323232]">Instagram</p>
               <p className="mb-4 border-b border-[#F3F3F3] text-center text-[#323232] font-semibold">{instagram ? 1 : 0}/1</p>
               {instagram ?  <a  onClick={() => disconnectAccount(SocialMedia.INSTAGRAM)}  className="disconnect-btn">Disconnect Profile</a> :  <a  onClick={() => callSocialMedia(SocialMedia.INSTAGRAM)}  className="connect-btn">Connect Profile</a>}
              
             </div>
           </div>

           <div className="sm:col-span-1">
             <div  className={`flex flex-col gap-2 p-3  rounded-lg h-full ${twitter ? 'bg-[#004bde1f] ': 'bg-[#FAFBFF]'}`}>
               <div className="flex items-center justify-center text-center h-16 w-16 rounded-full overflow-hidden mx-auto shadow-[0px_4px_12px_0px_#0000000D] p-3 bg-white;">
               <img src="../assets/icons/4.svg" alt="twitter" />
               </div>
               <p className="mt-1 text-center text-[#323232]">Twitter</p>
               <p className="mb-4 border-b border-[#F3F3F3] text-center text-[#323232] font-semibold">{twitter ? 1 : 0}/1</p>
              {twitter ?  <a onClick={() => disconnectAccount(SocialMedia.TWITTER)} className="disconnect-btn">Disconnect Profile</a> :  <a onClick={() => callSocialMedia(SocialMedia.TWITTER)} className="connect-btn">Connect Profile</a>}
              
             </div>
           </div>

           <div className="sm:col-span-1">
             <div  className={`flex flex-col gap-2 p-3 rounded-lg h-full ${linkedin ? 'bg-[#004bde1f] ': 'bg-[#FAFBFF]'}`} >
               <div className="flex items-center justify-center text-center h-16 w-16 rounded-full overflow-hidden mx-auto shadow-[0px_4px_12px_0px_#0000000D] p-3 bg-white;">
               <img src="../assets/icons/3.svg" alt="linkedin" />
               </div>
               <p className="mt-1 text-center text-[#323232]">LinkedIn</p>
               <p className="mb-4 border-b border-[#F3F3F3] text-center text-[#323232] font-semibold">{linkedin ? 1 : 0}/1</p>
               <div className="flex flex-col gap-2">
                  {linkedin ? <a onClick={() => disconnectAccount(SocialMedia.LINKEDIN)} className="disconnect-btn">Disconnect Profile</a>
                  : <a onClick={() => callSocialMedia(SocialMedia.LINKEDIN)} className="connect-btn">Connect Profile</a>
                  }
              </div>
             </div>
           </div>


         </div>
       </div>
         {/* model    */}
         {isOpen && 
          <OrganizationPopup
            onSendData={handleClosePopup}
            showModal={isOpen}
            title={title}
            data ={organizationData || []} 
            type={type}
            onSubmit={handlePopupSubmit}>
          </OrganizationPopup> } 
        {/* model    */}

           {/* model    */}
           <ConfirmationPopup
                   showModal={isConfirmOpen} 
                    type={PageConstant.LINK_SOCIAL} onSendData={handleDisconnect} onCloseModel={handleClose}>
        </ConfirmationPopup>
      {/* model    */}
    </div>
  );
};

export default LinkSocial;