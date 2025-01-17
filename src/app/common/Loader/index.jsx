const Loader = ({ className = "", size = "sm", fullLoader=false}) => {
  /**
     @param className extra class 
     @param size size list - {sm : 'h-5 w-5', md: 'h-12 w-12' , lg: 'h-16 w-16'}
     @param fullLoader fullLoader is to set loader in full screen
     @returns loader
   */

  const CLASS_AS_PER_SIZE = new Map([
    ["sm", "h-5 w-5"],
    ["md", "h-12 w-12"],
    ["lg", "h-16 w-16"],
  ]);

  return (
    <div className={`flex items-center justify-center dark:bg-black ${fullLoader ? 'h-screen':''}`}>
      <div className={`animate-spin rounded-full border-4 border-solid border-primary border-t-transparent ${CLASS_AS_PER_SIZE?.get(size)} ${className}`}></div>
    </div>
  );
};

export default Loader;
