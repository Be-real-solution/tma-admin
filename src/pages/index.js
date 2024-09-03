import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import useFetcher from "src/hooks/use-fetcher";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";




const CustomInput = styled.input`
  /* Add your custom styles here */
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius:10px;
`;
const CustomLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

const now = new Date();
const date = new Date();

const Page = () => {
  const matches = useMediaQuery("(max-width:480px)");

  const { data, loading, error, fetchData } = useFetcher();
  const [startTime, setstartTime] = useState(date.setDate(date.getDate() - 1));
  const [endTime, setEndTime] = useState(now.getTime());

 const { lang } = useSelector((state) => state.localiztion);

 const { localization } = Content[lang];


  


  function getCountries() {
    fetchData(`/statistics/all?start=${startTime}&end=${endTime}`);
  }

  
  // useEffect(() => {
  //     getCountries();
    
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [startTime, endTime]);

  const info = data[`/statistics/all?start=${startTime}&end=${endTime}`];
 
 
   const StatisticsData = [
     {
       label: localization.home.budget,
       value: info?.budget,
     },
     {
       label: localization.home.clients,
       value: info?.clients,
     },
     {
       label: localization.home.total_profit,
       value: info?.mainCheckout,
     },
     {
       label: localization.home.expenses,
       value: info?.expenses,
     },
   ];
 
  return (
    <>
      <Head>
        <title>Dashboard | TMA Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={
              matches
                ? { flexDirection: "column", mb: 3 }
                : { display: "flex", justifyContent: "right", mb: 3 }
            }
          >
            <CustomLabel>
              <b>{localization.home.start_time}</b>
              <ReactDatePicker
                customInput={<CustomInput style={matches ? { width: "100%" } : {}} />}
                selected={startTime}
                onChange={(date) => {
                  setstartTime(date.getTime());
                }}
              />
            </CustomLabel>
            <CustomLabel>
              <b>{localization.home.end_time}</b>
              <ReactDatePicker
                customInput={<CustomInput style={matches ? { width: "100%" } : {}} />}
                selected={endTime}
                onChange={(date) => {
                  setEndTime(date.getTime());
                }}
              />
            </CustomLabel>
          </Box>

          <Grid container spacing={3}>
            {StatisticsData &&
              StatisticsData.map((item, index) => (
                <Grid xs={12} key={index} sm={6} lg={3}>
                  <OverviewBudget
                    difference={12}
                    label={item?.label}
                    sx={{ height: "100%" }}
                    value={item?.value || 0}
                  />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
