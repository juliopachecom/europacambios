import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useDataContext } from "../Context/dataContext";
import flagEurope from '../Assets/Images/union-europea.png';
import flagVenezuela from '../Assets/Images/venezuelaflag.png';
import { Link } from 'react-router-dom';


function CurrencyCalculator() {
  const { infoTkn, url } = useDataContext();
  const [exchangeRate, setExchangeRate] = useState(0);
  const [eurAmount, setEurAmount] = useState(0);
  const [vefAmount, setVefAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchExchangeRate = async () => {
        try {
          const response = await axios.get(`${url}/CurrencyPrice`, {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          });
          const data = response.data;

          const rateData = data.find((item) => item.cur_id === 1);
          if (rateData) {
            setExchangeRate(rateData.cur_EurToBs);
          } else {
            setError('Tasa de cambio no encontrada para el cur_id 1');
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching exchange rate', error);
          setError('Error fetching exchange rate');
          setLoading(false);
        }
      };

    fetchExchangeRate();
  }, [infoTkn, url]);

  const handleEurChange = (e) => {
    const value = e.target.value;
    setEurAmount(value);
    setVefAmount(value * exchangeRate);
  };

  if (loading) return <div className="loading"><FaSpinner className="spinner" /> Cargando tasa de cambio...</div>;
  if (error) return <div className="error"><FaExclamationTriangle /> {error}</div>;

  return (
    <div className="currency-calculator">
      <h2><FaExchangeAlt /> Calculadora de Cambio</h2>
      <div className="calculator-horizontal">
        <div className="input-group">
          <label htmlFor="eur">
            <img src={flagEurope} alt="Bandera Europea" className="flag-icon" />
            Envías (EUR):
          </label>
          <input
            type="number"
            id="eur"
            value={eurAmount}
            onChange={handleEurChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="vef">
            <img src={flagVenezuela} alt="Bandera de Venezuela" className="flag-icon" />
            Recibes (VEF):
          </label>
          <input
            type="number"
            id="vef"
            value={vefAmount}
            readOnly
          />
        </div>
      </div>
      <div className="exchange-rate">
        <FaExchangeAlt className="exchange-icon" />
        <p className="rate-text">Tasa de cambio: <span className="rate-value">1 EUR = {exchangeRate} VES</span></p>
      </div>
      <Link to='/Login'><button>Enviar ahora</button></Link>
    </div>
  );
}

export { CurrencyCalculator };
