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
  const categories = data["/category"];

  function getCountries() {
    fetchData(`/category`);
    
  }

    useEffect(() => {
        getCountries();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
  
  
  const [images, setImages] = useState([]);



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
    formik.values.nameuz = "";
    formik.values.category_id = [];
    formik.values.nameen = "";
    formik.values.nameru = "";
    formik.values.descriptionuz = "";
    formik.values.descriptionru = "";
    formik.values.descriptionen = "";
setImages([])
image.current=""
  };

  
  const formik = useFormik({
    initialValues: {
      category_id:[] ,
      nameen: "",
      nameuz: "",
      nameru: "",
      descriptionuz:"",
      descriptionru:"",
      descriptionen:"",
      isTop: false, // Initialize `isTop`

      submit: null,
    },
    validationSchema: Yup.object({
     
      nameuz: Yup.string().min(2).required(" Name is required"),
      nameru: Yup.string().min(2).required(" Name is required"),
      nameen: Yup.string().min(2).required(" Name is required"),
      descriptionuz: Yup.string().min(5).required("Info is required"),
      descriptionru: Yup.string().min(5).required("Info is required"),
      descriptionen: Yup.string().min(5).required("Info is required"),

    }),

    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {
console.log( values.category_id);

        const formData = new FormData();
        for (let index = 0; index < images?.length; index++) {
         formData.append('images', images?.[index].file);  
        }
        formData.append('image', image.current?.files[0]);  
        formData.append("name[uz]", values.nameuz);
        formData.append("name[ru]", values.nameru);
        formData.append("name[en]", values.nameen);
        formData.append("description[uz]", values.descriptionuz);
        formData.append("description[ru]", values.descriptionru);
        formData.append("description[en]", values.descriptionen);
        values.category_id.forEach(id => {
          formData.append('categoryIds', id);
        });
        formData.append('adminId', user?.id);
        formData.append("isTop", Boolean(values.isTop));
    
       


        const response = await fetch(BaseUrl + "/new", {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${JSON.parse(window.sessionStorage.getItem("authenticated")) || false}`,
            lang: lang,
          },
          body: formData,
        });

        const res = await response.json()

        if (response.status === 401) {
          auth.signOut();
          router.push("/auth/login");
        }
        if (res.status ===200) {
          handleClose()
          getDatas()
          
          onFinish()
      
        }

        addToast(res.message || (res.status ===200 ? localization.alerts.added : localization.alerts.warning), {
          appearance: res.status ===200 ? "success" : "error",
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
          {localization.modal.addNews.addnews} 
        </BootstrapDialogTitle>
        <form noValidate
          onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              >
              <TextField
                fullWidth
                name="image"
                label={localization.table.main_image}

                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="file"
                inputRef={image}
                InputLabelProps={{
                  shrink: true,
                }}
              />


{/* <ImageUploadList/> */}

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

    <FormControl fullWidth error={!!(formik.touched.category_id && formik.errors.category_id)}>
  <InputLabel  variant="filled" id="demo-simple-select-autowidth-label">{localization.sidebar.category}</InputLabel>
  <Select
    labelId="demo-simple-select-autowidth-label"
  label
    multiple
    name="category_id"
    value={formik.values.category_id}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    renderValue={(selected) => (
      <Box sx={{ display: 'flex', pt:0.6, flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((value) => (
          <Chip sx={{height:22}} key={value} label={categories.find(category => category.id === value)?.name} />
        ))}
      </Box>
    )}
  >
    {categories &&
      categories.map((item) => (
        <MenuItem key={item?.id} value={item?.id}>
          {item?.name}
        </MenuItem>
      ))}
  </Select>
  {formik.touched.category_id && formik.errors.category_id && (
    <FormHelperText>{formik.errors.category_id}</FormHelperText>
  )}
</FormControl>

      
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
                   <TextField

error={!!(formik.touched.nameru && formik.errors.nameru)}
fullWidth
helperText={formik.touched.nameru && formik.errors.nameru}
label={localization.table.name  + " "+ localization.ru}
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
label={localization.table.name + " "+ localization.en}
name="nameen"
onBlur={formik.handleBlur}
onChange={formik.handleChange}
type="text"
value={formik.values.nameen}
/>
<TextField

error={!!(formik.touched.descriptionuz && formik.errors.descriptionuz)}
fullWidth
helperText={formik.touched.descriptionuz && formik.errors.descriptionuz}
label={localization.table.info + " "+ localization.uz}
name="descriptionuz"
onBlur={formik.handleBlur}
onChange={formik.handleChange}
type="text"
value={formik.values.descriptionuz}
multiline
            
minRows={4}
/>
<TextField

error={!!(formik.touched.descriptionru && formik.errors.descriptionru)}
fullWidth
helperText={formik.touched.descriptionru && formik.errors.descriptionru}
label={localization.table.info + " "+ localization.ru}
name="descriptionru"
onBlur={formik.handleBlur}
onChange={formik.handleChange}
type="text"
value={formik.values.descriptionru}
multiline
            
minRows={4}
/>
<TextField

error={!!(formik.touched.descriptionen && formik.errors.descriptionen)}
fullWidth
helperText={formik.touched.descriptionen && formik.errors.descriptionen}
label={localization.table.info + " "+ localization.en}
name="descriptionen"
onBlur={formik.handleBlur}
onChange={formik.handleChange}
type="text"
value={formik.values.descriptionen}
multiline
            
minRows={4}
/>
<label style={{display:"flex", alignItems:"center"}}>
    <Typography variant="body2" sx={{ mr: 2 }}>
      {localization.table.isTop} {/* Label for the switch */}
    </Typography>
    <Switch
      checked={formik.values.isTop}
      onChange={formik.handleChange}
      name="isTop"
      color="primary"
      title="hello"
    />
  </label>
         
           
               
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
