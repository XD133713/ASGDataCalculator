import React, {useEffect, useState} from "react";
import API_URL from "./api";
import {fetchAuthRefr} from "./Refresh";

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [savedCalculators, setSavedCalculators] = useState([]);
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userToEdit, setUserToEdit] = useState(null);
    const [showUserEditWindow, setShowUserEditWindow] = useState(false);

    const [calculatorToEdit, setCalculatorToEdit] = useState(null);
    const [showCalculatorEditWindow, setShowCalculatorEditWindow] = useState(false);

    const editUser = async () => {
        if (!userToEdit) return;

        try {
            const res = await fetchAuthRefr(`${API_URL}/accounts/adminUsers/${userToEdit.id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userToEdit.email,
                    email: userToEdit.email,
                    first_name: userToEdit.first_name,
                    is_staff: userToEdit.is_superuser,
                    is_superuser: userToEdit.is_superuser,
                    is_active: userToEdit.is_active,
                }),
            });
            if (!res.ok) throw new Error("Błąd edycji");

            const newUser = await res.json();
            setUsers (prev => prev.map(u => (u.id === newUser.id ? newUser : u)) );
            setUserToEdit(null);
            setShowUserEditWindow(false);
        } catch (err) {
            alert("Błąd edycji: " + err.message);
        }
        
    }

    const editCalculator = async () => {
        if (!calculatorToEdit) return;

        try {
            const res = await fetchAuthRefr(`${API_URL}/accounts/adminSavedCalculators/${calculatorToEdit.id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: calculatorToEdit.data,
                    user: Number(calculatorToEdit.user),
                }),
            });
            if (!res.ok) throw new Error("Błąd edycji");

            const newCalculator = await res.json();
            setSavedCalculators (prev => prev.map(c => (c.id === newCalculator.id ? newCalculator : c)) );
            setCalculatorToEdit(null);
            setShowCalculatorEditWindow(false);
        } catch (err) {
            alert("Błąd edycji: " + err.message);
        }
        
    }

    const deleteUser = async (id) => {
        if (!window.confirm("Czy na pewno?")) return;

        try {
            const res = await fetchAuthRefr(`${API_URL}/accounts/adminUsers/${id}/`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Błąd usuwania");

            setUsers (prev => prev.filter(i => i.id !== id));
        } catch (err) {
            alert("Błąd usuwania: " + err.message);
        }
    };

    const deleteCalculator = async (id) => {
        if (!window.confirm("Czy na pewno?")) return;

        try {
            const res = await fetchAuthRefr(`${API_URL}/accounts/adminSavedCalculators/${id}/`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error();

            setSavedCalculators(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            alert("Błąd usuwania: " + err.message);
        }
    };

    const fetchData = async () => {         
        try {
            const [usersRes, savedCalculatorsRes, reportRes] = await Promise.all([
                fetchAuthRefr(`${API_URL}/accounts/adminUsers/`),
                fetchAuthRefr(`${API_URL}/accounts/adminSavedCalculators/`),
                fetchAuthRefr(`${API_URL}/accounts/adminReport/`),
            ]);

            if (!usersRes.ok || !savedCalculatorsRes.ok || !reportRes.ok) {
                throw new Error("Błąd danych");
            }

            const usersData = await usersRes.json();
            const savedCalculatorsData = await savedCalculatorsRes.json();
            const reportData = await reportRes.json();
            
            setUsers(usersData);
            setSavedCalculators(savedCalculatorsData);
            setReport(reportData);
            setLoading(false);
            
        } catch (err) {
            console.error("Error:", err);
            setError("Brak dostępu do panelu admina");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">Error {error}</p>;

    return (
        <div>
            <h1>Panel Admina</h1>
        
                <h2>Konta</h2>
                {users.length === 0 ? (
                    <p>Brak danych.</p>
                ) : (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nazwa</th>
                            <th>Email</th>
                            <th>Uprawnienia</th>
                            <th>Aktywne</th>
                            <th>Edytuj</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.first_name}</td>
                                <td>{r.email}</td>
                                <td>{r.is_superuser ? "TAK" : "NIE"}</td>
                                <td>{r.is_active ? "TAK" : "NIE"}</td>
                                <td><button onClick={() => {setUserToEdit({...r}); setShowUserEditWindow(true);}}>Edytuj</button></td>
                                <td><button onClick={() => deleteUser(r.id)}>Usuń</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
    
                <h2>Zapisane kalkulatory</h2>
                {savedCalculators.length === 0 ? (
                    <p>Brak danych.</p>
                ) : (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Id Użytkownika</th>
                            <th>Email Użytkownika</th>
                            <th>Nazwa</th>
                            <th>Data Aktualizacji</th>
                            <th>Edytuj</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {savedCalculators.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.user}</td>
                                <td>{r.user_email}</td>
                                <td>{r.data?.name}</td>
                                <td>{r.updated_at}</td>
                                <td><button onClick={() => {setCalculatorToEdit({...r}); setShowCalculatorEditWindow(true);}}>Edytuj</button></td>
                                <td><button onClick={() => deleteCalculator(r.id)}>Usuń</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <h2>Raport ogólny</h2>
                {report.length === 0 ? (
                    <p>Brak danych.</p>
                ) : (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Użytkownik Id</th>
                            <th>Użytkownik Email</th>
                            <th>Liczba logowań</th>
                            <th>Ilość zapisań kalkulatora</th>
                        </tr>
                        </thead>
                        <tbody>
                        {report.map((r) => (
                            <tr key={r.user_id}>
                                <td>{r.user_id}</td>
                                <td>{r.user_email}</td>
                                <td>{r.login_amount}</td>
                                <td>{r.calculator_amount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {showUserEditWindow && userToEdit && (
                    <div className="modal-system">
                        <div className="modal-window">
                            <h3>Edycja konta</h3>
                            <div className="modal-content">
                            <label className="modal-content-row modal-user-line">Id: {userToEdit.id || ""}</label>
                            <label className="modal-content-row modal-user-line">Nazwa: <input type="text" value={userToEdit.first_name || ""} 
                                    onChange={(e) => setUserToEdit({...userToEdit, first_name: e.target.value,})}/></label>
                            <label className="modal-content-row modal-user-line">Email: <input type="text" value={userToEdit.email || ""} 
                                    onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value,})}/></label>
                            <label className="modal-content-row modal-user-line">Stan uprawnień administracyjnych: <input type="checkbox" checked={userToEdit.is_superuser} 
                                    onChange={(e) => setUserToEdit({...userToEdit, is_superuser: e.target.checked, })}/></label>
                            <label className="modal-content-row modal-user-line">Stan aktywnosci konta: <input type="checkbox" checked={userToEdit.is_active} 
                                    onChange={(e) => setUserToEdit({...userToEdit, is_active: e.target.checked, })}/></label>
                            </div>
                            <div>
                                    <button onClick={editUser}>Zapisz</button>
                                    <button onClick={() => {setUserToEdit(null); setShowUserEditWindow(false);}}>X</button>
                            </div>
                        </div>
                    </div>
                )}

                {showCalculatorEditWindow && calculatorToEdit && (
                    <div className="modal-system">
                        <div className="modal-window">
                            <h3>Edycja zapisu kalkulatora</h3>
                            <div className="modal-content">
                            <label className="modal-content-row modal-user-line">Id: {calculatorToEdit.id || ""}</label>
                            <label className="modal-content-row modal-user-line">ID Użytkownika: <input type="number" value={calculatorToEdit.user || ""} 
                                    onChange={(e) => setCalculatorToEdit({...calculatorToEdit, user: e.target.value, })}/></label>
                            <label className="modal-content-row modal-user-line">Nazwa: <input type="text" value={calculatorToEdit.data?.name || ""} 
                                    onChange={(e) => setCalculatorToEdit({...calculatorToEdit, data: {...calculatorToEdit.data, name: e.target.value},})}/></label>
                            </div>
                            <div>
                                    <button onClick={editCalculator}>Zapisz</button>
                                    <button onClick={() => {setCalculatorToEdit(null); setShowCalculatorEditWindow(false);}}>X</button>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
}


export default AdminPanel;            
