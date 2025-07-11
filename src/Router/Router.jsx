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
import CampRegistrationForm from "../Pages/Camaping Related work/CampResistrationForm";
import Dashboard from "../Layouts/Dashboard";
import ManageRegisteredCamp from "../Pages/Dashboard/Organizer Dashboard/ManageRegisteredCamp";
import Contact from "../Pages/Contact/Contact";
import AddBootcamp from "../Pages/Dashboard/Organizer Dashboard/Add New Bootcamp/AddBootCamp";
import PrivateRoute from "../Routes/PrivateRoute";
import ManageCamps from "../Pages/Dashboard/Organizer Dashboard/Manage Camps/ManageCamps";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePageLayout,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/about',
        Component: About
      },
      {
        path:'/contact',
        Component: Contact
      }
      ,
      {
        path: 'availableBootcamp',
        element: <PrivateRoute><AvailableBootcamp /></PrivateRoute>,
        loader: () => fetch('http://localhost:3000/camps') // Load all camps data
      },
      {
        path: '/camps/:id',
        element: <CampDetails />,
        loader: ({ params }) => fetch(`http://localhost:3000/camps/${params.id}`)
      },
      {
        path: '/registration/:id',
        element: <CampRegistrationForm />,
        loader: ({ params }) => fetch(`http://localhost:3000/camps/${params.id}`)
      }
    ]
  },
  {
    path: "/auth",
    Component: Authentication,
    children: [
      {
        index: true,
        element: <Authentication />
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
  {
    path: "/dashboard",
    element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        path: 'manage_registered_camps',
        element: <ManageRegisteredCamp />,
        loader: () => fetch('http://localhost:3000/camps')
      },
      {
        path: 'addNewBootcamp',
        element: <AddBootcamp></AddBootcamp>
      },
      {
        path: 'manageCamps',
        element: <ManageCamps></ManageCamps>
      }
    ]
  }
]);

