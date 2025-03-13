/* eslint-disable react/jsx-max-props-per-line */
import PropTypes from "prop-types";
import Image from "next/image";
import { format, sub } from "date-fns";
import {
  Box,
  Card,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Backdrop,
  Typography,
  CircularProgress,
  Tooltip

} from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import { useEffect } from "react";
import DeleteModal from "src/components/Modals/DeleteModal";
import EditCompanyModal from "src/components/Modals/EditModal/EditBuilding-modal";
import EditCarModal from "src/components/Modals/EditModal/EditAnouns-modal";
import EditNews from "src/components/Modals/EditModal/EditNews-modal"
import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up"
    ref={ref}
    {...props} />;
});

const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    getDate,
    type,
    isLoading, setIsLoading

  } = props;
  const router = useRouter();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const { lang } = useSelector((state) => state.localiztion);
  const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
 
  const { localization } = Content[lang];

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (images) => {
    setOpen({ status: true, images });
  };

  const handleClose = () => {
    setOpen({ status: false, images: [] });
  };



  return (
    <Card>
      <AlertDialogSlide open={open}
        handleClose={handleClose} localization={localization} />

      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              {(type === "news" || type === "news-banner") ? (
                <TableRow>
                  <TableCell>{localization.table.image}</TableCell>
                  <TableCell>{localization.table.title}</TableCell>
                  <TableCell>{localization.table.info}</TableCell>
                  <TableCell>{localization.sidebar.category}</TableCell>
                  <TableCell>{localization.table.creator}</TableCell>
                  <TableCell>{localization.table.created_at}</TableCell>
                  {type !== "news-banner" && <TableCell>{localization.action}</TableCell>}
                </TableRow>
              ) : type === "announcment" ? (<TableRow>
                <TableCell>{localization.table.image}</TableCell>

                <TableCell>{localization.table.title}</TableCell>
                <TableCell>{localization.table.info}</TableCell>
                <TableCell>{localization.table.address}</TableCell>
                <TableCell>{localization.table.phone_number}</TableCell>
                <TableCell>{localization.table.grafik}</TableCell>
                <TableCell>{localization.action}</TableCell>
              </TableRow>) : type === "buildings" ? (
                <TableRow>
                  <TableCell>{localization.table.image}</TableCell>

                  <TableCell>{localization.table.title}</TableCell>
                  <TableCell>{localization.table.info}</TableCell>
                  <TableCell>{localization.table.address}</TableCell>
                  <TableCell>{localization.table.phone_number}</TableCell>
                  <TableCell>{localization.table.grafik}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              ) : (type === "category-faq" || type === "library") ? (
                <TableRow>

                  <TableCell>{localization.table.title}</TableCell>

                  <TableCell>{localization.table.created_at}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>{localization.table.image}</TableCell>
                  <TableCell>{localization.table.name + " UZ"}</TableCell>
                  <TableCell>{localization.table.name + " RU"}</TableCell>
                  <TableCell>{localization.table.name + " EN"}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              )}
            </TableHead>

            <TableBody>

              {isLoading ? <TableRow >
                <TableCell colSpan={7}>  <Box height={"200px"} display={"flex"} pt={5} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} >
                  <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  <h1>{localization.table.loading}</h1>
                </Box>
                </TableCell>
              </TableRow>
                : items.length ? items.map((customer) => {
                  const createdAt = (time) => format(new Date(time || customer?.createdAt || customer?.published_date || null), "dd/MM/yyyy HH:mm");

                  return (
                    <>
                      {type === "news" ? (
                        <TableRow hover key={customer.id}>
                          <TableCell onClick={() => handleClickOpen([customer?.cover_image, ...customer?.images])}>
                            {!!customer?.cover_image && (

                              <Image
                                priority
                                placeholder="blur" // You can use "empty" or a custom element as well
                                blurDataURL="/assets/errors/error-404.png"
                                src={customer.cover_image}
                                alt="image"
                                width={50}
                                height={50}
                                style={{ borderRadius: 10 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip arrow title={customer?.[`title_${lang}`]}
                            >
                              <Typography sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {customer?.[`title_${lang}`]}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip arrow title={customer?.[`content_${lang}`]}
                            >
                              <Typography sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>

                                {customer?.[`content_${lang}`]}

                              </Typography>
                            </Tooltip>
                          </TableCell>
                 
                          <TableCell>{customer?.category && customer?.category?.map((el, index)=> (<p key={index}>
{el?.[`name_${lang}`]}
                        </p>))}</TableCell>
                          <TableCell>{customer?.view_count}</TableCell>
                          <TableCell>{createdAt()}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <EditNews row={customer} route={`/news/update`} getDatas={getDate} />
                            <DeleteModal route={`/news/delete`} id={customer.id} getDatas={getDate} />
                          </TableCell>
                        </TableRow>
                      ) : type === "news-banner" ? <TableRow hover key={customer.id}>
                        <TableCell onClick={() => handleClickOpen([customer?.cover_image, ...customer.cover_image])}>
                          {customer.cover_image ? (

                            <Image
                              priority
                              placeholder="blur" // You can use "empty" or a custom element as well
                              blurDataURL="/assets/errors/error-404.png"
                              src={customer.cover_image}
                              alt="image"
                              width={50}
                              height={50}
                              style={{ borderRadius: 10 }}
                            />
                          ) : (<Image
                            priority
                            placeholder="blur" // You can use "empty" or a custom element as well
                            blurDataURL="/assets/errors/error-404.png"
                            src={"/assets/errors/error-404.png"}
                            alt="image"
                            width={50}
                            height={50}
                            style={{ borderRadius: 10 }}
                          />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip arrow title={customer.name}>
                            <Typography sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {customer.title}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        <TableCell>
                          <Tooltip arrow title={customer.content}>
                            <Typography sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>

                              {customer.content}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell><p >
                          {customer?.category?.name}
                        </p></TableCell>
                        <TableCell>{customer?.view_count}</TableCell>
                        <TableCell>{createdAt(customer?.published_date)}</TableCell>

                      </TableRow> : type === "announcment" ? <TableRow hover key={customer.id}>
                        <TableCell onClick={() => handleClickOpen([customer?.cover_image, ...customer.images])}>
                          {!!customer.images && (

                            <Image
                              priority
                              placeholder="blur" // You can use "empty" or a custom element as well
                              blurDataURL="/assets/errors/error-404.png"
                              src={customer.cover_image}
                              alt="image"
                              width={50}
                              height={50}
                              style={{ borderRadius: 10 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip arrow title={customer?.[`title_${lang}`]}
                          >
                            <Typography sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {customer?.[`title_${lang}`]}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip arrow title={customer?.[`content_${lang}`]}
                          >
                            <Typography sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>

                              {customer?.[`content_${lang}`]}

                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {customer?.category?.name}
                        </TableCell>
                        {/* <TableCell>{customer?.category && customer?.category?.map((el, index)=> (<p key={index}>
{el.name?.[lang]}
                        </p>))}</TableCell> */}
                        <TableCell>{customer?.view_count}</TableCell>
                        <TableCell>{createdAt()}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <EditCarModal row={customer} route={`/announcement/update`} getDatas={getDate} />
                          <DeleteModal route={`/announcement/delete`} id={customer.id} getDatas={getDate} />
                        </TableCell>
                      </TableRow> : type === "category-faq" ? (<TableRow hover key={customer.id}>


                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{createdAt(customer.created_at)}</TableCell>


                        <TableCell sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", py: '25px' }} onClick={(e) => e.stopPropagation()}>
                          <EditCompanyModal row={customer} route={`building`} getDatas={getDate} />
                          <DeleteModal route={`building/${customer.id}`} getDatas={getDate} />
                        </TableCell>
                      </TableRow>) : type === "buildings" ? (
                        <TableRow hover key={customer.id}>
                          <TableCell onClick={() => handleClickOpen([customer?.cover_image?.toString(), ...customer.images])}>
                            {!!customer.cover_image && (
                              <Image
                                priority
                                placeholder="blur" // You can use "empty" or a custom element as well
                                blurDataURL="/assets/errors/error-404.png"
                                src={customer.cover_image?.toString()}
                                alt="image"
                                width={50}
                                height={50}
                                style={{ borderRadius: 10 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip arrow title={customer?.[`name_${lang}`]}>
                              <Typography sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {customer?.[`name_${lang}`]}
                              </Typography>
                            </Tooltip>
                          </TableCell>

                          <TableCell>

                            <Tooltip arrow title={customer?.[`description_${lang}`]}>
                              <Typography sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {customer?.[`description_${lang}`]}

                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <a

                              target="_blank"
                              href={`https://www.google.com/maps?q=${customer?.lat},${customer?.lon}&z=15`}
                              rel="noreferrer"

                            >
                              {customer?.[`address_${lang}`]}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href={`tel:${customer?.contacts}`}>{customer?.contacts}</a>
                          </TableCell>
                          <TableCell>{`${customer?.workStartTime ? `${customer?.workStartTime} - ` : ""} ${customer?.workEndTime ? `${customer?.workEndTime} ` : ""}`}</TableCell>
                          <TableCell sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", py: '25px' }} onClick={(e) => e.stopPropagation()}>
                            <EditCompanyModal row={customer} route={`building`} getDatas={getDate} />
                            <DeleteModal route={`/building/delete`} id={customer.id} getDatas={getDate} />
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow hover key={customer.id}>
                          <TableCell>
                            <Image
                              priority
                              src={BaseUrl + "/file/banners/" + customer?.image}
                              alt="image"
                              width={150}
                              height={100}
                              style={{ borderRadius: 10 }}
                            />
                          </TableCell>
                          <TableCell>{customer.titleuz}</TableCell>
                          <TableCell>{customer.titleru}</TableCell>
                          <TableCell>{customer.titleen}</TableCell>
                          {/* <TableCell>{createdAt}</TableCell> */}
                          <TableCell>
                            <DeleteModal route={`banner/${customer.id}`} getDatas={getDate} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                }) : <TableRow >
                  <TableCell colSpan={7}>

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
        count={count}
        labelRowsPerPage={localization.table.rows_per_page}
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
  isLoading: PropTypes.bool,
  setIsLoading: PropTypes.func,
};





function AlertDialogSlide({ handleClose, open, localization }) {
  // Assuming Transition is defined and imported elsewhere
  // import Transition from '...';

  return (
    <React.Fragment>
      <Dialog
        open={open.status}
        TransitionComponent={Transition} // Ensure Transition is correctly imported or defined
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent >
          {open.images && (
            <Swiper
              style={{ width: "100%", height: "100%" }}
              // width={550}
              modules={[Navigation]} // Add Navigation and Pagination modules
              navigation // Enable navigation arrows

              spaceBetween={30}
              slidesPerView={1}
            >
              {open.images.map((image, index) => (
                <SwiperSlide key={image.id} >
                  <Image
                    placeholder="blur" // You can use "empty" or a custom element as well
                    blurDataURL="/assets/errors/error-404.png"
                    width={500}
                    height={400}
                    src={`${image.image ? image.image : image}`}
                    alt={`Image ${index + 1}`}
                    style={{ width: "100%", height: "350px" }} // Adjust size as needed
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{localization.close}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}