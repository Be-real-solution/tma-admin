import ChartBarIcon from '@heroicons/react/24/solid/QueueListIcon';
import CogIcon from "@heroicons/react/24/solid/CircleStackIcon";
import CarIcon from "@heroicons/react/24/solid/TruckIcon";
import PhoneIcon from "@heroicons/react/24/solid/DevicePhoneMobileIcon";
import RadioIcon from "@heroicons/react/24/solid/RadioIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserGroupIcon";

import BellIcon from "@heroicons/react/24/solid/BellIcon";

import QueueListIcon from "@heroicons/react/24/solid/BuildingStorefrontIcon";

import { SvgIcon } from '@mui/material';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
export function Items() {
  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];



  const items = [
    // {
    //   accessRole: [
    //     "owner",
    //     "tasischi",
    //     "moliyachi",
    //     "sotuvchi",
    //     "omborchi",
    //     "prorab",
    //     "taminotchi",
    //     "kassir",
    //   ],
    //   title: localization.sidebar.home,
    //   path: "/",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <ChartBarIcon />
    //     </SvgIcon>
    //   ),
    // },

    {
      title: localization.sidebar.top_news,
      path: "/news-banner",
      icon: (
        <SvgIcon fontSize="small">
          <RadioIcon />
        </SvgIcon>
      ),
    },

    {
      title: localization.sidebar.category,
      path: "/categories",
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.reviews,
      path: "/buildings",
      icon: (
        <SvgIcon fontSize="small">
         <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 21H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M17 8H13C10.518 8 10 8.518 10 11V21H20V11C20 8.518 19.482 8 17 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M14 21H2V4C2 1.518 2.518 1 5 1H11C13.482 1 14 1.518 14 4V8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M2 5H5M2 9H5M2 13H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M14 12H16M14 15H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M15 21L15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </SvgIcon>
      ),
    },
    
    // {
    //   title: localization.sidebar.leeds,
    //   path: "/leeds",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <CogIcon />
    //     </SvgIcon>
    //   ),
    // },
    {
      title: localization.sidebar.news,
      path: "/news",
      icon: (
        <SvgIcon fontSize="small">
         <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.5 6H17.5M9.5 10H12M17.5 10H15M9.5 14H12M17.5 14H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 5.5H5C3.11438 5.5 2.17157 5.5 1.58579 6.08579C1 6.67157 1 7.61438 1 9.5V16C1 17.3807 2.11929 18.5 3.5 18.5C4.88071 18.5 6 17.3807 6 16V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 1.5H10C9.07003 1.5 8.60504 1.5 8.22354 1.60222C7.18827 1.87962 6.37962 2.68827 6.10222 3.72354C6 4.10504 6 4.57003 6 5.5V16C6 17.3807 4.88071 18.5 3.5 18.5H15C17.8284 18.5 19.2426 18.5 20.1213 17.6213C21 16.7426 21 15.3284 21 12.5V7.5C21 4.67157 21 3.25736 20.1213 2.37868C19.2426 1.5 17.8284 1.5 15 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.admins,
      path: "/admins",
      icon: (
        <SvgIcon fontSize="small">
          <UserCircleIcon />
        </SvgIcon>
      ),
    },
    // {
    //   title: localization.sidebar.mobile,
    //   path: "/mobile",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <PhoneIcon />
    //     </SvgIcon>
    //   ),
    //   subItems: [
    //     {
    //       title: localization.sidebar.cars,
    //       path: "/mobile/cars",
    //       icon: (
    //         <SvgIcon fontSize="small">
    //           <CarIcon />
    //         </SvgIcon>
    //       ),
    //     },
    //     {
    //       title: localization.sidebar.orders,
    //       path: "/mobile/orders",
    //       icon: (
    //         <SvgIcon fontSize="small">
    //           <CogIcon />
    //         </SvgIcon>
    //       ),
    //     },
    //     {
    //       // accessRole: ["owner"],
    //       title: localization.sidebar.natifications,
    //       path: "/mobile/natifications",
    //       icon: (
    //         <SvgIcon fontSize="small">
    //           <BellIcon />
    //         </SvgIcon>
    //       ),
    //     },
    //   ],
    // },
  ];

return items
}
