import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography, Breadcrumbs } from "@mui/material";
import { routeControler } from "src/utils/role-controler";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import useFetcher from "src/hooks/use-fetcher";
import AddCategoryModal from "src/components/Modals/AddModal/AddBuilding-modal";
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const Page = ({subIdSecond, setSubIdSecond}) => {
  const { data,  loading, error, fetchData } = useFetcher();
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

    const router = usePathname();
    const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
    const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);
  
  const [page, setPage] = useState(0);
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initalData =
    data[`/building/for-admin`] || [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [filtered, setFiltered] = useState(initalData);
  const customers = useCustomers(filtered, page, rowsPerPage);

  
  useEffect(()=> {
    setTimeout(() => {
      setIsLoading(loading)
    }, 500);
  }, [data])

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setPage(0);
      setFiltered(
        initalData?.filter((user) => {
          if (searchValue == "") {
            return user;
          } else if (
            user?.name?.[lang || "uz"].toLowerCase().includes(searchValue.toString().toLowerCase()) ||
            user?.description?.[lang].toLowerCase().includes(searchValue.toString().toLowerCase()) ||
            user?.address?.[lang].toLowerCase().includes(searchValue.toString().toLowerCase()) ||
            user?.phoneNumber?.toString().toLowerCase().includes(searchValue.toString().toLowerCase())
          ) {
            return user;
          }
        })
      );
    } catch (error) {
      setFiltered([]);
      console.error("Filtered Groups Error => ", error.message);
    }
  }, [initalData, searchValue]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    dispatch(changePage({ pageCount: event.target.value }));
    setPage(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  
  function getCountries() {
    fetchData(`/building/for-admin`);
  }

 

  useEffect(() => {
      getCountries();
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  function onSearch(e) {
    setSearchValue(e.target.value);
  }





  return (
    <>
      <Head>
        <title>Buildings | TMA Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
          
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" textTransform="capitalize">
                  { localization.sidebar.reviews
 }
                </Typography>
              </Stack>
              <div>
                  <AddCategoryModal getDatas={getCountries} subId={subIdSecond} type="mobile" />

              </div>
            </Stack>
            <CustomersSearch type="country" onSearch={onSearch} />
            <CustomersTable
             isLoading={isLoading}
              type="buildings"
              count={filtered?.length}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              getDate={getCountries}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
