/* eslint-disable react-hooks/exhaustive-deps */


/* eslint-disable react/jsx-max-props-per-line */
import * as React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { MenuItem, Select, SvgIcon, useMediaQuery, Paper, CircularProgress,  
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    Typography,
    Box,
    Button,
    Stack,
    InputLabel,
    FormControl

} from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useFormik } from 'formik';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useToasts } from 'react-toast-notifications';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
import { List, ListItem, CardMedia } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

import LocationModal from 'src/components/Modals/MapModal';
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useState } from 'react';


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

const defaultDay = {
    day_of_week: '',
    start_time: '08:00',
    end_time: '17:00',
    is_open: true
  };

  const dayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

export default function AddCompanyModal({ getDatas, route, row }) {
    const router = useRouter();
    const auth = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const { lang } = useSelector((state) => state.localiztion);
    const image = React.useRef("")
    const { addToast } = useToasts()
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState([]);
    const [workingHours, setWorkingHours] = useState([ { ...defaultDay } ]);

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





    useEffect(() => {
        console.log(row);
       
        if (row) {
            row?.working_hours?.length &&    setWorkingHours(row?.working_hours?.map((el) => ({
                day_of_week: el?.day_of_week,
                start_time: el?.start_time,
                end_time: el?.end_time,
                is_open: el?.is_open === true ? true : false
            })));
            // formik.setFieldValue("phoneNumber", row.contacts)
            setImages(row?.images?.map((el) => ( { file: null, url:  el?.image?.replace("http://", "https://") })))
            setMainImage([{
                file: null,
                url: row?.cover_image?.replace("http://", "https://"),
            }])
            setMapModal({
                status: false, data: {
                    lat: row?.lat || "",
                    long: row?.lon || "",
                    address: row?.[`address_${lang}`] || ""
                }
            })

        }
    }, [row, open])

    const { localization } = Content[lang];
    const matches = useMediaQuery("(min-width:500px)");

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
   
    const isoString = row?.construction_date || "";
    const date = new Date(isoString.slice(0, 23)); // Yaroqli Date
    const formattedDate = date.toISOString().split("T")[0]; // "2025-04-24"
    const formik = useFormik({
        initialValues: {
            nameuz: row?.name_uz || "",
            nameru: row?.name_ru || "",
            nameen: row?.name_en || "",
            namekaa: row?.name_kaa || "",
            descriptionuz: row?.description_uz || "",
            descriptionru: row?.description_ru || "",
            descriptionen: row?.description_en || "",
            descriptionkaa: row?.description_kaa || "",
            address: row.address || "",
            lat: row?.lat || "",   
            lot: row?.lot || "",   
            phone_number: row?.contacts || "",
            cityuz: row.city_uz || "",
            cityru: row.city_ru || "",
            cityen: row.city_en || "",
            citykaa: row.city_kaa || "",
            stateuz: row.state_uz || "",
            stateru: row.state_ru || "",
            stateen: row.state_en || "",
            statekaa: row.state_kaa || "",
            zip_code: row.zip_code || "",
            floors: row.floors || "",
            construction_date: formattedDate || "",
            submit: null,
        },

        
        validationSchema: Yup.object({

            nameuz: Yup.string().min(2).required("Name is required"),
            nameru: Yup.string().min(2).required("Name is required"),
            nameen: Yup.string().min(2).required("Name is required"),
            namekaa: Yup.string().min(2).required("Name is required"),
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
                    if (images?.[index].file) {
                        formData.append(`images[${index}][image]`, images[index].file);
                        formData.append(`images[${index}][caption]`, `caption ${index}`);
                      }
                }
                mainImage[0]?.file && formData.append('cover_image', mainImage[0]?.file);
                formData.append("name", values.nameuz);
                formData.append("name_uz", values.nameuz);
                formData.append("name_ru", values.nameru);
                formData.append("name_en", values.nameen);
                formData.append("name_kaa", values.namekaa);
                formData.append("description", values.descriptionuz);
                formData.append("description_uz", values.descriptionuz);
                formData.append("description_ru", values.descriptionuz);
                formData.append("description_en", values.descriptionuz);
                formData.append("description_kaa", values.descriptionkaa);
                values.phone_number && formData.append("contacts", values.phone_number);
                values.phone_number && formData.append("contacts_en", values.phone_number);
                values.phone_number && formData.append("contacts_uz", values.phone_number);
                values.phone_number && formData.append("contacts_ru", values.phone_number);
                values.phone_number && formData.append("contacts_kaa", values.phone_number);
                formData.append("address_uz", mapModal.data.address);
                formData.append("address_ru", mapModal.data.address);
                formData.append("address_en", mapModal.data.address);
                formData.append("address_kaa", mapModal.data.address);
                formData.append("address", mapModal.data.address);
                // values.close_hour && formData.append("workEndTime", values.close_hour);
                // values.open_hour && formData.append("workStartTime", values.open_hour);
                formData.append("lat", Number(mapModal.data.lat).toFixed(6));
                formData.append("lon", Number(mapModal.data.long).toFixed(6));
                formData.append("city", values.cityuz);
                formData.append("city_en", values.cityen);
                formData.append("city_ru", values.cityru);
                formData.append("city_uz", values.cityuz);
                formData.append("city_kaa", values.citykaa);
                formData.append("state", values.stateuz);
                formData.append("state_en", values.stateen);
                formData.append("state_ru", values.stateru);
                formData.append("state_uz", values.stateuz);
                formData.append("state_kaa", values.statekaa);
                formData.append("zip_code", values.zip_code);
                formData.append("floors", values.floors);
                formData.append("construction_date", values.construction_date);
                // formData.append("working_hours", "");

                workingHours.forEach((day, index) => {
                    formData.append(`working_hours[${index}][day_of_week]`, day.day_of_week);
                    formData.append(`working_hours[${index}][start_time]`, day.start_time);
                    formData.append(`working_hours[${index}][end_time]`, day.end_time);
                    formData.append(`working_hours[${index}][is_open]`, day.is_open ? 'True' : 'False');
                  });

                const response = await fetch(BaseUrl + `/building/update/${row.id}/`, {
                        method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${JSON.parse(window.sessionStorage.getItem("authenticated")).access || false}`,
                        lang: lang,
                    },
                    body: formData,
                });

                const res = await response.json()
                if (response.status === 401) {
                    auth.signOut();
                    router.push("/auth/login");
                }
                if (response.status === 201) {
                    handleClose()
                    getDatas()

                }
                setIsLoading(false)

                addToast(res.message || (response.status === 201 ? localization.alerts.added : localization.alerts.warning), {
                    appearance: response.status === 201 ? "success" : "error",
                    autoDismiss: true,
                });

            } catch (err) {
                setIsLoading(false)

                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },


    });



    const handleChange = (index, field, value) => {
        const updated = [...workingHours];
        updated[index][field] = value;
        setWorkingHours(updated);
      };
    
      const handleAddDay = () => {
        if (workingHours?.length < 7) {
            setWorkingHours([...workingHours, { ...defaultDay }]);
        }
      };
    
      const handleRemoveDay = (index) => {
        const updated = workingHours.filter((_, i) => i !== index);
        setWorkingHours(updated);
      };

      const exists =  (day) => workingHours.some(day => day.day_of_week === day);

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
            <BootstrapDialog
                maxWidth={"md"}
                fullWidth
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
                    onClose={handleClose}>
                        { localization.modal.add_title(localization.sidebar.reviews)}

                </BootstrapDialogTitle>
                <form
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

error={!!(formik.touched.namekaa && formik.errors.namekaa)}
fullWidth
helperText={formik.touched.namekaa && formik.errors.namekaa}
label={localization.table.name + " " + localization.kaa}
name="namekaa"
onBlur={formik.handleBlur}
onChange={formik.handleChange}
type="text"
value={formik.values.namekaa}
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

error={!!(formik.touched.descriptionkaa && formik.errors.descriptionkaa)}
fullWidth

helperText={formik.touched.descriptionkaa && formik.errors.descriptionkaa}
label={localization.table.info + " " + localization.kaa}
name="descriptionkaa"
onBlur={formik.handleBlur}
onChange={formik.handleChange}
type="text"
value={formik.values.descriptionkaa}
multiline

minRows={4}
/>
                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.phone_number && formik.errors.phone_number)}
                                    fullWidth
                                    helperText={formik.touched.phone_number && formik.errors.phone_number}
                                    label={localization.table.phone_number}
                                    name="phone_number"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="tel"
                                    value={formik.values.phone_number}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <LocationModal setMapModal={setMapModal} mapModal={mapModal} localization={localization} />
                            </Box>

                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.cityuz && formik.errors.cityuz)}
                                    fullWidth
                                    helperText={formik.touched.cityuz && formik.errors.cityuz}
                                    autoComplete="off"
                                    label={localization.table.city + " " + localization.uz}
                                    name="cityuz"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.cityuz}
                                />
                                <TextField
                                    error={!!(formik.touched.cityru && formik.errors.cityru)}
                                    fullWidth
                                    helperText={formik.touched.cityru && formik.errors.cityru}
                                    autoComplete="off"
                                    label={localization.table.city + " " + localization.ru}
                                    name="cityru"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.cityru}
                                />
                            </Box>

                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.cityen && formik.errors.cityen)}
                                    fullWidth
                                    helperText={formik.touched.cityen && formik.errors.cityen}
                                    autoComplete="off"
                                    label={localization.table.city + " " + localization.en}
                                    name="cityen"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.cityen}
                                />
                                <TextField
                                    error={!!(formik.touched.citykaa && formik.errors.citykaa)}
                                    fullWidth
                                    helperText={formik.touched.citykaa && formik.errors.citykaa}
                                    autoComplete="off"
                                    label={localization.table.city + " " + localization.kaa}
                                    name="citykaa"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.citykaa}
                                />
                            </Box>


                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.stateuz && formik.errors.stateuz)}
                                    fullWidth
                                    helperText={formik.touched.stateuz && formik.errors.stateuz}
                                    autoComplete="off"
                                    label={localization.table.state + " " + localization.uz}
                                    name="stateuz"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.stateuz}
                                />
                                <TextField
                                    error={!!(formik.touched.stateru && formik.errors.stateru)}
                                    fullWidth
                                    helperText={formik.touched.stateru && formik.errors.stateru}
                                    autoComplete="off"
                                    label={localization.table.state + " " + localization.ru}
                                    name="stateru"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.stateru}
                                />
                            </Box>

                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.stateen && formik.errors.stateen)}
                                    fullWidth
                                    helperText={formik.touched.stateen && formik.errors.stateen}
                                    autoComplete="off"
                                    label={localization.table.state + " " + localization.en}
                                    name="stateen"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.stateen}
                                />
                                <TextField
                                    error={!!(formik.touched.statekaa && formik.errors.statekaa)}
                                    fullWidth
                                    helperText={formik.touched.statekaa && formik.errors.statekaa}
                                    autoComplete="off"
                                    label={localization.table.state + " " + localization.kaa}
                                    name="statekaa"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.statekaa}
                                />
                            </Box>
                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.zip_code && formik.errors.zip_code)}
                                    fullWidth
                                    helperText={formik.touched.zip_code && formik.errors.zip_code}
                                    autoComplete="off"
                                    label={localization.table.zip_code}
                                    name="zip_code"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.zip_code}
                                />
                                <TextField
                                    error={!!(formik.touched.floors && formik.errors.floors)}
                                    fullWidth
                                    helperText={formik.touched.floors && formik.errors.floors}
                                    autoComplete="off"
                                    label={localization.table.floors}
                                    name="floors"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.floors}
                                />
                            </Box>
                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.construction_date && formik.errors.construction_date)}
                                    fullWidth
                                    helperText={formik.touched.construction_date && formik.errors.construction_date}
                                    autoComplete="off"
                                    label={localization.table.construction_date}
                                    name="construction_date"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.construction_date}
                                />
                                {/* <TextField
                                    error={!!(formik.touched.floors && formik.errors.floors)}
                                    fullWidth
                                    helperText={formik.touched.floors && formik.errors.floors}
                                    autoComplete="off"
                                    label={localization.table.floors}
                                    name="floors"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.floors}
                                /> */}
                            </Box>

                            {workingHours.map((day, index) => (
        <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel id={`select-day-${index}`}>Day</InputLabel>
              <Select
    labelId={`select-day-${index}`}
    value={day.day_of_week}
    label="Day"
    onChange={(e) => handleChange(index, 'day_of_week', e.target.value)}
  >
    {dayOptions.map((option) => {
      const isAlreadySelected = workingHours.some(
        (d, i) => d.day_of_week === option && i !== index
      );
      return (
        <MenuItem
          key={option}
          value={option}
          disabled={isAlreadySelected}
        >
          {option}
        </MenuItem>
      );
    })}
  </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              type="time"
              label={localization.table.open_hour}
              value={day.start_time}
              onChange={(e) => handleChange(index, 'start_time', e.target.value)}
              fullWidth
              disabled={!day.is_open}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              type="time"
              label={localization.table.close_hour}
              value={day.end_time}
              onChange={(e) => handleChange(index, 'end_time', e.target.value)}
              fullWidth
              disabled={!day.is_open}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={day.is_open}
                  onChange={(e) => handleChange(index, 'is_open', e.target.checked)}
                />
              }
              label={day.is_open ? 'Open' : 'Closed'}
            />
          </Grid>

          <Grid item xs={12} sm={1}>
            <IconButton onClick={() => handleRemoveDay(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
              <Button
              disabled={workingHours?.length === 7}
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddDay}
        >
          Add Day
        </Button>
                          

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