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

export default function AddCompanyModal({ getDatas, row, route, subId }) {
  const { fetchData, data, loading, error, createData } = useFetcher();
    const [open, setOpen] = React.useState(false);
    const { lang } = useSelector((state) => state.localiztion);
    const image = React.useRef("")
    const [isLoading, setIsLoading] = React.useState(false);

    const { localization } = Content[lang];
    const matches = useMediaQuery("(min-width:500px)");

  const categories = data["/announcement/faq/category/list/"]?.results;

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



    const formik = useFormik({
        initialValues: {
            nameuz:row?.question_uz,
            nameru: row?.question_ru,
            nameen: row?.question_en,
            namekaa: row?.question_kaa,
            descriptionuz: row?.answer_uz,
            descriptionru: row?.answer_ru,
            descriptionen: row?.answer_en,
            descriptionkaa: row?.answer_kaa,
            category_id: row?.category.id,
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
                createData(`${route}/${row.id}/`, newData, "PATCH", getDatas);
                setIsLoading(false)
                setOpen(false)
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
                    { localization.modal.addCategory.title}

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
                                         <TextField
                                         
                                         error={!!(formik.touched.descriptionkaa && formik.errors.descriptionkaa)}
                                         fullWidth
                                         helperText={formik.touched.descriptionkaa && formik.errors.descriptionkaa}
                                         label={localization.table.info + " "+ localization.kaa}
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
        </>
    );
}