import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { MenuItem, Select, SvgIcon, useMediaQuery, Paper } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
import { List, ListItem, CardMedia, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import LocationModal from 'src/components/Modals/MapModal';
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useState, useEffect } from 'react';
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

export default function AddCompanyModal({ getDatas, type, row }) {
    const { loading, error, createData } = useFetcher();
    const [open, setOpen] = React.useState(false);
    const { lang } = useSelector((state) => state.localiztion);
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const auth = useAuth();
    const image = React.useRef("")
    const { addToast } = useToasts()
    const [images, setImages] = useState([]);
    const [images2, setImages2] = useState([]);

    const [mapModal, setMapModal] = React.useState({
        status: false, data: {
            lat: "",
            long: "",
            address: ""
        }
    })
    const { localization } = Content[lang];
    const matches = useMediaQuery("(min-width:500px)");

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

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



    useEffect(() => {
        if (row) {
            formik.setFieldValue("phoneNumber", row.phoneNumber)
            setImages2(row.images)
            setMapModal({
                status: false, data: {
                    lat: row?.latitude || "",
                    long: row?.longitude || "",
                    address: row?.address?.[lang] || ""
                }
            })

        }
    }, [row])

    const formik = useFormik({
        initialValues: {
            nameuz: row.name.uz,
            nameru: row.name.ru,
            nameen:  row.name.en,
            phoneNumber: row.phoneNumber,
            descriptionuz: row.description.uz,
            descriptionru: row.description.ru,
            descriptionen: row.description.en,
            open_hour: row.workStartTime,
            close_hour: row.workEndTime,
            submit: null,
        },
        validationSchema: Yup.object({
            // open_hour: Yup.string().required("Name is required"),
            // close_hour: Yup.string().required("Name is required"),
            nameuz: Yup.string().min(2).required("Name is required"),
            nameru: Yup.string().min(2).required("Name is required"),
            nameen: Yup.string().min(2).required("Name is required"),
            phoneNumber: Yup.string().min(2).required("Phone number is required"),
            descriptionuz: Yup.string().min(5).required("Info is required"),
            descriptionru: Yup.string().min(5).required("Info is required"),
            descriptionen: Yup.string().min(5).required("Info is required"),
        }),


        onSubmit: async (values, helpers) => {
            setIsLoading(true)
            try {
                const formData = new FormData();
                for (let index = 0; index < images?.length; index++) {
                    images?.[index].file && formData.append('images', images?.[index].file);
                }
                image.current?.files[0] && formData.append('image', image.current?.files[0]);
                values.nameuz && formData.append("name[uz]", values.nameuz);
                values.nameru && formData.append("name[ru]", values.nameru);
                values.nameen && formData.append("name[en]", values.nameen);
                values.descriptionuz && formData.append("description[uz]", values.descriptionuz);
                values.descriptionru && formData.append("description[ru]", values.descriptionru);
                values.descriptionen && formData.append("description[en]", values.descriptionen);
                row.phoneNumber !== values.phoneNumber && formData.append("phoneNumber", values.phoneNumber);
                row?.address?.[lang] !== mapModal.data.address && formData.append("address[uz]", mapModal.data.address);
                row?.address?.[lang] !== mapModal.data.address && formData.append("address[ru]", mapModal.data.address);
                row?.address?.[lang] !== mapModal.data.address && formData.append("address[en]", mapModal.data.address);
                values.close_hour && formData.append("workEndTime", values.close_hour);
                values.open_hour && formData.append("workStartTime", values.open_hour);
                formData.append("latitude", String(mapModal.data.lat));
                formData.append("longitude", String(mapModal.data.long));


                const response = await fetch(BaseUrl + `/building/${row.id}`, {
                    method: 'PATCH',

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


                }

                addToast(res.message || (res.status === 200 ? localization.alerts.edited : localization.alerts.warning), {
                    appearance: res.status === 200 ? "success" : "error",
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




    const handleDeleteImageFromApi = (index) => {
        const isAuthenticated = JSON.parse(window.sessionStorage.getItem("authenticated")) || false;

        fetch(`${BaseUrl}/building-image/${index}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${isAuthenticated}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                // handleClose();
                addToast(data?.errorMessage || data?.message || localization.alerts.deleted, { appearance: data.id ? "success" : "error", autoDismiss: true });
                if (data.id) {
                    setImages2(images2?.filter((el) => (el.id !== index)))

                }
            });
    };




    return (
        <div>

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
            <BootstrapDialog
             fullWidth maxWidth="md" 
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
                    onClose={handleClose}>
                    {localization.modal.addBuilding.editbuilding}

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

                                {(images.length > 0 || images2.length > 0) ? (
                                    <List>
                                        {!!images2.length && images2?.map((image, index) => (
                                            <ListItem key={image.id}
                                                divider
                                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>          <CardMedia
                                                    component="img"

                                                    image={BaseUrl + "/uploads/images/" + image.imageLink}
                                                    alt={`Uploaded preview ${image.id}`}
                                                    style={{ width: '100px', height: '100px', marginRight: '16px', objectFit: "contain" }}
                                                />
                                                    <Typography variant="body2">{image.imageLink}</Typography></Box>
                                                <IconButton edge="end"
                                                    onClick={() => handleDeleteImageFromApi(image.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                        {!!images?.length && images?.map((image, index) => (
                                            <ListItem key={index}
                                                divider
                                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>          <CardMedia
                                                    component="img"
                                                    image={image.url}
                                                    alt={`Uploaded preview ${index}`}
                                                    style={{ width: '100px', height: '100px', marginRight: '16px', objectFit: "contain" }}
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
                           
                            
                            <TextField
                                error={!!(formik.touched.tel_number && formik.errors.tel_number)}
                                fullWidth
                                helperText={formik.touched.tel_number && formik.errors.tel_number}
                                label={localization.table.phone_number}
                                name="phoneNumber"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                value={formik.values.phoneNumber}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <LocationModal setMapModal={setMapModal} mapModal={mapModal} localization={localization} />


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
                    : localization.modal.edit}

                        </Button>
                    </DialogActions>
                </form>

            </BootstrapDialog>
        </div>
    );
}