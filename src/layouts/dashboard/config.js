/* eslint-disable react/jsx-max-props-per-line */
import ChartBarIcon from '@heroicons/react/24/solid/Bars3Icon';
import QuestionMarkCircleIcon from "@heroicons/react/24/solid/QuestionMarkCircleIcon";
import LibraryIcon from "@heroicons/react/24/solid/BookOpenIcon";
import RadioIcon from "@heroicons/react/24/solid/NewspaperIcon";
import BellIcon from "@heroicons/react/24/solid/BellIcon";
import { SvgIcon } from '@mui/material';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
import { BookOpenIcon, BuildingOfficeIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, LinkIcon, MegaphoneIcon, NewspaperIcon, PlayCircleIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
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
      title: localization.sidebar.news_category,
      path: "/categories",
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.faq_category,
      path: "/faq-categories",
      icon: (
        <SvgIcon fontSize="small">
          <QuestionMarkCircleIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.library_category,
      path: "/library-categories",
      icon: (
        <SvgIcon fontSize="small">
          <LibraryIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.anons_network_category,
      path: "/anons-network-category",
      icon: (
        <SvgIcon fontSize="small">
          <BellIcon />
        </SvgIcon>
      ),
     
    },
    {
      title: localization.sidebar.anons_faq,
      path: "/anons-faq",
      icon: (
        <SvgIcon fontSize="small">
          <ChatBubbleLeftRightIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.anons_network_link,
      path: "/anons-network-category-link",
      icon: (
        <SvgIcon fontSize="small">
          <LinkIcon />
        </SvgIcon>
      ),
     
    },
    
   
 
    {
      title: localization.sidebar.anouncement,
      path: "/announcement",
      icon: (
        <SvgIcon fontSize="small">
          <MegaphoneIcon />
        </SvgIcon>
      ),
     
    },


   
    {
      title: localization.sidebar.story,
      path: "/story",
      icon: (
        <SvgIcon fontSize="small">
          <DocumentTextIcon />
        </SvgIcon>
      ),
     
    },
    {
      title: localization.sidebar.advertisement,
      path: "/advertisment",
      icon: (
        <SvgIcon fontSize="small">
          <RectangleStackIcon />
        </SvgIcon>
      ),
     
    },
    {
      title: localization.sidebar.news,
      path: "/news",
      icon: 
      <SvgIcon fontSize="small">
      
      <RadioIcon/>
    </SvgIcon>
    },
{
  title: localization.sidebar.reviews,
  path: "/buildings",
  icon: (
    <SvgIcon fontSize="small">
  
  <BuildingOfficeIcon/>
 </SvgIcon>
  ),
},
{
  title: localization.sidebar.library,
  path: "/library",
  icon: (
    <SvgIcon fontSize="small">
  
  <BookOpenIcon/>
 </SvgIcon>
  ),
},
{
  title: localization.sidebar.videos,
  path: "/video",
  icon: (
    <SvgIcon fontSize="small">
  
  <PlayCircleIcon/>
 </SvgIcon>
  ),
},





    // {
    //   title: localization.sidebar.admins,
    //   path: "/admins",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <UserCircleIcon />
    //     </SvgIcon>
    //   ),
    // },
  ];

return items
}
