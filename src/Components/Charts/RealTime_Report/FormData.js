import axios from "axios";
import { useState, useEffect } from "react";
import BarChartT from "../../Templates/BarChartT";
import useDataStore from "../../../Store/useDataStore";


const mapper = (data) => {
  const labels = [];
  const seriesData = {
    form_start: [],
    form_submit: [],
  };

  const dataMap = {};
  let pagePath = "Bhumi Website Form Status"
  for (const item of data) {
    let pagePath = "Bhumi Website Form Status"
    const eventType = item.label1;
    const value = parseInt(item.value1);

    if (!dataMap[pagePath]) {
      dataMap[pagePath] = { form_start: 0, form_submit: 0 };
      labels.push(pagePath);
    }

    if (eventType === "form_start") {
      dataMap[pagePath].form_start += value;
    } else if (eventType === "form_submit") {
      dataMap[pagePath].form_submit += value;
    }
  }

  for (const label of labels) {
    seriesData.form_start.push(dataMap[label].form_start);
    seriesData.form_submit.push(dataMap[label].form_submit);
  }
  return { labels, seriesData };
};

const FormData = () => {
  const [data, setData] = useState({
    labels: [],
    seriesData: { form_start: [], form_submit: [] },
  });
  const {setLoader}=useDataStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(1);
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND}/analytics/realtime`,
          {
            dimensions: ["eventName"],
            metrics: ["eventCount"],
            dimensionFilter: [
              {
                fieldName: "eventName",
                filters: ["form_start", "form_submit"],
              },
            ],
          }
        );
        setData(mapper(response.data.data));
        setLoader(0);
      } catch (e) {
        setData({
          labels: [],
          seriesData: { form_start: [], form_submit: [] },
        });
      }
    };

    
    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval); 
  }, []);

  return <BarChartT data={data} />;
};


export default FormData;
