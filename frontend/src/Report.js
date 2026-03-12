import React, { useEffect, useState } from "react";
import API_URL from "./api";

function Report() {
  const [report, setReport] = useState(null);
  
  const fetchData = async () => {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_URL}/accounts/report/`, {headers: {Authorization: `Bearer ${token}`}})
      if (!res.ok) {console.error("Błąd pobierania danych"); return;}
      const data = await res.json();
      setReport(data);
    }
  useEffect(() => {
    fetchData();
  }, []);

  if (!report) return <p>Loading...</p>;
  
  return (
      <div>
        <h1>Raport</h1>
        <p>Liczba logowań: {report.login_amount}</p>
        <p>Liczba utworzonych kalkulatorów: {report.calculator_amount}</p>
      </div>
    )
}

export default Report;
