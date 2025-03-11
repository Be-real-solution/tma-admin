/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-max-props-per-line */
import Image from "next/image";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { useToasts } from "react-toast-notifications";
// import { routeControler } from "src/utils/role-controler";
import { useEffect } from "react";
import {
  Box,
  Card,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Backdrop,
  CircularProgress

} from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import DeleteModal from "src/components/Modals/DeleteModal";
import EditProductModal from "src/components/Modals/EditModal/EditCategory-modal";
import EditFaqCategoryModal from "src/components/Modals/EditModal/EditFaqCategory-modal";


import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";

export const CustomersTable = (props) => {
  const {
    count = 0,
    type,
    items = [],
  
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    getDate,
    isLoading, setIsLoading
  } = props;
  const { createData, fetchData, data } = useFetcher();

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

  const router = usePathname();
  const {addToast} = useToasts();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;

  // const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);




  

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
            {type === "advertisment" ?  <TableRow>
                <TableCell>{localization.table.name + " uz"}</TableCell>
                <TableCell>{localization.table.name + " ru"}</TableCell>
                <TableCell>{localization.table.name + " en"}</TableCell>
                <TableCell>{localization.table.name + " kaa"}</TableCell>
                <TableCell>{localization.action}</TableCell>
              </TableRow> : <TableRow>
                <TableCell>{localization.table.name + " uz"}</TableCell>
                <TableCell>{localization.table.name + " ru"}</TableCell>
                <TableCell>{localization.table.name + " en"}</TableCell>
                <TableCell>{localization.table.name + " kaa"}</TableCell>
                <TableCell>{localization.action}</TableCell>
              </TableRow>}
            </TableHead>
            <TableBody>
         
              {isLoading ? <TableRow >
  <TableCell colSpan={7}>  <Box height={"200px"} display={"flex"} pt={5} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} >
  <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <h1>{localization.table.loading}</h1>
              </Box> 
              </TableCell>
              </TableRow> : items.length ? items.map((customer) => {
                const createdAt = format(new Date(customer?.createdAt || customer?.published_date || null), "dd/MM/yyyy HH:mm");
                // const customAt = format(
                //   new Date(customer?.custom_date ? customer?.custom_date : null)?.getTime(),
                //   "dd/MM/yyyy HH:mm"
                // );

                return (
                <>
                {type === "advertisment" ?  <TableRow hover
                   key={customer.id}>
                    <TableCell>
                      <Image
                      width={50}
                      height={50}
                        src={customer?.image.toString()?.replace("http", "https")}
                        alt={"Image"}
                        style={{ width: 50, height: 50 }}/>
                    </TableCell>

                    <TableCell><a target="_blank" href={`${customer?.url}`}>Link</a></TableCell>
                    <TableCell>{customer?.view_count}</TableCell>
                    <TableCell>{ createdAt}</TableCell>
              
     
            
                 
                  
                     <TableCell>
                      <EditFaqCategoryModal row={customer} route={`/announcement/update`} getDatas={getDate} />
                      <DeleteModal route={`/advertisement/delete`} id={customer.id} getDatas={getDate} />
                    </TableCell> 
                  </TableRow> :   <TableRow hover
                   key={customer.id}>
                    <TableCell>
                      <Image
                      width={50}
                      height={50}
                        src={customer?.image.toString()?.replace("http", "https")}
                        alt={"Image"}
                        style={{ width: 50, height: 50 }}/>
                    </TableCell>
                    <TableCell>{customer?.title}</TableCell>
                    <TableCell>{customer?.description}</TableCell>
                    <TableCell>{customer?.category?.name}</TableCell>
                    <TableCell>{customer?.author}</TableCell>
                    <TableCell>{customer?.price}</TableCell>
                    <TableCell>{customer?.download_count}</TableCell>
                    <TableCell>{customer?.views_count}</TableCell>
                    <TableCell>{customer?.is_free ? "free" : "paid"}</TableCell>
                    <TableCell>{ createdAt}</TableCell>
                 <TableCell>
                      <EditProductModal row={customer} route={`library`} getDatas={getDate} />
                      <DeleteModal route={`/library/delete`} id={customer.id} getDatas={getDate} />
                    </TableCell>
                  </TableRow>}
                </>
                );
              }) :      <TableRow >
              <TableCell  colSpan={5}>

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
             </TableRow>}
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
  type: PropTypes.string,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSubmit: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  isLoading:PropTypes.func,
  setIsLoading:PropTypes.bool,
};


