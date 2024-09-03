


import PropTypes from "prop-types";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { routeControler } from "src/utils/role-controler";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  MenuItem,
  Collapse,
  Typography,
  Button,
  SvgIcon,
  Backdrop,
  CircularProgress

} from "@mui/material";
import Link from "next/link";
import KeyboardArrowDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import KeyboardArrowUpIcon from "@heroicons/react/24/solid/ChevronUpIcon";

import DeleteModal from "src/components/Modals/DeleteModal";
import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import EditModal from "src/components/Modals/EditModal/EditAdmin-modal";
import useFetcher from "src/hooks/use-fetcher";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    getDate,
    type,
    data,
    isLoading, setIsLoading
  } = props;
  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);
  const {  loading, error, fetchData, createData } = useFetcher();

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const [open, setOpen] = useState(false);

const [mainImage, setMainImage] = useState("");
useEffect(() => {
  items.carid && setMainImage(items?.carid?.images[0]);
}, [items.carid]);
  
  

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
             
                <TableRow>
                  <TableCell>{localization.table.name}</TableCell>
                  <TableCell>{localization.login.title}</TableCell>
                  {/* <TableCell>{localization.table.phone_number}</TableCell> */}

                  <TableCell>{localization.table.created_at}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
            
            </TableHead>
            <TableBody>
     
              {isLoading ? <TableRow >
  <TableCell colSpan={7}>  <Box height={"200px"} display={"flex"} pt={5} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} >
  <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <h1>{localization.table.loading}</h1>
              </Box> 
              </TableCell>
              </TableRow> :  items.length ? items.map((customer, index) => {
                const createdAt = format(new Date(customer?.createdAt), "dd/MM/yyyy HH:mm");
            

             
                return (
                  <TableRow hover key={customer.id}>
                    <TableCell>{customer?.fullName}</TableCell>
                    <TableCell>{customer?.username}</TableCell>
                    {/* <TableCell>
                      <a href={`tel:+${customer?.tel_number}`}>+{customer?.tel_number}</a>
                    </TableCell> */}
                    <TableCell>{createdAt}</TableCell>
                    <TableCell sx={{display:"flex", flexDirection:"row", alignItems:"flex-start", py:'25px'}}>
                      <EditModal row={customer} route={`admin`} getDatas={getDate} />
                      <DeleteModal route={`admin/${customer.id}`} getDatas={getDate} />
                    </TableCell>
                  </TableRow>
                );
              }) : 
              <TableRow >
                <TableCell colSpan={4}>

              <Box height={"200px"} display={"flex"} pt={5} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} >
              <img
              alt="Under development"
              src="/assets/errors/error-404.png"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                width: 120,
              }}
            />
                <h1>{localization.table.not_found}</h1>
                </Box>
                </TableCell>
               </TableRow>
                }
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        labelRowsPerPage={localization.table.rows_per_page}
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  isLoading:PropTypes.func,
  setIsLoading:PropTypes.bool,
};
