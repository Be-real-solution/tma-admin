import * as React from "react";
import { useEffect, useRef } from "react";
import Content from "src/Localization/Content";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import { SvgIcon, useMediaQuery } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";

import { useFormik } from "formik";
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import * as Yup from "yup";
import { Box, Button, Stack, TextField, MenuItem, CircularProgress, Switch } from "@mui/material";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useSearchParams } from "next/navigation";
// import ImageUploadList from "src/components/ImageList"
import  { useState } from 'react';
import {  List, ListItem, IconButton, CardMedia, Paper, Typography } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }}
      {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon width={25} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};


export default function AddOrderModal({ getDatas, route, row }) {
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const [isLoading, setIsLoading] = React.useState(false);

  const [mainImage, setMainImage] = useState([
    { file: null, url:  row?.image?.replace("http://", "https://") },
  ]);



  const handleFileChange2 = (event) => {
    const newImages = Array.from(event.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setMainImage((prevImages) => [...prevImages, ...newImages]);
  };


  const handleDelete2 = (index) => {

    const newImages = [...mainImage];
    newImages.splice(index, 1);
    setMainImage(newImages);
 
};

  const router = useRouter();
  const auth = useAuth();
  const { lang } = useSelector((state) => state.localiztion);
  const matches = useMediaQuery("(min-width:500px)");
  const params = useSearchParams()
  const ParamId = params.get("id")
  const {addToast} = useToasts()
  const { localization } = Content[lang];
  const image = React.useRef("")
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  
  const formik = useFormik({
    initialValues: {
 
      nameuz:row.url,
    

      submit: null,
    },
    validationSchema: Yup.object({
     
      nameuz: Yup.string().min(2).required(" Name is required"),
     
    }),

    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {


        const formData = new FormData();
  
        mainImage?.length && formData.append('image', mainImage[0]?.file);
        formData.append("url", values.nameuz);
      


        const response = await fetch(BaseUrl + `${route}/${row.id}/`, {
          method: 'PUT',

          headers: {
            Authorization: `Bearer ${JSON.parse(window.sessionStorage.getItem("authenticated"))?.access || false}`,
            lang: lang,
          },
          body: formData,
        });

        const res = await response.json()

        if (response.status === 401) {
          auth.signOut();
          router.push("/auth/login");
        }
        if (response.status === 200) {
          handleClose()
          getDatas()
          

      
        }

        addToast(res.message || (response.status === 200 ? localization.alerts.added : localization.alerts.warning), {
          appearance: response.status === 200 ? "success" : "error",
          autoDismiss: true,
        });
        setIsLoading(false)
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });





  return (
    <>
      <IconButton
        onClick={handleClickOpen}
      >
        <SvgIcon >
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </SvgIcon>
      </IconButton>
      <BootstrapDialog maxWidth="md" fullWidth onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle id="customized-dialog-title"
          onClose={handleClose}>
            { localization.modal.edit_title(localization.sidebar.advertisement)}

        </BootstrapDialogTitle>
        <form noValidate
          onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              >
          
<Paper elevation={3} 
    style={{ padding: '16px', marginTop: '16px'}}>
     <TextField
                fullWidth
                name="image"
                label={localization.table.main_image}
               disabled={mainImage?.length}
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                    handleFileChange2(e)
                  // formik.handleChange()}
                }}
                type="file"
                inputRef={image}
              /> 
  
      {mainImage?.length > 0 ? (
        <List>
          {mainImage.map((image, index) => (
            <ListItem key={index}
             divider
style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
    <Box sx={{display:"flex", alignItems:"center"}}>          <CardMedia
                component="img"
                image={image?.url}
                alt={`Uploaded preview ${index}`}
                style={{ width: '100px', height: '100px', marginRight: '16px', objectFit:"contain" }}
              />
              <Typography variant="body2">{image?.file?.name || "image"}</Typography></Box>
              <IconButton edge="end" 
              onClick={() => handleDelete2(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box textAlign="center">
          <ImageIcon style={{ fontSize: 50, color: 'gray' }} />
          <Typography variant="body2"
           color="textSecondary">
            No images uploaded
          </Typography>
        </Box>
      )}
    </Paper>


    

      
              <TextField

                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                fullWidth
                helperText={formik.touched.nameuz && formik.errors.nameuz}
                label={localization.table.name  + " "+ localization.uz}
                name="nameuz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameuz}
              />
   
         
           
               
            </Stack>

            {formik.errors.submit && (
              <Typography color="error"
                sx={{ mt: 3 }}
                variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
          <Button 
                        // onClick={handleClose}
                            fullWidth
                            size="large"
                            sx={{ my: 1 }}
                            disabled={isLoading}
                            type="submit"
                            variant="contained">
                                
                   {isLoading ? <CircularProgress size={26} color='success'/>
                    : localization.modal.add}

                        </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
}



