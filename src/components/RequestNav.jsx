import React, {useState, useEffect} from "react"
import { Outlet, useNavigate } from "react-router-dom";

function RequestNav(){
  const [activeButton, setActiveButton] = useState(1);
  const navigate = useNavigate()
  const url = [
    "",
    "pending",
    "accepted",
    "rejected"
  ]

  useEffect(() => {
    handleButtonClick(1)
  }, [])
  

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    navigate(url[buttonId])
  }


    return(
      <>

      <div className="btn-group">
        <button className={`btn ${activeButton === 1 ? "active" : ""}`} onClick={() => handleButtonClick(1)}>Pendientes</button>
        <button className={`btn ${activeButton === 2 ? "active" : ""}`} onClick={() => handleButtonClick(2)}>Aceptadas</button>
        <button className={`btn ${activeButton === 3 ? "active" : ""}`} onClick={() => handleButtonClick(3)}>Rechazadas</button>
    </div>
        <div id="request-list">
            <Outlet/>
        </div>
      </>
      )
}

export default RequestNav