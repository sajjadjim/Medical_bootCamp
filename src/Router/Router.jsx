import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import HomePageLayout from "../Layouts/HomePageLayout";
import { Component } from "react";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/Login";
import Authentication from "../Layouts/Authentication";
import About from "../Pages/About/About";
import Register from "../Pages/Authentication/Register";
import AvailableBootcamp from "../Pages/Available Bootcamp/AvailableBootcamp";
import CampDetails from "../Pages/Available Bootcamp/CampDetails";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePageLayout,
    children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: '/about',
        Component: About
      },
      {
        path:'availableBootcamp',
       element: <AvailableBootcamp></AvailableBootcamp>
      },
      {
        path:'/camps/:id',
        element:<CampDetails></CampDetails>,
        loader: ({params}) => fetch(`http://localhost:3000/camps/${params.id}`)
      }
    ]
  },
  {
   path: "/auth",
    Component: Authentication,
    children: [
      {
        index: true,
        element: Authentication
      },
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  },
]);

