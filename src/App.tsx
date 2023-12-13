import { css, Global } from "@emotion/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Display from "./Display";
import Controller from "./Controller";

const globalStyle = css`
  body {
    margin: 0;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Controller />,
  },
  {
    path: "/display",
    element: <Display />,
  },
]);

const App = () => {
  return (
    <>
      <Global styles={globalStyle} />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
