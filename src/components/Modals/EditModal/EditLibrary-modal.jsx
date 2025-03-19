/* eslint-disable react/jsx-max-props-per-line */
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
import { Select, FormControl, FormHelperText, InputLabel, Chip } from '@mui/material';

import { useFormik } from "formik";
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import * as Yup from "yup";
import { Box, Button, Stack, TextField, MenuItem, CircularProgress, Switch } from "@mui/material";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useSearchParams } from "next/navigation";
// import ImageUploadList from "src/components/ImageList"
import { useState } from 'react';
import { List, ListItem, IconButton, CardMedia, Paper, Typography } from '@mui/material';
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


export default function AddOrderModal({ getDatas, row }) {
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const [isLoading, setIsLoading] = React.useState(false);

  const { fetchData, data, loading, error, createData } = useFetcher();
  const categories = data["/library/category/list/"]?.results;

  function getCountries() {
    fetchData(`/library/category/list/`);

  }

  useEffect(() => {
    getCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



 
  const [images, setImages] = useState([{
    file: null,
    url: row?.item?.replace("http://", "https://"),
  }]);
  const [mainImage, setMainImage] = useState([{
    file: null,
    url: row?.image?.replace("http://", "https://"),
  }]);


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
  const { addToast } = useToasts()
  const { localization } = Content[lang];
  const image = React.useRef("")
  const file = React.useRef("")
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };



  const formik = useFormik({
    initialValues: {
      category_id: row?.category.id,
      nameen:row?.title_en,
      nameuz:row?.title_uz,
      nameru:row?.title_ru,
      namekaa:row?.title_kaa,
      descriptionuz: row?.description_uz,
      descriptionru: row?.description_ru,
      descriptionen: row?.description_en,
      descriptionkaa: row?.description_kaa,
      price:row.price,
      author: row.author,
      isTop: row.is_free || false, // Initialize `isTop`

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
          images?.[index].file && formData.append('item', images?.[index].file);
        }
        mainImage[0]?.file && formData.append('image', mainImage[0]?.file);
        formData.append("title", values.nameuz);
        formData.append("title_uz", values.nameuz);
        formData.append("title_ru", values.nameru);
        formData.append("title_en", values.nameen);
        formData.append("title_kaa", values.namekaa);
        formData.append("description", values.descriptionuz);
        formData.append("description_uz", values.descriptionuz);
        formData.append("description_ru", values.descriptionru);
        formData.append("description_en", values.descriptionen);
        formData.append("description_kaa", values.descriptionkaa);

        formData.append('category', values.category_id);
        formData.append('price', values.price);
        formData.append('author', values.author);

        formData.append("is_free", Boolean(values.isTop) ? "True" : "False");




        const response = await fetch(BaseUrl + `/library/update/${row.id}/`, {
          method: 'PATCH',

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
            <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </SvgIcon>
      </IconButton>
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

              <Paper elevation={3}
                style={{ padding: '16px', marginTop: '16px' }}>
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
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>          <CardMedia
                          component="img"
                          image={image.url}
                          alt={`Uploaded preview ${index}`}
                          style={{ width: '100px', height: '100px', marginRight: '16px', objectFit: "contain" }}
                        />
                          <Typography variant="body2">{image?.file?.name}</Typography></Box>
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
                  name="file"
                  label={localization.table.file}
                  disabled={images?.length}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    handleFileChange(e)
                    // formik.handleChange()}
                  }}
                  type="file"
                  inputRef={file}
                />

                {images?.length > 0 ? (
                  <List>
                    {images.map((image, index) => (
                      <ListItem key={index}
                        divider
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>          <CardMedia
                          component="img"
                          image={image.url}
                          alt={`Uploaded preview ${index}`}
                          style={{ width: '100px', height: '100px', marginRight: '16px', objectFit: "contain" }}
                        />
                          <Typography variant="body2">{image?.file?.name}</Typography></Box>
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
                <InputLabel variant="filled" id="demo-simple-select-autowidth-label">{localization.sidebar.category}</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  label
                  // multiple
                  name="category_id"
                  value={formik.values.category_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}

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

                error={!!(formik.touched.author && formik.errors.author)}
                fullWidth
                helperText={formik.touched.author && formik.errors.author}
                label={localization.table.author}
                name="author"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.author}
              />
              <TextField

                error={!!(formik.touched.price && formik.errors.price)}
                fullWidth
                helperText={formik.touched.price && formik.errors.price}
                label={localization.table.cost}
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.price}
              />

              <TextField

                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                fullWidth
                helperText={formik.touched.nameuz && formik.errors.nameuz}
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
                label={localization.table.name + " " + localization.en}
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
                label={localization.table.info + " " + localization.uz}
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
                label={localization.table.info + " " + localization.ru}
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
                label={localization.table.info + " " + localization.en}
                name="descriptionen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.descriptionen}
                multiline

                minRows={4}
              />
              <label style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {localization.table.isFree} {/* Label for the switch */}
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

              {isLoading ? <CircularProgress size={26} color='success' />
                : localization.modal.add}

            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
}
