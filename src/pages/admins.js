import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/clients-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import useFetcher from 'src/hooks/use-fetcher';
import AddCompanyModal from 'src/components/Modals/AddModal/AddAdmin-modal';
import Content from "src/Localization/Content"
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";
import { routeControler } from "src/utils/role-controler";
import { usePathname } from 'next/navigation';


const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};





const Page = () => {
 const dispatch = useDispatch();

    const router = usePathname();
    const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
    const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);
  
   const { data, loading, error, fetchData } = useFetcher();
  const [searchValue, setSearchValue] = useState("");
   const { pageCount } = useSelector((state) => state.pageCount);
   const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
  const [page, setPage] = useState(0);
  const initalData = data["/admin"];
const [filtered, setFiltered] = useState(initalData || []);
  const customers = useCustomers(filtered, page, rowsPerPage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    setTimeout(() => {
      setIsLoading(loading)
    }, 500);
  }, [data])

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );
 const { lang } = useSelector((state) => state.localiztion);

 const { localization } = Content[lang];

 
    useEffect(() => {
      try {
        setPage(0)
        setFiltered(
          initalData.filter((user) => {
            if (searchValue == "") {
              return user;
            } else if (
              user?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
              user?.username?.toLowerCase().includes(searchValue.toLowerCase()
             )
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

  
  
  

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
            dispatch(changePage({ pageCount: event.target.value }));
        setPage(0);

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );




    const getCountries = () => {
   fetchData(`/admin`);
    };

  
    useEffect(() => {
      getCountries();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  

  
  function onSearch(e) {
    setSearchValue(e.target.value)
  }

 

  return (
    <>
      <Head>
        <title>Admins | TMA Admin</title>
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
                <Typography variant="h4">{localization.sidebar.admins}</Typography>
              </Stack>
             <div>
                <AddCompanyModal data={data}
getDatas={getCountries} />
              </div>
            </Stack>
            <CustomersSearch forLabel={localization.sidebar.admins} type="admin"
onSearch={onSearch} />
            <CustomersTable
             isLoading={isLoading}

              type="admin"
              extraData={data}
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

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
