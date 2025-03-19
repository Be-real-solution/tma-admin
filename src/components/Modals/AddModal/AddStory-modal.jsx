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
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {  Select, FormControl, FormHelperText, InputLabel, Chip } from '@mui/material';

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


export default function AddOrderModal({ getDatas, company }) {
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const [isLoading, setIsLoading] = React.useState(false);

  const { fetchData, data, loading, error, createData } = useFetcher();
  const categories = data["/news/category/list/"]?.results;

  function getCountries() {
    fetchData(`/news/category/list/`);
    
  }

    useEffect(() => {
        getCountries();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
  
  
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState([]);



  const handleFileChange = (event) => {
    const newImages = Array.from(event.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

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
  const onFinish = () => {
setImages([])
image.current=""
  };

  
  const formik = useFormik({
    initialValues: {
    
      submit: null,
    },
    validationSchema: Yup.object({
     
     
    }),

    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {


        const formData = new FormData();
        for (let index = 0; index < images?.length; index++) {
         formData.append('images', images?.[index].file);  
        }
        mainImage?.length && formData.append('cover_image', mainImage[0]?.file);
    
       


        const response = await fetch(BaseUrl + "/announcement/story/create/", {
          method: 'POST',

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
        if (response.status ===201) {
          handleClose()
          getDatas()
          
          onFinish()
      
        }

        addToast(res.message || (response.status ===201 ? localization.alerts.added : localization.alerts.warning), {
          appearance: response.status ===201 ? "success" : "error",
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
    <div>
      <Button
        onClick={handleClickOpen}
        startIcon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
      >
        {localization.modal.add}
      </Button>
      <BootstrapDialog maxWidth="md" fullWidth onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle id="customized-dialog-title"
          onClose={handleClose}>
         { localization.modal.add_title(localization.sidebar.story)}

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
                image={image.url}
                alt={`Uploaded preview ${index}`}
                style={{ width: '100px', height: '100px', marginRight: '16px', objectFit:"contain" }}
              />
              <Typography variant="body2">{image.file.name}</Typography></Box>
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

<Paper elevation={3} 
    style={{ padding: '16px', marginTop: '16px' }}>
     <TextField
                fullWidth
                name="image"
                label={localization.table.images}

                inputProps={{
                  multiple: true
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  handleFileChange(e)
                  // formik.handleChange()}
                }}
                type="file"
                inputRef={image}
              /> 
      {/* <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: '16px' }}
      /> */}
      {images.length > 0 ? (
        <List>
          {images.map((image, index) => (
            <ListItem key={index}
             divider
style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
    <Box sx={{display:"flex", alignItems:"center"}}>          <CardMedia
                component="img"
                image={image.url}
                alt={`Uploaded preview ${index}`}
                style={{ width: '100px', height: '100px', marginRight: '16px', objectFit:"contain" }}
              />
              <Typography variant="body2">{image.file.name}</Typography></Box>
              <IconButton edge="end" 
              onClick={() => handleDelete(index)}>
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
    </div>
  );
}
