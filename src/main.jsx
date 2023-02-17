import React, { Children } from "react";
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorScreen from "./screens/ErrorScreen";
import AdminLoginScreen, { loginAction } from "./screens/AdminLoginScreen";
import { loader as disciplinesLoader, loader, PanelScreen } from "./screens/PanelScreen";
import DisciplineScreen, {loader as disciplineLoader, deleteAction, uploadImage, deleteImageAction} from "./screens/DisciplineScreen";
import DisciplineEditScreen, { newDisciplineLoader, editAction, createAction } from "./screens/DisciplineEditScreen";
import RequestNav from "./components/RequestNav";
import './index.css'
import './style.css'
import RequestList, { RequestListLoader } from "./components/RequestList";
import RequestScreen, {RequestAction, RequestLoader}from "./screens/RequestScreen";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLoginScreen/>,
    errorElement:<AdminLoginScreen/>,
    action: loginAction,
    loader: () => {return null}
  },
  {
    path:'panel',
    element: <PanelScreen/>,
    errorElement: <ErrorScreen />,
    // action:
    loader: disciplinesLoader,
    children:[
      {
        errorElement: <ErrorScreen/>,
        children:[
          {
            path:"discipline/create",
            element:<DisciplineEditScreen/>,
            loader: newDisciplineLoader,
            action: createAction
          },
      {
        path:'discipline/:id',
        element: <DisciplineScreen/>,
        loader:disciplineLoader,
        action: uploadImage
      },
      {
        path:'discipline/:id/edit',
        element:<DisciplineEditScreen/>,
        loader:disciplineLoader,
        action:editAction
      },
      {
        path:'discipline/:id/destroy',
        action:deleteAction
      },
      {
        path:'discipline/:id/image/destroy',
        action:deleteImageAction
      },
      {
        path:'request',
        //edit va acá???
        element: <RequestNav/>,
        children:[
          {
            path:':status',
            element: <RequestList/>,
            loader: RequestListLoader
          },
          {
            path:'id/:id',
            element:<RequestScreen/>,
            loader: RequestLoader,
            action: RequestAction,
          }
        ]
      },
    ]
    }
    ]
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
)
