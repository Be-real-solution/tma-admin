import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { IconButton, SvgIcon } from "@mui/material";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useToasts } from "react-toast-notifications";
import {routeControler} from "src/utils/role-controler"
export default function DeleteModal({ route, getDatas, type }) {
  const isAuthenticated = JSON.parse(window.sessionStorage.getItem("authenticated")) || false;
  const { lang } = useSelector((state) => state.localiztion);
  const { addToast } = useToasts();
  
  const { localization } = Content[lang];
  const router = usePathname()
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find(item => item == router);

  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    fetch(`${BaseUrl}/${route}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAuthenticated}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        handleClose();
        addToast(data?.errorMessage || data?.message  || localization.alerts.deleted, { appearance: data.status === 200 ? "success" : "error", autoDismiss: true });
        if (data.status) {
          getDatas();
          
        }
      });
  };

  return (
    <>
     <IconButton onClick={handleClickOpen}>
        <SvgIcon>
          {/* <TrashIcon color="red" /> */}
          <svg width="24px" height="24px" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19C14.2091 19 16 17.2091 16 15C16 12.7909 14.2091 11 12 11C9.79086 11 8 12.7909 8 15C8 17.2091 9.79086 19 12 19Z" stroke="red" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.07 16.11L10.95 14" stroke="red" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.05 14.02L10.93 16.14" stroke="red" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 22H15C19.02 22 19.74 20.39 19.95 18.43L20.7 12.43C20.97 9.99 20.27 8 16 8H8C3.73 8 3.03 9.99 3.3 12.43L4.05 18.43C4.26 20.39 4.98 22 9 22Z" stroke="red" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001" stroke="red" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </SvgIcon>
      </IconButton>
      {/* <Button onClick={handleClickOpen} sx={{ mt: .5 }} variant="outlined" color="error" startIcon={<TrashIcon width={15} />}>
               {localization.delete}

             </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <DialogTitle id="alert-dialog-title">{localization.alerts.confirmdelete}</DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> {localization.alerts.no}</Button>
                  <Button onClick={handleDelete}
                      autoFocus>
            {localization.alerts.ok}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
