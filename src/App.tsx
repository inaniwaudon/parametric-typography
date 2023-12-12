import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Operator from "./Operator";
import Display from "./Display";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Operator />,
  },
  {
    path: "/display",
    element: <Display />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
