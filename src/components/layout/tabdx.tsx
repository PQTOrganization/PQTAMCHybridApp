import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TabDX = (props: { values: number[]; labels: string[] | number[] }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {/*
      <Box sx={{ width: "100%" }}>
        
  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>*/}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs dx"
        textColor="secondary"
        indicatorColor="secondary"
        TabIndicatorProps={{
          style: { background: "#8B0037" },
        }}
        sx={{ my: 2 }}
      >
        {props.labels.map((e, i) => {
          return (
            <Tab
              key={e}
              label={e}
              {...a11yProps(props.values[i])}
              color="secondary"
              sx={{
                backgroundColor:
                  value === props.values[i] ? "#8B0037" : "#FFFFFF",
                color: value === props.values[i] ? "#FFFFFF" : "#8B0037",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 1,
              }}
            />
          );
        })}
      </Tabs>
      {/*</Box> */}
      {/* <TabPanel key={1} value={value} index={props.values[0]}>
        {props.labels[0]}
      </TabPanel> */}
      {props.labels.map((e, i) => (
        <TabPanel key={e} value={value} index={props.values[i]}>
          {props.values[i]}
        </TabPanel>
      ))}
      {/*</Box> */}
    </>
  );
};

export default TabDX;
