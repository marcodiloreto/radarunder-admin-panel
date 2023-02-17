import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorScreen = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-screen">
      <h1>Oops!</h1>
      <p>Lo sentimos, ha ocurrido un error</p>
      <p>
        <i>{error.status + ": " + error.statusText}</i>
      </p>
    </div>
  );
}

export default ErrorScreen