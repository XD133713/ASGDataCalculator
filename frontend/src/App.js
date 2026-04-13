import React, {useCallback, useEffect, useState} from "react";
import {Routes, Route, Link} from "react-router-dom";
import Weather from "./Weather";
import AdminPanel from "./AdminPanel";
import Calculator from "./Calculator";
import Report from "./Report";
import './main.css';
import Login from "./Login";
import Register from "./Register";
import API_URL from "./api";
import {fetchAuthRefr} from "./Refresh";

function App() {

    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));
    const [userFirstName, setUserFirstName] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const logout = useCallback(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setLoggedIn(false);
        setUserFirstName(null);
        setIsAdmin(false);
    }, []);

    const myName = useCallback(async () => {
        try {
            const res = await fetchAuthRefr(`${API_URL}/accounts/name/`);
            if (!res.ok) return;
            const data = await res.json();
            setUserFirstName(data.first_name);
            setIsAdmin(data.is_staff);
        } catch (err) {
            alert("Błąd pobierania nazwy")
        }
    }, []);

    useEffect(() => {
        if (loggedIn) myName();
    }, [loggedIn, myName]);


  return (
    <div>
      <nav>

        {loggedIn && isAdmin && (<Link to="/adminPanel">Panel Administratora</Link>)}
        {loggedIn && (<Link to="/report">Raport</Link>)}
        <Link to="/weather">Pogoda</Link>
        <Link to="/calculator">Kalkulator</Link>

            <div className="nav-auth">
              {loggedIn ? (
                  <>
                  <span className="nav-status">{userFirstName ? `${userFirstName}` : "Zalogowano"}</span>
                  <button className="button-logout" onClick={logout}>Wyloguj</button>
                  </>
              ) : (
                  <>
                      <Link to="/login">Logowanie</Link>
                      <Link to="/register">Rejestracja</Link>
                  </>
              )}
          </div>

      </nav>
      <Routes>
        {loggedIn && isAdmin && (<Route path="/adminPanel" element={<AdminPanel/>}/>)}
        {loggedIn && (<Route path="/report" element={<Report/>}/>)}
        <Route path="/weather" element={<Weather/>}/>
        <Route path="/calculator" element={<Calculator/>}/>

        {!loggedIn && (
              <>
              <Route
                path="/login"
                element={<Login onAuth={() => setLoggedIn(true)} />}
              />
              <Route
                path="/register"
                element={<Register onAuth={() => setLoggedIn(true)} />}
              />
              </>
        )}

        <Route path="*" element={<></>} />
      </Routes>
    </div>
  );
}

export default App;
