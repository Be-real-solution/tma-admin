import * as React from "react";
import { useEffect, useRef, useState } from "react";
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
import { SvgIcon, useMediaQuery, CircularProgress, Switch } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import {PlusIcon, PencilSquareIcon} from "@heroicons/react/24/solid";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  List, ListItem, IconButton, FormHelperText, CardMedia, Paper } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import {  Select, FormControl, InputLabel, Chip } from '@mui/material';

import { Box, Button, Stack, TextField, Typography, MenuItem } from "@mui/material";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useSearchParams } from "next/navigation";

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


export default function AddOrderModal({ getDatas, row }) {
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const isAuthenticated = JSON.parse(window.sessionStorage.getItem("authenticated")) || false;
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const auth = useAuth();
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
  const [images2, setImages2] = useState([]);
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


  const handleDeleteImageFromApi = (index) => {
    fetch(`${BaseUrl}/new-image/${index}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAuthenticated}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // handleClose();
        addToast(data?.errorMessage || data?.message  || localization.alerts.deleted, { appearance: data.id ? "success" : "error", autoDismiss: true });
        if (data.id) {
          setImages2(images2?.filter((el)=> (el.id !== index)))
          
        }
      });
  };

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

  useEffect(()=>{
setImages2(row.images)
setMainImage([{
  file: null,
  url: row?.mainImage,
}])
  },[row, open])


  const formik = useFormik({
    initialValues: {
      category_id:row.categories?.map((item) => item.id) || [] ,
      nameen:row.name.en ||  "",
      nameuz:row.name.uz ||  "",
      nameru:row.name.ru ||  "",
      descriptionuz:row.description.uz || "",
      descriptionru:row.description.ru || "",
      descriptionen:row.description.en || "",
      isTop: row.isTop || false, // Initialize `isTop`
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

  
        const formData = new FormData();
        for (let index = 0; index < images?.length; index++) {
          images?.[index].file &&  formData.append('images', images?.[index].file);  
        }
        mainImage?.[0]?.file && formData.append('image', mainImage[0]?.file);

        formData.append("name[uz]", values.nameuz);
        formData.append("name[ru]", values.nameru);
        formData.append("name[en]", values.nameen);
        formData.append("isTop", Boolean(values.isTop));
        formData.append("description[uz]", values.descriptionuz);
        formData.append("description[ru]", values.descriptionru);
        formData.append("description[en]", values.descriptionen);
     
        formData.append('adminId', user?.id);
    
        values.category_id?.length ? values?.category_id?.forEach(id => {
          formData.append('categoryIds', id);
        }) : formData.append('categoryIds', [])


        const response = await fetch(BaseUrl + `/new/${row.id}`, {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${JSON.parse(window.sessionStorage.getItem("authenticated"))}` || false,
            lang: lang,
          },
          body: formData,
        });

        const res = await response.json()
        if (response.status === 401) {
          auth.signOut();
          router.push("/auth/login");
        }
        if (res.status) {
          setImages([])
          getDatas()
          handleClose()
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
      <BootstrapDialog fullWidth maxWidth="md" onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle id="customized-dialog-title"
          onClose={handleClose}>
          {localization.modal.addNews.editnews} 
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
                image={image?.file ?  image.url : BaseUrl + "/uploads/images/" + image.url}
                alt={`Uploaded preview ${index}`}
                style={{ width: '100px', height: '100px', marginRight: '16px', objectFit:"contain" }}
              />
              <Typography variant="body2">{image?.file ? image?.file?.name : "image.png"}</Typography></Box>
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
      {(images2.length > 0 || images.length > 0) ? (
        <List>
             {!!images2.length && images2?.map((image, index) => (
            <ListItem key={image.id}
             divider
style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
    <Box sx={{display:"flex", alignItems:"center"}}>          <CardMedia
                component="img"
           
                image={BaseUrl + "/uploads/images/" + image.imageLink}
                alt={`Uploaded preview ${image.id}`}
                style={{ width: '100px', height: '100px', marginRight: '16px', objectFit:"contain" }}
              />
              <Typography variant="body2">{image.imageLink}</Typography></Box>
              <IconButton edge="end" 
              onClick={() => handleDeleteImageFromApi(image.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
          {!!images.length && images.map((image, index) => (
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
          <>
         
          <Chip sx={{height:22}} key={value} label={categories.find(category => category.id === value)?.name} />
          </>
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
                    : localization.modal.edit}

                        </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
}
