import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography, Breadcrumbs } from "@mui/material";
import { routeControler } from "src/utils/role-controler";
import { usePathname, useRouter } from "next/navigation";


import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';

import useFetcher from 'src/hooks/use-fetcher';
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";
import { useSearchParams } from 'next/navigation';




const Page = ({ subId, setSubId }) => {
  const { data, loading, error, fetchData, createData } = useFetcher();
  const dispatch = useDispatch();
  const params = useSearchParams();

  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);

  const initalData = data[`/news/list/?is_top=true&page=${page + 1}&page_size=${rowsPerPage}`];

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
      fetchData(`/news/list/?is_top=true&page=${page + 1}&page_size=${rowsPerPage}`);
  }

  useEffect(() => {
    getCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, page, rowsPerPage]);

  function onSearch(e) {
    setSearchValue(e.target.value);
  }




  return (
    <>
      <Head>
        <title>News  Banner | TMA Admin </title>
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
            <CustomersSearch forLabel={localization.sidebar.top_news} onSearch={onSearch} type={"country"} />
            <CustomersTable
             isLoading={isLoading}
             
              count={initalData?.total_elements}
              items={initalData?.current_page}
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
