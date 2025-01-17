'use Client';
import { LocalStorageType } from "../constants/pages";
import { ApiResponse } from "../shared/response/apiResponse";

export const apiGet = async <T = unknown>(
  endpoint: string,
  params?: string,
): Promise<ApiResponse<T>> => {
  let config: RequestInit;

  if (localStorage.getItem(LocalStorageType.ACCESS_TOKEN)) {
    config = {
      method: "GET",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(LocalStorageType.ACCESS_TOKEN)}`,
      },
    };
  } else {
    config = {
      method: "GET",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}${endpoint}${params || ""}`,
      config
    );

    if (!response.ok) {
      return response.json();
    }

    const data = await response.json();

    // Return the data in all other cases
    return data as ApiResponse<T>;
  } catch (error) {
    // Return a consistent error response
    console.log('error =>',error);
    
    return {
      StatusCode: 500,
      Data: null as unknown as T,
      Message: "An error occurred during the GET request.",
      IsSuccess: false,
    };
  }
};

export const apiPost = async <T = unknown>(
  endpoint: string,
  body: object,
  params?: string,
): Promise<ApiResponse<T>> => {
  let config: RequestInit;

  if (localStorage.getItem(LocalStorageType.ACCESS_TOKEN)) {
    config = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem(LocalStorageType.ACCESS_TOKEN)}`,
      },
      body: JSON.stringify(body),
    };
  } else {
    config = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}${endpoint}${params || ''}`,
      config
    );

    if (!response.ok) {
      return response.json(); // Return the JSON response if not OK
    }

    const data = await response.json();
    return data as ApiResponse<T>; // Return the valid response data
  } catch (error) {
    console.log('error =>',error);
    
    // Return a consistent error response
    return {
      StatusCode: 500,
      Data: null as unknown as T,
      Message: "An error occurred during the POST request.",
      IsSuccess: false,
    };
  }
};


export const apiPostFormData = async <T = unknown>(
  endpoint: string,
  formData: FormData,
  params?: string,
): Promise<ApiResponse<T>> => {
  let config: RequestInit;

  if (localStorage.getItem(LocalStorageType.ACCESS_TOKEN)) {
    config = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(LocalStorageType.ACCESS_TOKEN)}`,
      },
      body: formData,
    };
  } else {
    config = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      body: formData,
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}${endpoint}${params || ""}`,
      config
    );

    if (!response.ok) {
      return response.json();
    }
    const data = await response.json();
  
    // Return data in all other cases
    return data as ApiResponse<T>;
  } catch (error) {
    console.log('error =>',error);
    
    // Return a consistent error response
    return {
      StatusCode: 500,
      Data: null as unknown as T,
      Message: "An error occurred during the POST request.",
      IsSuccess: false,
    };
  }
};

