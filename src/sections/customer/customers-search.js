import { useEffect, useState, useRef } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon, Box, TextField, MenuItem } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";


export const CustomersSearch = ({ onSearch, select,  type, extraData, forLabel }) => {



 const { lang } = useSelector((state) => state.localiztion);

 const { localization } = Content[lang];


  return (
    <Card sx={{ p: 2 }}>
      {type === "orders" ? (
        <Box sx={{ display: "flex", mr: 1 }}>
          <OutlinedInput
            onChange={(e) => onSearch(e)}
            fullWidth
            placeholder={forLabel + localization.table.search_by}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            sx={{ maxWidth: 300 }}
          />
          <TextField
            defaultValue={"all"}
            sx={{ width: 200, ml: 1 }}
            select
            label={localization.table.status}
            onChange={select.handleChange}
            type="text"
            value={select.value}
          >
            <MenuItem selected value="all">
              {localization.table.all}
            </MenuItem>
            <MenuItem value={"active"}>{localization.table.active}</MenuItem>
            <MenuItem value={"inactive"}>{localization.table.inactive}</MenuItem>
            <MenuItem value={"pending"}>{localization.table.pending}</MenuItem>
          </TextField>
        </Box>
      ) : (
        <OutlinedInput
          onChange={(e) => onSearch(e)}
          fullWidth
          placeholder={forLabel +localization.table.search_by}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
        />
      )}
    </Card>
  );
}