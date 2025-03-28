import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography, Breadcrumbs } from "@mui/material";

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/faq-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import useFetcher from 'src/hooks/use-fetcher';
import AddCompanyModal from 'src/components/Modals/AddModal/AddAnonsFaq-modal';
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";


const Page = () => {
  const { data, loading, error, fetchData, createData } = useFetcher();
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
  const [isLoading, setIsLoading] = useState(true);

  const initalData = data[`/announcement/faq/list/?page=${page + 1}&page_size=${rowsPerPage}`];

  const customers = initalData?.current_page

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];

console.log(initalData);

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
      fetchData(`/announcement/faq/list/?page=${page + 1}&page_size=${rowsPerPage}`);
  }

  useEffect(() => {
    getCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  function onSearch(e) {
    setSearchValue(e.target.value);
  }



  return (
    <>
      <Head>
        <title>Anons FAQ | TMA Admin </title>
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
                  {localization.sidebar.anons_faq}
                </Typography>
              </Stack>

              <div>
                <AddCompanyModal type="announcementfaq" getDatas={getCountries} />
              </div>
            </Stack>
            <CustomersSearch forLabel={localization.sidebar.anons_faq} onSearch={onSearch} type={"country"} />
            <CustomersTable
             isLoading={isLoading}
             
              count={initalData?.total_elements}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              data={data}
              type="anons-faq"
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
