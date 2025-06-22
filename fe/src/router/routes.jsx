import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import Login from "../pages/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ParentDashboard from "../pages/Parent/ParentDashboard";
import NurseDashboard from "../pages/Nurse/NurseDashboard";
import ParentLayout from "../layouts/ParentLayout";
import SendDrugForm from "../pages/Parent/SendDrugForm";
import VaccineInfo from "../pages/Parent/VaccineInfo";
import DrugTable from "../pages/Parent/DrugTable";
import SendDrugManagement from "../pages/Admin&Nurse/SendDrugManagement";
import UserManagement from "../pages/Admin/UserManagement";
import HealthProfile from "../pages/Parent/HealthProfile";
import DailyHealthRecord from "../pages/Admin&Nurse/DailyHealthRecord";
import NewVaccineCampaign from "../pages/Admin/NewVaccineCampaign";
import AddRecordPage from "../pages/Admin&Nurse/AddRecordPage";
import HealthRecord from "../pages/Parent/HealthRecord";
import VaccineCampaignDetails from "../pages/Admin/VaccineCampaignDetails";
import VaccineCampaignManagement from "../pages/Admin/VaccineCampaignManagement";
import VaccineStudentList from "../pages/Admin/VaccineStudentList";
import Survey from "../pages/Parent/Survey";
import VaccineReport from "../pages/Admin&Nurse/VaccineReport";
import RegularCheckup from "../pages/Admin&Nurse/RegularCheckup";
import StudentRegularCheckup from "../pages/Parent/StudentRegularCheckup";
import DiseaseRecordManagement from "../pages/Admin&Nurse/DiseaseRecordManagement";
import DiseaseRecordOfChildrenManagement from "../pages/Parent/DiseaseRecordofChildrenManagement";
import RegularCheckupDetails from "../pages/Admin&Nurse/RegularCheckupDetails";
import AddRegularCheckupCampaign from "../pages/Admin&Nurse/AddRegularCheckupCampaign";
import RegularCheckupRegisterList from "../pages/Admin&Nurse/RegularCheckupRegisterList";
import RegularCheckupSurvey from "../pages/Parent/RegularCheckupSurvey";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin"]} currentRole={"admin"} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path: "send-drug",
            element: <SendDrugManagement />,
          },
          {
            path: "user-manage",
            element: <UserManagement />,
          },
          {
            path: "vaccine-campaign",
            element: <VaccineCampaignManagement />,

          },
          {
            path: "daily-health",
            element: <DailyHealthRecord />,
          },
          {
            path: "vaccine-campaign-creation",
            element: <NewVaccineCampaign />,
          },
          {
            path: "add-record",
            element: <AddRecordPage/>
          },
          {
            path: "vaccine-campaign/:id",
            element: <VaccineCampaignDetails/>
          },
          {
            path: "vaccine-campaign/student-list/:id",
            element: <VaccineStudentList/>
          },
          {
            path: "regular-checkup",
            element: <RegularCheckup/>
          },
          {
            path: "report/:campaign_id",
            element: <VaccineReport/>
          },
          
          {
            path: "disease-record",
            element: <DiseaseRecordManagement/>
          },
          {
            path: "checkup-campaign/:checkup_id",
            element: <RegularCheckupDetails/>
          },
          {
            path: "checkup-campaign-creation",
            element: <AddRegularCheckupCampaign/>
          },
          {
            path: "checkup-campaign/:checkup-id/register-list",
            element: <RegularCheckupRegisterList/>
          }
        ],
      },
    ],
  },
  // Code Parent cũ
  // {
  //   path: "/parent",
  //   element: <PrivateRoute allowedRoles={["parent"]} currentRole={"parent"} />,
  //   children: [
  //     {
  //       path: "",
  //       element: <ParentLayout />,
  //     },
  //     {
  //       path: "edit",
  //       element: <ParentDashboard />,
  //     },
  //     {
  //       path: "edit/:student_id",
  //       element: <ParentLayout />,
  //       children: [
  //         {
  //           path: "survey/:campaign_id",
  //           element: <Survey/>
  //         },
  //         {
  //           path: "health-profile",
  //           element: <HealthProfile />,
  //         },
  //         {
  //           path: "drug-table",
  //           element: <DrugTable />,
  //         },
  //         {
  //           path: "send-drug-form",
  //           element: <SendDrugForm />,
  //         },
  //         {
  //           path: "vaccine-info",
  //           element: <VaccineInfo />,
  //         },
  //         {
  //           path: "health-record",
  //           element: <HealthRecord/>
  //         },
  //         {
  //           path: "regular-checkup",
  //           element: <StudentRegularCheckup/>
  //         },
  //         {
  //           path: "disease-record",
  //           element: <DiseaseRecordOfChildrenManagement/>
  //         }
  //       ],
  //     },
  //   ],
  // },
  {
    path: "/parent",
    element: <PrivateRoute allowedRoles={["parent"]} currentRole={"parent"} />,
    children: [
      {
        path: "",
        element: <ParentLayout />,
        children: [
          {
            path: "",
            element: <ParentDashboard />
          },
          {
            path: "edit",
            element: <ParentDashboard />
          }
        ]
      },
      {
        path: "edit/:student_id",
        element: <ParentLayout />,
        children: [
          {
            path: "survey/:campaign_id",
            element: <Survey/>
          },
          {
            path: "health-profile",
            element: <HealthProfile />,
          },
          {
            path: "drug-table",
            element: <DrugTable />,
          },
          {
            path: "send-drug-form",
            element: <SendDrugForm />,
          },
          {
            path: "vaccine-info",
            element: <VaccineInfo />,
          },
          {
            path: "health-record",
            element: <HealthRecord/>
          },
          {
            path: "regular-checkup",
            element: <StudentRegularCheckup/>
          },
          {
            path: "disease-record",
            element: <DiseaseRecordOfChildrenManagement/>
          },
          {
            path: "surveyCheckup/:checkup_id",
            element: <RegularCheckupSurvey/>
          },
        ],
      },
    ],
  },
  {
    path: "/nurse",
    element: <PrivateRoute allowedRoles={["nurse"]} currentRole={"nurse"} />,
    children: [
      {
        path: "/nurse",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <NurseDashboard />,
          },
          {
            path: "send-drug",
            element: <SendDrugManagement />,
          },
          {
            path: "daily-health",
            element: <DailyHealthRecord />,
          },
          {
            path: "add-record",
            element: <AddRecordPage/>
          },{
            path: "vaccine-campaign",
            element: <VaccineCampaignManagement/>
          },
          {
            path: "report/:campaign_id",
            element: <VaccineReport/>
          },
          {
            path: "regular-checkup",
            element: <RegularCheckup/>
          }
        ],
      },
    ],
  },
]);

export default routes;
