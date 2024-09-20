import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { MenuItem, Select, SvgIcon, useMediaQuery, Paper, CircularProgress } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useFormik } from 'formik';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useToasts } from 'react-toast-notifications';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
import {  List, ListItem, CardMedia } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import LocationModal from 'src/components/Modals/MapModal';
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useState } from 'react';
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

export default function AddCompanyModal({ getDatas, type, subId }) {
    const router = useRouter();
    const auth = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const { lang } = useSelector((state) => state.localiztion);
    const image = React.useRef("")
    const {addToast} = useToasts()
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState([]);
    
    const [mapModal, setMapModal] = React.useState({
        status: false, data: {
            lat: "",
            long: "",
            address: ""
        }
    })



    const handleFileChange = (event) => {
      const newImages = Array.from(event.target.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const handleFileChange2 = (event) => {
        const newImages = Array.from(event.target.files).map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
        setMainImage((prevImages) => [...prevImages, ...newImages]);
      };
  
    const handleDelete = (index) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    };
  
    const handleDelete2 = (index) => {

        const newImages = [...mainImage];
        newImages.splice(index, 1);
        setMainImage(newImages);
     
    };

    

    

    const { localization } = Content[lang];
    const matches = useMediaQuery("(min-width:500px)");

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
        formik.values.descriptionen = ""
        formik.values.descriptionuz = ""
        formik.values.descriptionru = ""
        formik.values.phone_number = ""
        formik.values.address = ""
        formik.values.open_hour = ""
        formik.values.close_hour = ""
        setImages([])
        setMainImage([])
        setMapModal({
            status: false,
            data: {
                lat: "",
                long: "",
                address: ""
            }
        })
   

    }

    const formik = useFormik({
        initialValues: {
            nameuz: "",
            nameru: "",
            nameen: "",
            descriptionuz: "",
            descriptionru: "",
            descriptionen: "",
            address: "",
            phone_number: "",
            address: "",
            open_hour: "",
            close_hour: "",
            submit: null,
        },
        validationSchema: Yup.object({
          
            nameuz: Yup.string().min(2).required("Name is required"),
            nameru: Yup.string().min(2).required("Name is required"),
            nameen: Yup.string().min(2).required("Name is required"),
            phone_number: Yup.string().min(2)
            // .required("Phone number is required"),
            // descriptionuz: Yup.string().min(5).required("Info is required"),
            // descriptionru: Yup.string().min(5).required("Info is required"),
            // descriptionen: Yup.string().min(5).required("Info is required"),
        }),


        onSubmit: async (values, helpers) => {

            try {
                setIsLoading(true)
                const formData = new FormData();
                for (let index = 0; index < images?.length; index++) {
                    images?.[index].file && formData.append('images', images?.[index].file);
                }
                mainImage?.length && formData.append('image', mainImage[0]?.file);
                formData.append("name[uz]", values.nameuz);
                formData.append("name[ru]", values.nameru);
                formData.append("name[en]", values.nameen);
                formData.append("description[uz]", values.descriptionuz);
                formData.append("description[ru]", values.descriptionru);
                formData.append("description[en]", values.descriptionen);
                values.phone_number && formData.append("phoneNumber", values.phone_number);
                formData.append("address[uz]", mapModal.data.address);
                formData.append("address[ru]", mapModal.data.address);
                formData.append("address[en]", mapModal.data.address);
                values.close_hour &&  formData.append("workEndTime", values.close_hour);
                values.open_hour && formData.append("workStartTime", values.open_hour);
                formData.append("latitude",  String(mapModal.data.lat));
                formData.append("longitude", String(mapModal.data.long));
              

                const response = await fetch(BaseUrl + "/building", {
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
                if (res.status === 200) {
                    handleClose()
                    getDatas()

                    onFinish()

                }
                setIsLoading(false)

                addToast(res.message || (res.status === 200 ? localization.alerts.added : localization.alerts.warning), {
                    appearance: res.status === 200 ? "success" : "error",
                    autoDismiss: true,
                });

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
             maxWidth={"md"}
fullWidth
onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
                    onClose={handleClose}>
                    {localization.modal.addBuilding.addbuilding}

                </BootstrapDialogTitle>
                <form 
                    onSubmit={formik.handleSubmit}>
                    <DialogContent dividers>
                        <Stack  spacing={3}
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
    style={{ padding: '16px', marginTop: '16px'}}>
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
<Box display={"flex"} gap={1}>
<TextField
                                error={!!(formik.touched.tel_number && formik.errors.tel_number)}
                                fullWidth
                                helperText={formik.touched.tel_number && formik.errors.tel_number}
                                label={localization.table.phone_number}
                                name="phone_number"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="tel"
                                value={formik.values.tel_number}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
   <LocationModal setMapModal={setMapModal} mapModal={mapModal} localization={localization} />
                   </Box>     
                       
                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.open_hour && formik.errors.open_hour)}
                                    fullWidth
                                    helperText={formik.touched.open_hour && formik.errors.open_hour}
                                    autoComplete="off"
                                    label={localization.table.open_hour}
                                    name="open_hour"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="time"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.open_hour}
                                />
                                <TextField
                                    error={!!(formik.touched.close_hour && formik.errors.close_hour)}
                                    fullWidth
                                    helperText={formik.touched.close_hour && formik.errors.close_hour}
                                    autoComplete="off"
                                    label={localization.table.close_hour}
                                    name="close_hour"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="time"
                                    value={formik.values.close_hour}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>

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