import React from "react";
import "./Step1.css";

export default function Step1({
  selectedFrequency,
  selectedService,
  handleServiceChange,
  handleFrequencyChange,
  handleNextStep,
  error,
}) {
  return (
    <>
      <label htmlFor="service">Step 1: Type de services</label>
      <select
        id="service"
        name="service"
        value={selectedService}
        onChange={handleServiceChange}
      >
        <option value="">Sélectionnez un service:</option>
        <option value="regular-cleaning">Nettoyage régulier</option>
        <option value="deep-cleaning">Nettoyage profond</option>
        <option value="office-cleaning">Nettoyage de bureau</option>
        <option value="construction-cleaning">Apres-Construction</option>
      </select>

      <label htmlFor="frequency">Fréquence</label>
      <div className="frequency-inputs">
        <button
          type="button"
          // className="frequency-button"

          className={`frequency-button ${selectedFrequency == "once" ? "selected" : ""
            }`}
          value="once"
          onClick={handleFrequencyChange}
        >
          Une fois
        </button>
        <button
          type="button"
          className={`frequency-button ${selectedFrequency == "weekly" ? "selected" : ""
            }`}
          value="weekly"
          onClick={handleFrequencyChange}
        >
          Hebdomadaire -15%
        </button>
        <button
          type="button"
          className={`frequency-button ${selectedFrequency == "bi-weekly" ? "selected" : ""
            }`}
          value="bi-weekly"
          onClick={handleFrequencyChange}
        >
          Bi-hebdomadaire -10%
        </button>
        <button
          type="button"
          className={`frequency-button ${selectedFrequency == "monthly" ? "selected" : ""
            }`}
          value="monthly"
          onClick={handleFrequencyChange}
        >
          Mensuel -5%
        </button>
      </div>
      <button type="button" className="next-button" onClick={handleNextStep}>
        Next
      </button>
      {error && <p className="error-message">{error}</p>}
    </>
  );
}
