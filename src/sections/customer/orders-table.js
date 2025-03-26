/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-max-props-per-line */
import PropTypes from "prop-types";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { useToasts } from "react-toast-notifications";
// import { routeControler } from "src/utils/role-controler";
import { useEffect } from "react";
import Image from "next/image";
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
import EditAnonsNetworkLink from "src/components/Modals/EditModal/EditAnonsNetworkLink";
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
            {type === "networklink" ?  <TableRow>
         <TableCell>{localization.table.country}</TableCell> 
                <TableCell>{localization.table.title + " uz"}</TableCell>
                <TableCell>{localization.table.title + " ru"}</TableCell>
                <TableCell>{localization.table.title + " ru"}</TableCell>
                <TableCell>{localization.table.title + " en"}</TableCell>
                <TableCell>{localization.table.link}</TableCell>
                <TableCell>{localization.action}</TableCell>
              </TableRow> : <TableRow>
              {type === "networkcategory" && <TableCell>{localization.table.image}</TableCell> }
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
                const createdAt = format(new Date(customer?.createdAt || null), "dd/MM/yyyy");
             

                return (
                  <>
              
                 {type === "networklink" ? ( <TableRow hover
                  key={customer.id}>
          
                   <TableCell>{customer?.category.name}</TableCell>
                   <TableCell>{customer?.title_uz}</TableCell>
                   <TableCell>{customer?.title_ru}</TableCell>
                   <TableCell>{customer?.title_en}</TableCell>
                   <TableCell>{customer?.title_kaa}</TableCell>                
                   <TableCell><a target="_blank" href={customer?.url}>Link</a></TableCell>
               <TableCell>
                     <EditAnonsNetworkLink row={customer} route={`category`} getDatas={getDate} />
                     <DeleteModal route={`/announcement/social/network/link/delete`} id={customer.id} getDatas={getDate} />
                   </TableCell> 
                 </TableRow>) : ( <TableRow hover
                   key={customer.id}>
                    {type === "networkcategory" && <TableCell>
                    {customer?.icon &&  <Image
                        src={customer?.icon}
                        alt={customer?.name_uz}
                        sx={{ width: 40, height: 40, borderRadius: 1 }}
                        width={40}
                        height={40}
                      />}
                    </TableCell> }
                    <TableCell>{customer?.name_uz}</TableCell>
                    <TableCell>{customer?.name_ru}</TableCell>
                    <TableCell>{customer?.name_en}</TableCell>
                    <TableCell>{customer?.name_kaa}</TableCell>                
              {type === "faq-categories"  ?       <TableCell>
                      <EditFaqCategoryModal type={"faqcategory"} row={customer} route={`/announcement/faq/category/update`} getDatas={getDate} />
                      <DeleteModal route={`/announcement/faq/category/delete`} id={customer.id} getDatas={getDate} />
                    </TableCell> :  type === "librarycategory"  ?       <TableCell>
                      <EditProductModal row={customer} route={`/library/category/update`} type={"librarycategory"} getDatas={getDate} />
                      <DeleteModal route={`/library/category/delete`} id={customer.id} getDatas={getDate} />
                    </TableCell> :  type === "networkcategory"  ?       <TableCell>
                      <EditProductModal type={"announcementnetwork"}  row={customer} route={`/announcement/social/network/link/category/update`} getDatas={getDate} />
                      <DeleteModal route={`/announcement/social/networks/link/category/delete`} id={customer.id} getDatas={getDate} />
                    </TableCell> :    <TableCell>
                      <EditProductModal type={"news"} row={customer} route={`category`} getDatas={getDate} />
                      <DeleteModal route={`/news/category/delete`} id={customer.id} getDatas={getDate} />
                    </TableCell> }
                  </TableRow>)}
                  </>
                );
              })  :     <TableRow >
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


