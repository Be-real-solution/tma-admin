import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./use-auth";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import Content from "src/Localization/Content";

export default function useFetcher() {
  const router = useRouter();
  const auth = useAuth();
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
     const isAuthenticated = JSON.parse(window.sessionStorage.getItem("authenticated")) || false;

   const { lang } = useSelector((state) => state.localiztion);
   const { localization } = Content[lang];

  
  
  const fetchData = async (url, type) => {
    setLoading(true);
    // setError(null);

    try {
     const response = await fetch(BaseUrl + url, {
       headers: {
         method: "GET",
         "Authorization": `Bearer ${isAuthenticated}`,
          "Accept-Language":lang,
       },
     });
     const json = await response.json();

     if (response.status === 401) {
      auth.signOut();
      router.push("/auth/login");
    }

      if (json.status === 200) {
        
       if (type && type === "mobile") {
         setData((prevData) => ({
           ...prevData,
           [url]: json,
         }));
       }
       else {
         setData((prevData) => ({
         ...prevData, 
         [url]: json.data,
       }));
       }
     } else {
         addToast(json.errorMessage, { appearance: "error", autoDismiss: true });
       setError(json.errorMessage);
     }
    } catch (error) {
      setError(error.message);
         addToast(error.message, { appearance: "error", autoDismiss: true });

    } finally {
      setLoading(false);
    }
  };
  
  const createData = async (url, newData, method, callback, onFinish) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(BaseUrl + url, {
        method: method || "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${isAuthenticated}`,
          "Accept-Language": lang,
        },
        body: JSON.stringify(newData),
      });


      const json = await response.json();
if (response.status === 401) {
  auth.signOut();
  router.push("/auth/login");
}
      if (!response.ok) {
        throw new Error(json.message);
        
      }
      if (json.status) {
        if (callback && typeof callback === "function") {
          callback();
        }
        addToast(json.message || (method === "POST" ? localization.alerts.added : localization.alerts.edited), { appearance: "success", autoDismiss: true });

      } else {
        setError(json.message);
        addToast(json.message, { appearance: "error", autoDismiss: true });

      }
      // Optional: You can update the fetched data here if needed
      //   fetchData(url);
    } catch (error) {
      setError(error.message);
        addToast(error.message, { appearance: "error", autoDismiss: true });

    } finally {
      onFinish &&  onFinish()
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData, createData };
}
