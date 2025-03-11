/* eslint-disable react/jsx-max-props-per-line */
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { SvgIcon, useMediaQuery, CircularProgress } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PencilSquareIcon';

import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import {ListItem, List, CardMedia, Paper} from '@mui/material';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
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
            position: 'absolute',
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

export default function AddCompanyModal({ getDatas, row, type, route }) {
  const { loading, error, createData } = useFetcher();
  const [open, setOpen] = React.useState(false);
  const { lang } = useSelector((state) => state.localiztion);
  const image = React.useRef("")
  const [isLoading, setIsLoading] = React.useState(false);
  const [mainImage, setMainImage] = useState([]);

  const { localization } = Content[lang];
  const matches = useMediaQuery("(min-width:500px)");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

  const formik = useFormik({
    initialValues: {
      nameuz: row.name_uz,
      nameru: row.name_ru,
      nameen: row.name_en,
      namekaa: row.name_kaa,
    
      submit: null,
    },
    validationSchema: Yup.object({
      nameuz: Yup.string().min(2).required("Name UZ is required"),
      nameru: Yup.string().min(2).required("Name RU is required"),
      nameen: Yup.string().min(2).required("Name EN is required"),
                  namekaa: Yup.string().min(2).required("Name KAA is required"),
      
    }),


    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {
        const newData = {
        name_en: values.nameen,
        name_uz: values.nameuz,
        name_ru: values.nameru,
        name_kaa: values.namekaa,
        name: values.nameuz
        
         

        };
        if (type === "announcementnetwork") {
          const formData = new FormData();
        
          mainImage?.length && formData.append('icon', mainImage[0]?.file);
          formData.append("name_uz", values.nameuz);
          formData.append("name_ru", values.nameru);
          formData.append("name_en", values.nameen);
          // formData.append("name", values.nameuz);
      
          const response = await fetch(BaseUrl + route+`/${row.id}/`, {
              method: 'PATCH',
      
              headers: {
                Authorization: `Bearer ${JSON.parse(window.sessionStorage.getItem("authenticated"))?.access || false}`,
                lang: lang,
              },
              body: formData,
            });
      
          //   const res = await response.json()
      
            if (response.status === 401) {
              auth.signOut();
              // router.push("/auth/login");
            }
            if (response.status === 201) {
              handleClose()
              getDatas()
              setOpen(false)
              setIsLoading(false)
              
              onFinish()
          
            }
      }else{
        createData(type === "news" ? `/news/category/update/${row.id}/` : `/library/category/update/${row.id}/`, newData, "PUT", getDatas);
        setIsLoading(false)
        handleClose()
      }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },


  });

  return (
    <>

      <IconButton onClick={handleClickOpen}>
      <SvgIcon >
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </SvgIcon>
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title"
          onClose={handleClose}>
                             { localization.modal.addCategory.edit}

        </BootstrapDialogTitle>
        <form noValidate
          onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              width={matches ? 400 : null}>
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
              <TextField
                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                fullWidth
                helperText={formik.touched.nameuz && formik.errors.nameuz}
                autoComplete="off"
                label={localization.table.name + " " + localization.uz}
                name="nameuz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameuz}
              />
              <TextField
                error={!!(formik.touched.nameru && formik.errors.nameru)}
                fullWidth
                helperText={formik.touched.nameru && formik.errors.nameru}
                autoComplete="off"
                label={localization.table.name + " " + localization.ru}
                name="nameru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameru}
              />
              <TextField
                error={!!(formik.touched.nameen && formik.errors.nameen)}
                fullWidth
                helperText={formik.touched.nameen && formik.errors.nameen}
                autoComplete="off"
                label={localization.table.name + " " + localization.en}
                name="nameen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameen}
              />
                 <TextField
                error={!!(formik.touched.namekaa && formik.errors.namekaa)}
                fullWidth
                helperText={formik.touched.namekaa && formik.errors.namekaa}
                autoComplete="off"
                label={localization.table.name + " " + localization.kaa}
                name="namekaa"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.namekaa}
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
                    : localization.modal.edit}

                        </Button>
          </DialogActions>
        </form>

      </BootstrapDialog>
    </>
  );
}