// import { HashRouter } from "react-router-dom";

import { BrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import DiagnosisV2 from "../pages/doctor/DiagnosisV2";

import FollowUp from "../pages/compounder/FollowUp";
import CompounderDashboard from "../pages/compounder/Dashboard";
import RegisterPatient from "../pages/compounder/RegisterPatient";
import ReAppointment from "../pages/compounder/ReAppointment";
import TomorrowAppointments from "../pages/compounder/TomorrowAppointments";
import DoctorDashboard from "../pages/doctor/Dashboard";
import Diagnosis from "../pages/doctor/Diagnosis";
import AdminPanel from "../pages/doctor/AdminPanel";

import Patients from "../pages/admin/Patients";
import PatientDetails from "../pages/admin/PatientDetails";


import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";



      

      



function AppRoutes() {
  return (
    <BrowserRouter>
    {/* <HashRouter> */}
      <Routes>
        
        
        
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login />} />


        {/* <Route
          path="/compounder"
          element={
            <ProtectedRoute role="compounder">
            <Layout>
              <h1>Compounder Dashboard</h1>
            </Layout>
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
            <Layout>
              <h1>Doctor Dashboard</h1>
            </Layout>
            </ProtectedRoute>
            
          }
        /> */}

       
        {/* <Route
        path="/admin"
        element={
            <ProtectedRoute role="admin">
            <Layout>
                <h1>Admin</h1>
            </Layout>
            </ProtectedRoute>
        }
        /> */}
        <Route
        path="/compounder"
        element={
            <ProtectedRoute role="compounder">
            <Layout>
                <CompounderDashboard />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/compounder/followup"
        element={
            <ProtectedRoute role="compounder">
            <Layout>
                <FollowUp />
            </Layout>
            </ProtectedRoute>
        }
        />



        <Route
        path="/compounder/register"
        element={
            <ProtectedRoute role="compounder">
            <Layout>
                <RegisterPatient />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/compounder/reappointment"
        element={
            <ProtectedRoute role="compounder">
            <Layout>
                <ReAppointment />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/compounder/tomorrow"
        element={
            <ProtectedRoute role="compounder">
            <Layout>
                <TomorrowAppointments />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/doctor"
        element={
            <ProtectedRoute role="doctor">
            <Layout>
                <DoctorDashboard />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/doctor/diagnosis"
        element={
            <ProtectedRoute role="doctor">
            <Layout>
                <Diagnosis />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/diagnosis-v2"
        element={
            <ProtectedRoute role="doctor">
            <Layout>
                <DiagnosisV2 />
            </Layout>
            </ProtectedRoute>
        }
        />

        <Route
        path="/diagnosis-v2/:id"
        element={
            <ProtectedRoute role="doctor">
            <Layout>
                <DiagnosisV2 />
            </Layout>
            </ProtectedRoute>
        }
        />

        <Route
        path="/doctor/admin"
        element={
            <ProtectedRoute role="doctor">
            <Layout>
                <AdminPanel />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/admin"
        element={
            <ProtectedRoute role="admin">
            <Layout>
                <Patients />
            </Layout>
            </ProtectedRoute>
        }
        />
        <Route
        path="/admin/patient/:id"
        element={
            <ProtectedRoute role="admin">
            <Layout>
                <PatientDetails />
            </Layout>
            </ProtectedRoute>
        }
        />


      </Routes>
    {/* </HashRouter> */}
    </BrowserRouter>
  );
}

export default AppRoutes;