"use client";
import React, { useContext,useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {Menu ,LowerMenu} from '../../constants/sidebar';
import { SidebarType } from "@/app/shared/dataPass";
import { DataContext } from "@/app/context/shareData";
import { Tooltip } from "@nextui-org/react";
import { LocalStorageType } from "@/app/constants/pages";
import navigations from "@/app/constants/navigations";

const SideBar: React.FC = () => {
  const context = useContext(DataContext);

  if (!context) {
      throw new Error('DataContext must be used within a DataProvider');
  }
  const sidenavShow : boolean = context.mobileSidenav;
  const accessSidebar : boolean = localStorage.getItem(LocalStorageType.SIDEBAR_ACCESS) ? JSON.parse(localStorage.getItem(LocalStorageType.SIDEBAR_ACCESS) || '') : context.getSidebarAccess ;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isActive , setActive] = useState<number | null>(localStorage.getItem('ActiveSidebar') ? parseInt(localStorage.getItem('ActiveSidebar') || '') : null);
  const [isLowerActive , setLowerActive] = useState<number | null>(localStorage.getItem('LowerActiveSidebar') ? parseInt(localStorage.getItem('LowerActiveSidebar') || '') : null);
  const [MenuDetail , setMenu] = useState<SidebarType[]>([]);
  const [LowerMenuDetails , setLowerMenu] = useState<SidebarType[]>([]);
  const router = useRouter();

  useEffect(() => {
    router.prefetch(navigations.postHistory);
    router.prefetch(navigations.approvalQueue);
    router.prefetch(navigations.dashboard);
    router.prefetch(navigations.socialLinks);
    router.prefetch(navigations.eventCalendar);
    router.prefetch(navigations.userSupport);
  }, []);

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar visibility
    
  };

  const handleNavigation = async(menu:SidebarType,index:number) =>{
      router.push(menu.navigation);
      setActive(index);
      localStorage.setItem('ActiveSidebar', JSON.stringify(index));
      setLowerActive(null)
      localStorage.removeItem('LowerActiveSidebar')
  }

  const handleAssignMenu = () => {
    if (MenuDetail.length === 0) {
      setMenu(Menu);
    }

    if (LowerMenuDetails.length === 0) {
      setLowerMenu(LowerMenu);
    }
  }

  const handleLowerNavigation = async(menu:SidebarType,index:number) =>{
    router.push(menu.navigation);
    setLowerActive(index);
    localStorage.setItem('LowerActiveSidebar', JSON.stringify(index))
    setActive(null)
    localStorage.removeItem('ActiveSidebar')
}
  useEffect(() => {
    handleAssignMenu();
  },[])

  useEffect(() => {
    
  },[isActive,isLowerActive])

  const handleToggleMobileSidebar = () => {
    context.setMobileSidenav(false)
  }

  // const getLinkForManageSubscription = async() =>{
  //   setIsLoading(true);
  //   const response : ApiResponse<ManageSubscription>  = await getLink(parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''));
  //   if(response?.IsSuccess){
  //       window.open(response.Data.url, "_blank", "noopener,noreferrer");
  //         setIsLoading(false);
  //   }else{
  //         setIsLoading(false);
  //         if(response.StatusCode == ErrorCode.UNAUTHORISED){
  //           logoutFn();
  //         }
  //   }
  // }

 

  return (
    // className="sidebar-main  flex-1 max-w-60 bg-[#132E52] h-screen"
    <div className={`sidebar-main z-10 flex-1 max-w-60 h-screen bg-[#132E52] transition-all duration-300 ${isOpen ? "w-60" : "w-20"} ${sidenavShow && 'active'}` }>
      
        <div>
          {!sidenavShow ?  
            <div className="cursor-pointer absolute -right-4 top-3" onClick={handleToggleSidebar}>
                {!isOpen && <img src="../../assets/icons/sidebar-icons/open-sidenav.svg" alt="handle" />}
                {isOpen && <img src="../../assets/icons/sidebar-icons/close-sidenav.svg" alt="handle" />}
            </div>
            
          :
          <div className="cursor-pointer absolute right-2 top-4" onClick={handleToggleMobileSidebar}>
            <img  src="../../assets/icons/sidebar-icons/close.svg" alt="handle" />
          </div>
          }
           
            <div className="px-4 py-1 w-full">
            {isOpen && <img src="../../assets/images/logo-white.png" alt="logo" />}
            {!isOpen && <img src="../../assets/images/small-logo.png" className="mt-3 mx-auto" alt="logo" />}
            </div>
            <div className="pt-6 w-full px-2 h-[calc(100vh-65px)] overflow-y-auto flex flex-col justify-between">
              <ul className="flex flex-col text-white gap-1">
              {MenuDetail.map((item, index) => (
                  <li className="" key={item.value}>
                    { accessSidebar ? 
                      <a onClick={() => handleNavigation(item,index)}
                        className={`cursor-pointer py-3 px-4 flex items-center   gap-4 rounded-md hover:bg-[#374C69] ${isActive === index ? 'bg-themeblue' : ''} ${!isOpen ? 'justify-center':''}`}>
                            <img src={`../../assets/icons/sidebar-icons/${item.icon}`} alt={item.name} />
                            {isOpen && item.name}
                      </a>
                      :
                      <div>
                         {isActive == index ?  
                          <a onClick={() => handleNavigation(item,index)}
                              className={`cursor-pointer py-3 px-4 flex items-center   gap-4 rounded-md hover:bg-[#374C69] ${isActive === index ? 'bg-themeblue' : ''} ${!isOpen ? 'justify-center':''}`}>
                              <img src={`../../assets/icons/sidebar-icons/${item.icon}`} alt={item.name} />
                              {isOpen && item.name}
                          </a>
                        :
                          <Tooltip color="default" delay={100} offset={-13} content="Please link your social account for access!">
                            <a className={`py-3 px-4 flex items-center gap-4 rounded-md  ${!isOpen ? 'justify-center':''}`}>
                                  <img src={`../../assets/icons/sidebar-icons/${item.icon}`} alt={item.name} />
                                  {isOpen && item.name}
                            </a>
                          </Tooltip>}
                      </div>
                    }
                      
                  </li>
              ))}
              
              
              </ul>
        
              <div className="px-1 py-4">
                {/* update subscription promo */}
                {/* {isOpen &&  
                  <div className="bg-themeblue rounded-xl py-4 px-3 text-center text-white font-Montserrat mb-3 max-[767px]:hidden">
                    <h4 className="text-xl xl:text-2xl leading-9 font-medium">
                    Upgrade to PRO
                    </h4>
                    <p className="text-sm font-normal mb-4">
                    Improve your development process and start doing more with Horizon UI PRO!
                    </p>
                    <button type="button" onClick={getLinkForManageSubscription} className="bg-white text-themeblue text-base rounded-lg  font-medium p-2 w-full">Upgrade to PRO</button>
                  </div>
                }   */}
                {/* update subscription promo */}
            <ul className="flex flex-col text-white gap-1">
                {LowerMenuDetails.map((item, index) => (
                    <li className="" key={item.value}>
                        {
                          accessSidebar ? 
                            <a onClick={() => handleLowerNavigation(item,index)} className={`cursor-pointer py-3 px-4 flex items-center gap-4 rounded-md hover:bg-[#374C69] ${isLowerActive === index ? 'bg-themeblue' : ''} ${!isOpen ? 'justify-center':''}`}>
                              <img src={`../../assets/icons/sidebar-icons/${item.icon}`} alt={item.name} />
                              {isOpen && item.name}
                            </a>
                            :
                            <div>
                              {isLowerActive == index ?
                                <a onClick={() => handleLowerNavigation(item,index)} className={`cursor-pointer py-3 px-4 flex items-center gap-4 rounded-md hover:bg-[#374C69] ${isLowerActive === index ? 'bg-themeblue' : ''} ${!isOpen ? 'justify-center':''}`}>
                                  <img src={`../../assets/icons/sidebar-icons/${item.icon}`} alt={item.name} />
                                  {isOpen && item.name}
                                </a>
                                :
                                <Tooltip color="default" delay={100} placement="bottom-end" content="Please link your social account for access!">
                                  <a className={`py-3 px-4 flex items-center gap-4 rounded-md`}>
                                    <img src={`../../assets/icons/sidebar-icons/${item.icon}`} alt={item.name} />
                                    {isOpen && item.name}
                                  </a>
                                </Tooltip>
                              }
                            </div>
                        }
                    </li>
                ))}
              </ul>
            </div>
            </div>
        </div>
      
    </div>
  );
};

export default SideBar;