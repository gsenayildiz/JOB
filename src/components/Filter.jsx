import Select from "./Select";
import { sortOpt, statusOpt, typeOpt } from '../constants/index';
import SubmitButton from './SubmitButton';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setError, setJobs, setLoading } from "../app/slices/jobSlice";
import api from "../utlis/api";


const Filter = () => {
  const dispatch = useDispatch();
    const [text, setText] = useState();
    const [sort, setSort] = useState();
    const [status, setStatus] = useState();
    const [type, setType] = useState(); 
    const [debouncedText, setDebouncedText] = useState();
  
 useEffect(() => {
  if(text === undefined) return;
  //sayac baslat  ve işlemi sayaç durduğunda yap
 const timer = setTimeout(() => setDebouncedText(text), 500);
  // eğer ki süre bitmeden tekrar useEffect çalışırsa(yeni sayaç başlaması) önceki sayacı iptal et
 return () => {
  clearTimeout(timer);
 }
}, [text]);

useEffect(() => {
  const sortParam = sort === "a-z" || sort === "z-a" 
    ? "company" 
    : sort === "En Yeni" || sort === "En Eski" 
    ? "date" 
    : undefined;

  const orderParam = 
    sort === "a-z" 
    ? "asc"
    : sort === "z-a"
    ? "dsc"
    : sort === "En Yeni"
    ? "dsc"
    : sort === "En Eski"
    ? "asc"
    : undefined;  

    const params = {
      q: text,
      _sort: sortParam,
      _order: orderParam,
      type: type || undefined,
      status: status || undefined,
    };
  
  dispatch(setLoading());

  api
    .get("/jobs", { params })
    .then((res) => dispatch(setJobs(res.data)))
    .catch((err) => dispatch(setError(err.message)));
}, [debouncedText, sort, type, status]);


 //formu sıfırla
 const handleReset = (e) =>{
  e.preventDefault();
// stateleri sıfırla
  setText();
  setDebouncedText();
  setSort();
  setStatus();
  setType();
  //inputları resetle
  e.target.reset();
 }

  return (
    <div className="filter-sec">
      <h2>Filtreleme Formu</h2>

      <form onSubmit={handleReset}>
        <div>
            <label>Ara</label>
            <input type="text" onChange={(e) => setText(e.target.value)}/>
        </div>

        <Select handleChange={(e) => setStatus(e.target.value)}  label={"Durum"} options={statusOpt}/>
        <Select handleChange={(e) => setType(e.target.value)} label={"Tür"} options={typeOpt}/>
        <Select handleChange={(e) => setSort(e.target.value)} label={"Sırala"} options={sortOpt}/>
         <div>
            <SubmitButton text={"Filtreyi Sıfırla"}/>
         </div>
      </form>
    </div>
  )
}

export default Filter;
