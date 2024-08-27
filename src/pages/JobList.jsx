import { useSelector } from "react-redux";
import Filter from "../components/Filter";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Card from "../components/Card";


const JobList = ({ retry }) => {
  const { jobs, isLoading, error } = useSelector((store) => store.jobReducer);
  // console.log(jobs);
  // console.log(error);
  return (
    <div className="list-page">
      <Filter />
      {isLoading ? (<Loader/>) : error ? (<Error message={error} retry={retry} />) : (
        <div className="cards-wrapper">
        {jobs.map((i) => (
          <Card key={i.id} job={i} />
        ))}
      </div>)}
    </div>
  )
}

export default JobList;
