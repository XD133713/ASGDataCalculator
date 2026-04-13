import React, { useEffect, useState } from "react";
import API_URL from "./api";
import {fetchAuthRefr} from "./Refresh";

function Report() {
  const [report, setReport] = useState(null);
  
  const fetchData = async () => {
      const res = await fetchAuthRefr(`${API_URL}/accounts/report/`)
      if (!res.ok) {console.error("Błąd pobierania danych"); return;}
      const data = await res.json();
      setReport(data);
    }
  useEffect(() => {
    fetchData();
  }, []);

  const [savedCalculatorsList, setSavedCalculatorsList] = useState([]);
  const [showSavedCalculatorsList, setShowSavedCalculatorsList] = useState(false);
  
  if (!report) return <p>Loading...</p>;
  
  const loadSavedCalculators = async () => {
        const res = await fetchAuthRefr(`${API_URL}/accounts/userSavedCalculators/`);
        if (!res.ok) {alert("Nie udało się pobrać zapisów"); return;}
        const data = await res.json();
        setSavedCalculatorsList(data);
        setShowSavedCalculatorsList(true);
    };

  const deleteSavedCalculator = async (id) => {
        if (!window.confirm("Usunąć zapisany kalkulator?")) return;
        try {
            const res = await fetchAuthRefr(`${API_URL}/accounts/userSavedCalculators/${id}/`, {
                method: "DELETE",
            });
            if (!res.ok) {
                alert("Nie udało się usunąć");
                return;
            }
            setSavedCalculatorsList(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Błąd połączenia z serwerem");
        }
    };
  
  return (
      <div>
        <h1>Raport</h1>
        <p>Liczba logowań: {report.login_amount}</p>
        <p>Liczba zapisanych kalkulatorów: {report.calculator_amount}{" "}{(localStorage.getItem("access")) && (<button onClick={loadSavedCalculators}>⌕</button>)}</p>

        {showSavedCalculatorsList && (
                <div className="modal-system" onClick={() => setShowSavedCalculatorsList(false)}>
                    <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Zapisane kalkulatory</h3>
                            <button className="modal-header-close" onClick={() => setShowSavedCalculatorsList(false)}>X</button>
                        </div>
                        <div className="modal-content">
                            {savedCalculatorsList.map((s) => (
                                <div className="modal-content-row" key={s.id}>
                                    <p className="modal-content-row-calculator">{s.data.name}</p>
                                    <button className="modal-content-row-delete" onClick={() => deleteSavedCalculator(s.id)}>🗑️</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
          )}

      </div>
    )
}

export default Report;
