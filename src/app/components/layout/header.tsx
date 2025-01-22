"use client";
import React, { useContext, useEffect, useState } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    Button,
    DropdownItem
  } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/app/constants/user-profile-dropdown";
import { DataContextResponseType, DropDownType, NotificationList, NotificationListType, UserData } from "@/app/shared/dataPass";
import { DataContext } from "@/app/context/shareData";
import { ErrorCode, LocalStorageType } from "@/app/constants/pages";
import { getInteractions, readInteractions } from "@/app/services/user-service";
import { ApiResponse } from "@/app/shared/response/apiResponse";
import moment from "moment";
import { logout } from "@/app/services/auth-service";
import navigations from "@/app/constants/navigations";
import { useLoading } from "@/app/context/LoadingContext";

const Header: React.FC = () => {

    const context = useContext(DataContext);

    if (!context) {
        throw new Error('DataContext must be used within a DataProvider');
    }
    const details : DataContextResponseType = context.sharedData;

    const router = useRouter();
    const [userData , setUserData] = useState<UserData | null>(null);
    const [show , setShow] = useState<boolean>(false);
    const [notificationType , setNotificationType] = useState<boolean>(false);
    const [unReadList , setUnreadListShow] = useState<NotificationListType>([]);
    const [allRead , setAllRead] = useState<boolean>(false);
    const [badge , setBadge] = useState<number>();
    const { setIsLoading } = useLoading();
    const handleSelection  = async (e:DropDownType) => {
        
        if(e.value == 4){
            logoutFn()
            router.refresh();
        }else{
            router.push(e.navigation)
        }
       
        }

    const getUserData = async() =>{
            const response = JSON.parse(localStorage.getItem(LocalStorageType.USER_DETAILS) || '');
            if(response){
                setUserData(response);
            }
    }

    useEffect(() => {
        if(details && details.data){
            const userData = (details.data as UserData) || null;
            setUserData(userData)
        }else{
            getUserData();
        }
    }, [details]);
    
    const handleToggleSidebar = () => {
        context.setMobileSidenav(true)
    }

    const handleNotification = () => {
        setShow(!show);
    }

    const readNotification = async(id?:string) => {
        const obj = {
            userId: parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''),
            isAllRead: allRead
        }
        const response: ApiResponse<[]> = await readInteractions((id ? id : ''),obj);
        if (response?.IsSuccess) {
            getNotification();
        } else {
          if (response.StatusCode === ErrorCode.UNAUTHORISED) {
            logoutFn();
          }
        }
    }

    const handleAllRead = () =>{
        setAllRead(true);
        readNotification();
    }
    
    const getNotification = async() => {
        const response: ApiResponse<NotificationListType> = await getInteractions(parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''),notificationType);
        if (response?.IsSuccess && response?.Data) {
            setUnreadListShow(response.Data)
            if(!notificationType){
                if(response.Data.length > 0){
                    setBadge(response.Data.length)
                }
            }
        } else {
          if (response.StatusCode === ErrorCode.UNAUTHORISED) {
            logoutFn();
          }
        }
    }

    useEffect(() => {
        
    
    
        // Fetch data immediately
        getNotification();
    
        // Set up interval to call API every minute
        const intervalId = setInterval(() => {
            getNotification();
        }, 60000); // 60000 ms = 1 minute
    
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
      }, [notificationType]);

      const logoutFn = async() => {
        const response : ApiResponse<[]>  = await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '');
        if(response?.IsSuccess){
              setIsLoading(false);
              localStorage.clear();
              router.push(navigations.login)
        }else{
              setIsLoading(false);
              if(response.StatusCode == ErrorCode.UNAUTHORISED){
                logoutFn();
              }
        }
      }

  return (
   
        <div className="header w-full px-6 py-2 shadow-[0px_2px_4px_0px_#00000040]  md:shadow-[0px_1px_9px_0px_#C0C0C040] relative flex h-16 items-center justify-end">
           {!context.mobileSidenav && 
           <div className="flex me-auto md:hidden" onClick={handleToggleSidebar}>
                <img src="../../assets/icons/sidebar-icons/menu-toggle-btn.svg" alt="menu-toggle" />
            </div>
           } 
            <ul className="flex items-center gap-6">
                {/* <li>
                    <a href="#">
                    <img src="../../assets/icons/bx-grid-thumb.svg" alt="thumb-grid" />
                    </a>
                </li> */}
                <li>
                   <div className="relative cursor-pointer">
                 
                  <div className="relative"  onClick={handleNotification}>
                  {(badge && badge > 0 )&&  <span className="absolute -top-1.5 -right-1 z-10 h-5 w-5 min-w-4 flex items-center justify-center text-xs text-white bg-[#F04E4E] rounded-full">{badge}</span>}
                  <a className="relative">
                    <img src="../../assets/icons/notification-icon.svg" alt="notification" />
                   
                    </a>
                  </div>
                    {show && <div className="absolute mt-2.5 right-0 min-w-52 sm:min-w-80 shadow-medium rounded-lg z-10">
                        <div className="p-3 pt-4 bg-white rounded-lg">
                            <div className="flex items-center justify-between w-full">
                            <h4 className="page-title">
                                Notifications
                                
                            </h4>
                            {!notificationType ?  
                                <a className="ml-auto text-sm text-themeblue underline" onClick={() => setNotificationType(true)}>Read</a>
                                : 
                                <a className="ml-auto text-sm text-themeblue underline" onClick={() => setNotificationType(false)}>UnRead</a>
                            }
                           
                            </div>
                            <ul className="max-h-48 w-full overflow-y-auto flex flex-wrap gap-2 my-3 header-notification-list">
                                {
                                    unReadList &&
                                        unReadList.map((item: NotificationList) => (
                                            <div key={item.id}>
                                            {!notificationType ? 
                                                    <li className={`w-full border-b border-[#f3f3f3] py-2 unread-list  cursor-pointer`}  onClick={() => readNotification(String(item.id))}>
                                                        <h5 className="text-sm text-textdark-900">{item.content}</h5>
                                                        <p className="text-[#32475C99] text-xs">{moment(item.created_at).fromNow()}</p>
                                                    </li>
                                                    :
                                                    <li className={`w-full border-b border-[#f3f3f3] py-2 cursor-default`} >
                                                        <h5 className="text-sm text-textdark-900">{item.content}</h5>
                                                        <p className="text-[#32475C99] text-xs">{moment(item.created_at).fromNow()}</p>
                                                    </li>
                                                }
                                                </div>
                                      
                                    ))
                                }
                            </ul>
                            <div className="flex justify-between items-center">
                                {!notificationType && <a className="text-textlight underline hover:text-themeblue text-sm" onClick={() =>handleAllRead()}>Mark all as read</a>}
                                <a className="text-[#F04E4E] hover:opacity-80 text-sm ml-auto" onClick={() => setShow(false)}>Close</a>
                            </div>
                        </div>
                    </div>}
                   </div>
                </li>
                <li>
                    {/* <a href="#">
                    <div className="w-10 h-10 rounded-full  relative">
                        <img src="https://i.pravatar.cc/150?img=32" className="h-full w-full object-cover rounded-full " />
                        <div className="absolute bottom-0 right-0">
                        <img src="../assets/icons/active-dot.svg" alt="logo" />
                        </div>
                    </div>
                    </a> */}

                    {/* dropdown */}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="bordered" className="outline-none border-0 bg-transparent px-0 min-w-fit">
                            <div className="w-10 h-10 rounded-full relative">
                                {userData && !userData.profilePicture && (
                                <img
                                    src="/assets/icons/default-user.svg"
                                    className="h-full w-full object-cover rounded-full"
                                    alt="Default User"
                                />
                                )}
                                {userData && userData.profilePicture && (
                                <img
                                    src={userData.profilePicture}
                                    alt="User Image"
                                    className="h-full w-full object-cover rounded-full"
                                />
                                )}
                                <div className="absolute bottom-0 right-0">
                                <img src="/assets/icons/active-dot.svg" alt="Active status dot" />
                                </div>
                            </div>
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu aria-label="Static Actions" className="p-2 bg-white">
                        {/* <DropdownItem className="text-[#323232] text-md font-normal p-2 rounded-lg bg-white">
                            👋 Hey {userData ? userData.name : 'User'}
                        </DropdownItem> */}
                       {UserProfile &&
                            UserProfile.map((item) => {
                                if (item.value === 0) {
                                return (
                                    <DropdownItem
                                    key={item.value}
                                    className="text-[#323232] text-md font-normal p-2 rounded-lg bg-white cursor-none"
                                    >
                                    <div className="inline-flex w-full items-center">
                                        👋 Hey {userData ? userData.name : "User"}
                                    </div>
                                    </DropdownItem>
                                );
                                } else {
                                return (
                                    <DropdownItem
                                    key={item.value}
                                    onClick={() => handleSelection(item)}
                                    className="border-t-1 border-[#F3F3F3] rounded-none text-[#323232] last:text-[#FB0E01] hover:last:text-[#FB0E01] text-sm font-normal px-2 py-3 last:pb-1 rounded-lg bg-white focus:bg-[#F5FDFF] hover:bg-[#F5FDFF]"
                                    >
                                    <div className="inline-flex w-full items-center">
                                        {item.icon && (
                                        <img
                                            width={24}
                                            height={24}
                                            src={`/assets/icons/${item.icon}`}
                                            alt="User Icon"
                                            className="mr-2"
                                        />
                                        )}
                                        {item.name}
                                    </div>
                                    </DropdownItem>
                                );
                                }
                            })}

                           
                        </DropdownMenu>
                    </Dropdown>
                </li>
            </ul>
        </div>

  );
};

export default Header;