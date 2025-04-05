/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { routeControler } from "src/utils/role-controler";
import { usePathname } from "next/navigation";


import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/orders-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import useFetcher from 'src/hooks/use-fetcher';
import AddCompanyModal from 'src/components/Modals/AddModal/AddCategory-modal';
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";




const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};





const Page = () => {
   const { data, loading, error, fetchData, createData } = useFetcher();
 const dispatch = useDispatch();

 
   const [searchValue, setSearchValue] = useState("");
   const [page, setPage] = useState(0);
   const { pageCount } = useSelector((state) => state.pageCount);
   const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
    const initalData = data[`/library/category/list/?page=${page + 1}&page_size=${rowsPerPage}&name=${searchValue}`];
  
    const customers = initalData?.current_page
    const [isLoading, setIsLoading] = useState(true);


 const { lang } = useSelector((state) => state.localiztion);

 const { localization } = Content[lang];
 useEffect(()=> {
  setTimeout(() => {
    setIsLoading(loading)
  }, 500);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [data])




  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

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
    fetchData(`/library/category/list/?page=${page + 1}&page_size=${rowsPerPage}&name=${searchValue}`);
    
  }

    useEffect(() => {
        getCountries();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, searchValue]);
  
  function onSearch(e) {
    setSearchValue(e.target.value)
  }




  
  
  return (
    <>
      <Head>
        <title>Library Categories | TMA </title>
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
            <Stack direction="row"
justifyContent="space-between"
spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{localization.sidebar.library_category}</Typography>
              </Stack>
              {/* {checkAccess && ( */}
                <div>
                  <AddCompanyModal getDatas={getCountries} />
                </div>
              {/* )} */}
            </Stack>
            <CustomersSearch forLabel={localization.sidebar.library_category} onSearch={onSearch}
type={"country"} />
            <CustomersTable
             isLoading={isLoading}

              count={initalData?.total_elements}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              type="librarycategory"
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
