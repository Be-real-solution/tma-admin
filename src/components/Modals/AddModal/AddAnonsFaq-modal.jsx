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
import { SvgIcon, useMediaQuery, MenuItem, Chip, FormHelperText, FormControl, InputLabel, Select  } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
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
  const { fetchData, data, loading, error, createData } = useFetcher();
    const [open, setOpen] = React.useState(false);
    const { lang } = useSelector((state) => state.localiztion);
    const image = React.useRef("")
    const [isLoading, setIsLoading] = React.useState(false);

    const { localization } = Content[lang];
    const matches = useMediaQuery("(min-width:500px)");

  const categories = data["/announcement/faq/category/list/"]?.current_page;

  function getCountries() {
    fetchData(`/announcement/faq/category/list/`);
    
  }

    useEffect(() => {
        getCountries();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  

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
        formik.values.namekaa = ""
        formik.values.descriptionuz = ""
        formik.values.descriptionru = ""
        formik.values.descriptionen = ""
        formik.values.descriptionkaa = ""
        formik.values.category_id = ""
      handleClose()
    }

    const formik = useFormik({
        initialValues: {
            nameuz: "",
            nameru: "",
            nameen: "",
            namekaa: "",
            descriptionen: "",
            descriptionuz: "",
            descriptionru: "",
            descriptionkaa: "",
        category_id: "",
            submit: null,
        },
        validationSchema: Yup.object({
            nameuz: Yup.string().min(2).required("Name UZ is required"),
            nameru: Yup.string().min(2).required("Name RU is required"),
            nameen: Yup.string().min(2).required("Name EN is required"),
            namekaa: Yup.string().min(2).required("Name KAA is required"),
       descriptionen: Yup.string().min(2).required("Description EN is required"),
       descriptionuz: Yup.string().min(2).required("Description UZ is required"),
       descriptionru: Yup.string().min(2).required("Description RU is required"),
       descriptionkaa: Yup.string().min(2).required("Description KAA is required"),
       category_id: Yup.string().required("Category is required"),
          }),



        onSubmit: async (values, helpers) => {
            setIsLoading(true)
            try {
                const newData = {
                 "question": values.nameuz,
    "question_ru": values.nameru,
    "question_uz": values.nameuz,
    "question_en": values.nameen,
    "question_kaa": values.namekaa,
    "answer":values.descriptionuz,
    "answer_ru":values.descriptionru,
    "answer_en":values.descriptionen,
    "answer_uz":values.descriptionuz,
    "answer_kaa":values.descriptionkaa,
    "category": values.category_id
                    
                };
                createData(`/announcement/faq/create/`, newData, "POST", getDatas, onFinish);
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
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
onClose={handleClose}>
                             { localization.modal.add_title(type === "announcementfaq" ? localization.sidebar.anons_faq : localization.sidebar.library_category)}

                </BootstrapDialogTitle>
                <form noValidate
onSubmit={formik.handleSubmit}>
                    <DialogContent dividers>
                        <Stack spacing={3}
                            width={matches ? 400 : null}>
                            <FormControl fullWidth error={!!(formik.touched.category_id && formik.errors.category_id)}>
  <InputLabel  variant="filled" id="demo-simple-select-autowidth-label">{localization.sidebar.category}</InputLabel>
  <Select
    labelId="demo-simple-select-autowidth-label"
  label
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
                                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                                fullWidth
                                helperText={formik.touched.nameuz && formik.errors.nameuz}
                                autoComplete="off"
                                label={localization.table.question + " " + localization.uz}
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
                                label={localization.table.question + " " + localization.ru}
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
                                label={localization.table.question + " " + localization.en}
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
                                           label={localization.table.question + " " + localization.kaa}
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
                                         label={localization.table.answer + " "+ localization.uz}
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
                                         label={localization.table.answer + " "+ localization.ru}
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
                                         label={localization.table.answer + " "+ localization.en}
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
                                         label={localization.table.answer + " "+ localization.kaa}
                                         name="descriptionkaa"
                                         onBlur={formik.handleBlur}
                                         onChange={formik.handleChange}
                                         type="text"
                                         value={formik.values.descriptionkaa}
                                         multiline
                                                     
                                         minRows={4}
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
        </div>
    );
}