import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography, Breadcrumbs } from "@mui/material";
import { routeControler } from "src/utils/role-controler";
import { usePathname, useRouter } from "next/navigation";


import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import useFetcher from 'src/hooks/use-fetcher';
import AddCompanyModal from 'src/components/Modals/AddModal/AddNews-modal';
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";
import { useSearchParams } from 'next/navigation';



const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};





const Page = ({ subId, setSubId }) => {
  const { data, loading, error, fetchData, createData } = useFetcher();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const ParamId = params.get("id");
  const routers = useRouter();
  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);

  const initalData = data[`/new/carousel`];
  const [filtered, setFiltered] = useState(initalData || []);
  const customers = useCustomers(filtered, page, rowsPerPage);
  const [isLoading, setIsLoading] = useState(true);

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];


  useEffect(()=> {
    setTimeout(() => {
      setIsLoading(loading)
    }, 500);
  }, [data])

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
      dispatch(changePage({ pageCount: event.target.value }));
      setPage(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );



  function getCountries() {
      fetchData(`/new/carousel`);
  }

  useEffect(() => {
    getCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e) {
    setSearchValue(e.target.value);
  }



  useEffect(() => {
    try {
      setPage(0);
      setFiltered(
        initalData.filter((user) => {
          if (searchValue == "") {
            return user;
          } else if (
            user?.name?.[lang]?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.description?.[lang]?.toLowerCase().includes(searchValue.toString()?.toLowerCase())) {
            return user;
          }
        })
      );
    } catch (error) {
      setFiltered([]);
      console.error("Filtered Groups Error => ", error.message);
    }
  }, [initalData, searchValue]);

  return (
    <>
      <Head>
        <title>News | TMA Admin </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
      
                <Typography variant="h4" textTransform={"capitalize"}>
                  {localization.sidebar.top_news}
                </Typography>
              </Stack>

            
            </Stack>
            <CustomersSearch onSearch={onSearch} type={"country"} />
            <CustomersTable
             isLoading={isLoading}
             
              count={filtered?.length}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              data={data}
              type="news-banner"
              getDate={getCountries}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
