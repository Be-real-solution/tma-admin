import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { SvgIcon, useMediaQuery } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import {ListItem, List, CardMedia, Paper} from '@mui/material';
import { useState } from 'react';
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    CircularProgress
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

export default function AddCompanyModal({ getDatas, type, subId }) {
    const { loading, error, createData } = useFetcher();
    const [open, setOpen] = React.useState(false);
    const { lang } = useSelector((state) => state.localiztion);
    const image = React.useRef("")
    const [isLoading, setIsLoading] = React.useState(false);
  const [mainImage, setMainImage] = useState([]);

    const { localization } = Content[lang];
    const matches = useMediaQuery("(min-width:500px)");

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

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const onFinish = () => {
        formik.values.nameuz = ""
        formik.values.nameru = ""
        formik.values.nameen = ""
      handleClose()
    }

    const formik = useFormik({
        initialValues: {
            nameuz: "",
            nameru: "",
            nameen: "",
            namekaa: "",
           
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
                    name: values.nameuz,
                    name_uz: values.nameuz,
                    name_ru: values.nameru,
                    name_en: values.nameen,
name_kaa: values.namekaa,
                    
                };
if (type === "announcementnetwork") {
    const formData = new FormData();
  
    mainImage?.length && formData.append('icon', mainImage[0]?.file);
    formData.append("name_uz", values.nameuz);
    formData.append("name_ru", values.nameru);
    formData.append("name_en", values.nameen);
    formData.append("name", values.nameuz);
  
    const response = await fetch(BaseUrl + "/announcement/social/networks/link/category/create/", {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${JSON.parse(window.sessionStorage.getItem("authenticated"))?.access || false}`,
          lang: lang,
        },
        body: formData,
      });

    //   const res = await response.json()

      if (response.status === 401) {
        auth.signOut();
        router.push("/auth/login");
      }
      if (response.status === 201) {
        handleClose()
        getDatas()
        setOpen(false)
        setIsLoading(false)
        
        onFinish()
    
      }
}else{
    createData(type === "announcementfaq" ? `/announcement/faq/create/` : type === "faqcategory" ? `/announcement/faq/category/create/`  : `/library/category/create/`,  newData, "POST", getDatas, onFinish);
                setIsLoading(false)
}
              
                

            
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
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
onClose={handleClose}>
                    { localization.modal.addCategory.title}

                </BootstrapDialogTitle>
                <form noValidate
onSubmit={formik.handleSubmit}>
                    <DialogContent dividers>
                        <Stack spacing={3}
                            width={matches ? 400 : null}>
           {type !== "faqcategory" &&            <Paper elevation={3} 
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
    </Paper>}
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
                                
                   {isLoading ? <CircularProgress size={26} 
                   color='success'/>
                    : localization.modal.add}

                        </Button>
                    </DialogActions>
                </form>

            </BootstrapDialog>
        </div>
    );
}