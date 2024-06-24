import axios from "axios";
import getYearFirst from "../../../Helpers/GetYearFirst";
import { useState, useEffect } from "react";
import MapChartT from "../../Templates/MapChartT";
import useDataStore from "../../../Store/useDataStore";

const date = getYearFirst() ;

const sortFunction = (a,b)=>{
  if(a[0]===b[0]) return 0;
  return a[1]<b[1]?-1:1;
}

const mapper = (data) => {
  var res = [["Country", "Users"]];
  for (let i of data) {
    res.push([i.label1, parseInt(i.value1)]);
  }
  res.sort(sortFunction);
  return res;
};

const RegionData = () => {
  const [data, setData] = useState([]);
  const {startDate,endDate} = useDataStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND}/analytics/report`,
          {
            dimensions: ["country"],
            metrics: ["totalUsers"],
            dateRanges: [[startDate, endDate]],
          }
        );
        setData(mapper(response.data.data));
      } catch (error) {
        console.log(error);
        setData([]);
      }
    };

    fetchData();
  }, [startDate,endDate]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center p-5">
      <MapChartT data={data} />
    </div>
  );
};

export default RegionData;
