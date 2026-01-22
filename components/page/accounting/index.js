import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  makeStyles,
  CardHeader,
  Grid,
  Utils,
} from "@material-ui/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

import AccountingBaseLayout from "../../base_layout/base-layout-sidemenu-accounting";

// Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); hanya satu kali register saja
//styles
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
//==styles
//graph data
const dataLine = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Maju Jaya Semesta",
      data: [30000000, 20000000, 28000000, 20000000, 10000000, 2000000],
      fill: false,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
    },
    {
      label: "Era Diesel Energy",
      data: [12000000, 0, 0, 39000000, 0, 35000000],
      fill: false,
      borderColor: "#742774",
    },
    {
      label: "Era Dipa Engineering",
      data: [0, 80000000, 0, 0, 20000000, 0],
      fill: false,
      borderColor: "#FF7F50",
    },
    {
      label: "Indofood",
      data: [10000000, 0, 17000000, 28000000, 0, 40000000],
      fill: false,
      borderColor: "#DE3163",
    },
    {
      label: "Unilever",
      data: [0, 80000000, 0, 5000000, 0, 5000000],
      fill: false,
      borderColor: "#40E0D0",
    },
  ],
};
const dataCostRevenueLine = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [140000000, 180000000, 111000000, 120000000, 100000000],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
    },
    {
      label: "Production Expenses",
      data: [84000000, 88000000, 65000000, 77900000, 119700000],
      fill: true,
      borderColor: "#742774",
    },
  ],
};

const dataDoughnut = {
  backgroundColor: [
    "rgb(2,88,25)",
    "rgb(249,151,0)",
    "rgb(255,199,0)",
    "rgb(32,214,152)",
  ],
  labels: ["Container Sale", "Maintenance", "Leasing", "Portacam"],
  datasets: [
    {
      label: "Tradecorp Income",
      data: [300, 50, 100, 300],
      backgroundColor: [
        "rgb(2,88,25)",
        "rgb(249,151,0)",
        "rgb(255,199,0)",
        "rgb(32,214,152)",
      ],
      hoverOffset: 4,
    },
  ],
};
const optionDoughnut = {
  elements: {
    arc: {
      weigth: 0.5,
      borderWidth: 3,
    },
    cutout: 150,
  },
};
//==graph data
export default function Page(props) {
  const classes = useStyles();

  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartDataPie, setChartDataPie] = useState({
    datasets: [],
  });

  const [chartDataBar, setChartDataBar] = useState({});
  const [chartDataCustomerBar, setChartDataCustomerBar] = useState({});
  const [chartDataBar2, setChartDataBar2] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartOptionsPie, setChartOptionsPie] = useState({});

  useEffect(() => {
    setChartDataBar({
      labels: ["Sales 1", "Sales 2", "Sales 3", "Sales 4", "Sales 5"],
      datasets: [
        {
          label: "Sales Top 5 Unit",
          data: [120, 110, 100, 92, 90],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
          ],

          borderWidth: 2,
        },
      ],
    });
  }, []);
  useEffect(() => {
    setChartDataBar2({
      labels: ["Sales 1", "Sales 2", "Sales 3", "Sales 4", "Sales 5"],
      datasets: [
        {
          label: "Sales Top 5 IDR",
          data: [83090000, 35000000, 41000000, 22920000, 59000000],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
          ],

          borderWidth: 2,
        },
      ],
    });
    setChartDataCustomerBar({
      labels: [
        "Maju Jaya Semesta",
        "Era Diesel Energy",
        "Era Dipa Engineering",
        "Indofood",
        "Unilever",
      ],
      datasets: [
        {
          label: "Customer Top 5 IDR",
          data: [120000000, 110000000, 100000000, 95000000, 90000000],
          // backgroundColor: [
          //   "rgba(255, 99, 132, 0.2)",
          //   "rgba(255, 159, 64, 0.2)",
          //   "rgba(255, 205, 86, 0.2)",
          //   "rgba(75, 192, 192, 0.2)",
          //   "rgba(54, 162, 235, 0.2)",
          // ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
          ],

          borderWidth: 2,
        },
      ],
    });
  }, []);

  useEffect(() => {
    setChartData({
      labels: ["January", "Febuary", "March", "April", "May"],
      datasets: [
        {
          label: "",
          data: [100, 105, 120, 121, 111],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
          ],

          borderWidth: 1,
        },
      ],
    });
  }, []);

  useEffect(() => {
    setChartDataPie({
      labels: ["Production", "Office", "Fuel", "Labour", "Maintenance"],
      datasets: [
        {
          label: "Expenses 2022",
          data: [1009249232, 105000333, 120234443, 121222433, 111423423],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
          ],

          borderWidth: 2,
        },
      ],
    });
  }, []);

  useEffect(() => {
    setChartOptions({
      responsive: true,

      plugins: {
        Legend: { position: "top" },
        title: {
          display: true,
          text: "Sales in a year",
        },
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },
    });
  }, []);
  useEffect(() => {
    setChartOptionsPie({
      responsive: true,

      plugins: {
        Legend: { position: "top" },
        title: {
          display: true,
          text: "Expenses  in a year 2022",
        },
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },
    });
  }, []);

  //graph

  //==graph
  return (
    <AccountingBaseLayout title="Accounting">
      <Grid justify="center" container spacing={2}>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Sales data in 2022"
              titleStyle={{ textAlign: "center" }}
            >
              {/* <Typography
                color="textSecondary"
                className={classes.title}
                gutterBottom
              >
                Sales in year 2022
              </Typography> */}
            </CardHeader>
            <CardContent>
              {" "}
              <Line data={chartData} id="barchart" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Product Expenses and Revenue"
              titleStyle={{ textAlign: "center" }}
            ></CardHeader>
            <CardContent>
              {" "}
              <Line data={dataCostRevenueLine} id="linechart" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid justify="center" container spacing={2}>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Expenses 2022"
              titleStyle={{ textAlign: "center" }}
            >
              {/* <Typography
                color="textSecondary"
                className={classes.title}
                gutterBottom
              >
                Sales in year 2022
              </Typography> */}
            </CardHeader>
            <CardContent>
              {" "}
              <Pie
                options={chartOptionsPie}
                data={chartDataPie}
                id="barchart"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Product Sales in 2022"
              titleStyle={{ textAlign: "center" }}
            ></CardHeader>
            <CardContent>
              <Doughnut data={dataDoughnut} options={optionDoughnut} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Customer Top 5 IDR"
              titleStyle={{ textAlign: "center" }}
            ></CardHeader>
            <CardContent>
              <Bar data={chartDataCustomerBar} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Top 5 customer sales trends"
              titleStyle={{ textAlign: "center" }}
            ></CardHeader>
            <CardContent>
              {" "}
              <Line data={dataLine} id="linechart" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Sales Top 5 Unit"
              titleStyle={{ textAlign: "center" }}
            ></CardHeader>
            <CardContent>
              <Bar data={chartDataBar} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardHeader
              title="Sales Top 5 IDR"
              titleStyle={{ textAlign: "center" }}
            ></CardHeader>
            <CardContent>
              <Bar data={chartDataBar2} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AccountingBaseLayout>
  );
}
