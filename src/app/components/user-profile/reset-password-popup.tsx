"use client";
import React, { memo, useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import { forgotPassword } from "../../services/auth-service";
import VerificationInput from "react-verification-input";
import { LengthConstant } from "../../constants/pages";
import Countdown from 'react-countdown';
import { UserData } from "@/app/shared/dataPass";
interface ResetPasswordPopupProps {
    showModal: boolean;
    title: string;
    data : UserData;
    onSendData: (data: string) => void; // Prop to handle close action
    onSubmit: (email:string,password:string,code :string) => void;
  }

const ResetPasswordPopup: React.FC<ResetPasswordPopupProps> = ({ showModal, title, data, onSendData, onSubmit }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);
    const [code, setCode] = useState("");
    // const [errors, setErrors] = useState<ErrorType>({});
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const [isCPasswordTouched, setIsCPasswordTouched] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [cPasswordError, setCPasswordError]= useState("");
    const [touched, setTouched] = useState(false);
   
    const [isExpired, setExpired] = useState(true);
  
    const [expirationTime, setExpirationTime] = useState<number>(Date.now() + 60000); // Store expiration time

   
        useEffect(() => {
            handleVefiyCode();
        },[]);
        
        useEffect(() => {
            validateInputs();
            if (touched) {
                const error ='';
                if(!code){
                    // setErrors({ code: error });
                    setIsButtonDisabled(!code || !!error);
                }
            } else {
              setIsButtonDisabled(true);
            }
        }, [ password, confirmPassword,code, touched]);

    const handleVefiyCode = async () => {
      setExpired(true);
      setExpirationTime(Date.now() + 60000);
        if(data && data.email){
          await forgotPassword(data.email);
        }
         
    };
 
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data.email, password ,code);
    };
  
    const handlePasswordChange = (e: string) => {
      setPassword(e);
      setIsPasswordTouched(true);
      handleDisabled();
    };
  
    const handleConfirmPasswordChange = (e: string) => {
      setConfirmPassword(e);
      setIsCPasswordTouched(true);
      handleDisabled();
    };

    const handleCodeChange = (e:string) => {
        handleDisabled();
        setCode(e);
        if (!touched) setTouched(true);
      
    };

    const handleDisabled = () => {
        if (password === confirmPassword) {
          if((code != '' && code.length == LengthConstant.OTPLength) && password != '' && confirmPassword != ''){
              setIsButtonDisabled(false);
          }else{
              setIsButtonDisabled(true);
          }
        } else {
          setIsButtonDisabled(true);
        }
    }
  
    const validatePassword = (password: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      return passwordRegex.test(password);
    };
  
  
    const validateInputs = () => {
      let isValid = true;
  
      if (password === "") {
        setPasswordError("Password is required.");
        isValid = false;
      } else if (!validatePassword(password)) {
        setPasswordError(
          "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
        );
        isValid = false;
      } else {
        setPasswordError("");
      }
  
      if (confirmPassword === "") {
        setCPasswordError("Confirm Password is required.");
        isValid = false;
      } else if (!validatePassword(password)) {
        setCPasswordError(
          "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
        );
        isValid = false;
      } else {
        setCPasswordError("");
      }
  
      setIsButtonDisabled(!isValid);
    };
  
    const checkPassword = () =>{
      if(!passwordError && !cPasswordError){
        if (password === confirmPassword) {
            setCPasswordError("");
        } else {
            setCPasswordError("Password and Confirm Password should be same"); 
        }
      }
      handleDisabled();
    }

    const closeModal = () => {
        onSendData('false');
    };

    const handleComplete = () => {
      setExpired(false);
    };

  
  return (
    <div>
        <>
            <Modal isOpen={showModal}  placement={"center"}  onClose={closeModal}>
            <ModalHeader className="flex flex-col px-6 text-[#323232]">
                  {title}
            </ModalHeader>
            <ModalContent className="max-w-[565px] reset-password-modal py-2">
            {(
                <>
                    <form action="" >
                        <ModalHeader className="flex flex-col px-8 md:px-6">
                            <div className=" text-xl leading-8 font-medium capitalize md:text-left text-center text-[#323232]">
                                {title}
                            </div>
                        </ModalHeader>
                        <ModalBody className="md:px-6 px-4">
                            <div>
                                {/* <p>Please check you registered mail for verification code.</p> */}
                                <div className="flex flex-col w-full relative mb-3">
                                    <label
                                    htmlFor="code"
                                    className="text-black/85 text-sm bg-white font-normal mb-3">
                                    Please check you registered mail for verification code.
                                    </label>
                                    <VerificationInput classNames={{
                                    container: "verify-input-container",
                                    character: "verify-input",
                                    characterInactive: "character--inactive",
                                    characterSelected: "character--selected",
                                    characterFilled: "character--filled",
                                    }} value={code} 
                                    onChange={(e) => {
                                    const data =  e ? e  : '';
                                    handleCodeChange(data)}}
                                    placeholder="" validChars="0-9" inputProps={{ inputMode: "numeric" }} length={6}/>
                                </div>
                                {isExpired && 
                                <div className="code-counter flex justify-end">
                                      <Countdown
                                        date={expirationTime} // 1 minutes from now
                                        renderer={({ seconds }) => {
                                            return (
                                              <span>
                                                 <p>Your Code expires in:{seconds}</p>
                                              </span>
                                            );
                                        }}
                                        onComplete={handleComplete}
                                      />
                                    </div>
                                }
                                {!isExpired &&
                                   <div className="flex justify-end w-full relative" >
                                    <div className="flex h-6 items-center gap-3">
                                      <p className="text-textdark-900 font-normal text-sm leading-6 text-center">
                                          Didn`t receive the code?{" "}
                                          <a onClick={handleVefiyCode} className="text-themeblue cursor-pointer">
                                          Send Again
                                          </a>{" "}
                                      </p>
                                    </div>
                                  </div>
                                }
                               

                                {/* <h2 className="form-title my-1  py-4">Change Password</h2> */}
                                    <div className="flex flex-col w-full relative my-5">
                                        <label htmlFor="newpassword" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">New Password</label>
                                        <div>
                                        <input
                                            id="newpassword"
                                            name="newpassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            autoComplete="newpassword"
                                            value={password}
                                            onChange={(e) => {
                                            const data =  e.target.value ? e.target.value  : '';
                                            handlePasswordChange(data)}}
                                            className="form-custom-input"
                                            onBlur={() => setIsPasswordTouched(true)}
                                        />
                                        {isPasswordTouched && passwordError && (
                                            <span className="text-red-500 text-xs">
                                            {passwordError}
                                            </span>
                                        )}
                                        <div className="absolute right-3 top-3 cursor-pointer z-0" onClick={() => setShowPassword(!showPassword)}>
                                            {!showPassword && <img src="../../assets/icons/view-password-eye.svg" alt="password" />} 
                                            {showPassword && <img src="../../assets/icons/eye-off.svg" alt="password" />} 
                                        </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full relative">
                                        <label htmlFor="cpassword" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Confirm Password</label>
                                        <div>
                                        <input
                                            id="cpassword"
                                            name="cpassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            autoComplete="cpassword"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                            const data =  e.target.value ? e.target.value  : '';
                                            handleConfirmPasswordChange(data)}}
                                            className="form-custom-input"
                                            onBlur={checkPassword}
                                        />
                                        {isCPasswordTouched && cPasswordError && (
                                            <span className="text-red-500 text-xs">
                                            {cPasswordError}
                                            </span>
                                        )}
                                        <div className="absolute right-3 top-3 cursor-pointer z-0" onClick={() => setConfirmShowPassword(!showConfirmPassword)}>
                                            {!showConfirmPassword && <img src="../../assets/icons/view-password-eye.svg" alt="password" />} 
                                            {showConfirmPassword && <img src="../../assets/icons/eye-off.svg" alt="password" />} 
                                        </div>
                                        </div>
                                    </div>
                                    
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex items-center justify-between w-full md:gap-3 gap-2 md:px-20 sm:px-4 px-0">
                                <div className="flex justify-between w-full relative">
                                    <button type="button" onClick={handleReset} className={`theme-primary-btn my-0 ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isButtonDisabled}>Set New Password</button>
                                </div>
                            </div>
                           
                        </ModalFooter>
                    </form>
                </>
            )}
            </ModalContent>
            </Modal>
        </>
    </div>
   
   
  );
}

export default memo(ResetPasswordPopup);



