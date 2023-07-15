import React, { useState } from "react";
import axios from "axios";
import { getToken } from '../tokenservice';
import PricingCalculator from "./PricingCalculator";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";

export default function MultiStepForm() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [city, setCity] = useState("");
  const [telephone, setTelephone] = useState("");
  const [step, setStep] = useState(1);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");


  const handleServiceChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedService(selectedValue);
  };

  const handleFrequencyChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFrequency(selectedValue);
  };

  const handleAddonToggle = (addon) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(
        selectedAddons.filter((selectedAddon) => selectedAddon !== addon)
      );
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };
  const applyCoupon = () => {
    if (coupon === "Free22") {
      setAppliedCouponCode(coupon);
    }
  };

  const handleCouponChange = (event) => {
    setCoupon(event.target.value);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      case "telephone":
        setTelephone(value);
        break;
      default:
        break;
    }
  };

  const handleNextStep = async () => {
    if (step === 1 && (!selectedService || !selectedFrequency)) {
      setError("Please complete all fields before moving to the next step.");
      return;
    }
    if (
      step === 3 &&
      (!firstName || !lastName || !email || !address || !city)
    ) {
      setError("Please complete all fields before moving to the next step.");
      return;
    }
    if (step === 5 && (!date || !time)) {
      setError("Please select date and time before moving to the next step.");
      return;
    } else {
      setError("");
      setStep(step + 1);
    }
  };

  const handleBackStep = () => {
    if (step === 5) {
      setDate("");
      setTime("");
    }
    if (step === 4) {
      setCoupon("");
      setAppliedCouponCode("");
    }
    if (step === 3) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setAddress("");
      setCity("");
    }
    if (step === 2) {
      setSelectedAddons([]);
    }
    if (step === 1) {
      setSelectedService("");
      setSelectedFrequency("");
    }

    setStep(step - 1);
  };

  const handleSubmit = async () => {


    let obj = {
      "id": "",
      "customerId": "",
      "typeOfServices": selectedService,
      "frequency": selectedFrequency,
      "options": selectedAddons,
      "userDetails": {
        "username": "",
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phone": telephone,
        "address": address,
        "city": city
      },
      "couponCode": coupon,
      "bookingDateTime": "2023-07-11T10:00:00",
      // "bookingDate": date,
      // "bookingTime": time,
      "confirmed": true
    }


    console.log(obj)

    try {
      const tokenPromise = getToken(); // Get the token promise
      const token = await tokenPromise; // Await the token promise to get the actual token value
      const formattedToken = JSON.parse(token);
      if (token) {
        console.log("Token retrieved successfully");

        const response = await fetch("http://localhost:5555/api/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formattedToken}`,
          },
          body: JSON.stringify(obj),
        });

        const data = await response.json();
        console.log("Response from server:", data);
        // setSubmitting(false);
        setStep(6)
      } else {
        console.log("Token is not available or expired");
      }
    } catch (error) {
      console.log("Error occurred during fetch: ", error);
      // setSubmitting(false);
    }

  };



  return (
    <section className="form-section">
      <div className="form-container">
        <div className="left-infos">
          <form>
            {step === 1 && (
              <Step1
                selectedService={selectedService}
                selectedFrequency={selectedFrequency}
                handleServiceChange={handleServiceChange}
                handleFrequencyChange={handleFrequencyChange}
                handleNextStep={handleNextStep}
                error={error}
              />
            )}
            {step === 2 && (
              <Step2
                selectedAddons={selectedAddons}
                handleAddonToggle={handleAddonToggle}
                handleNextStep={handleNextStep}
                handleBackStep={handleBackStep}
              />
            )}
            {step === 3 && (
              <Step3
                firstName={firstName}
                lastName={lastName}
                email={email}
                address={address}
                city={city}
                telephone={telephone}
                error={error}
                handleInputChange={handleInputChange}
                handleNextStep={handleNextStep}
                handleBackStep={handleBackStep}
              />
            )}
            {step === 4 && (
              <Step4
                coupon={coupon}
                appliedCouponCode={appliedCouponCode}
                handleCouponChange={handleCouponChange}
                applyCoupon={applyCoupon}
                handleNextStep={handleNextStep}
                handleBackStep={handleBackStep}
              />
            )}
            {step === 5 && (
              <Step5
                date={date}
                setDate={setDate}
                time={time}
                setTime={setTime}
                handleNextStep={handleNextStep}
                handleBackStep={handleBackStep}
                handleSubmit={handleSubmit}
              />
            )}
            {step === 6 && <Step6 />}
          </form>
        </div>

        <div className="right-infos">
          {step !== 6 && (
            <PricingCalculator
              selectedService={selectedService}
              selectedFrequency={selectedFrequency}
              selectedAddons={selectedAddons}
              couponCode={appliedCouponCode}
            />
          )}
        </div>
      </div>
    </section>
  );
}