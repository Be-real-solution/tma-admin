import * as React from "react";
import PropTypes from "prop-types";
import { useEffect, useCallback } from 'react';
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import { SvgIcon, useMediaQuery, CircularProgress } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, TextField, Typography, MenuItem } from "@mui/material";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

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

export default function AddClientModal({ getDatas, type, row }) {
  const { lang } = useSelector((state) => state.localiztion);
  const matches = useMediaQuery("(min-width:500px)");
  const [isLoading, setIsLoading] = React.useState(false);

  const { localization } = Content[lang];

  const { createData } = useFetcher();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const formik = useFormik({
    initialValues: {
      name:row?.fullName,
      login:row.username,
      password:"",
      // tel_number: row.tel_number,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(' name is required'),
      login: Yup.string().required('Login is required'),
      // tel_number: Yup.number().required('Telephone number is required'),
      password: Yup.string().required('Password is required')
        // .matches(
        //   /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;'<>,.?/_₹]).{6,30}$/,
        //   'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be between 6 and 30 characters long'
        // )
       
    }),

    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {
        const newData = {
          fullName: values.name,
          username: values.login,
          // tel_number: values.tel_number,
        
        };
        if (values.password) {
          newData.password = values.password;
        }
        createData(`/admin/${row.id}`, newData, "PATCH", getDatas);
        setIsLoading(false)
        handleClose()
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });




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
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}>
          {localization.modal.addAdmins.editdeliver}

        </BootstrapDialogTitle>
        <form noValidate
        
          onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              width={matches ? 400 : null}>
              <TextField
                autoComplete="off"
                error={!!(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label={localization.table.name}
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.name}

              />

              {/* <TextField
                error={!!(formik.touched.tel_number && formik.errors.tel_number)}
                fullWidth
                helperText={formik.touched.tel_number && formik.errors.tel_number}
                label={localization.table.phone_number}
                name="tel_number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="tel"
                value={formik.values.tel_number}
              /> */}

              <TextField
                error={!!(formik.touched.login && formik.errors.login)}
                fullWidth
                helperText={formik.touched.login && formik.errors.login}
                label={localization.login.title}
                name="login"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.login}
              />
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label={localization.login.password}
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.password}
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
    </div>
  );
}
