import React, { useState } from 'react';
import './FacultyDashboardApp.css';

import ModulesPage        from './ModulesPage';
import DashboardLayout    from '../layouts/DashboardLayout';
import ProfilePage        from './profile/ProfilePage';
import EndorsementsPage   from './endorsements/EndorsementsPage';
import EndorsementsList   from './endorsements/EndorsementsList';
import ProjectsPage       from './projects/ProjectsPage';
//import ProposalsList      from './projects/ProposalsList';
import SanctionedList     from './projects/SanctionedList';
import CTDTPage           from './projects/ctdt/CTDTPage';
import ProjectStaffPage   from './projects/projectstaff/ProjectStaffPage';
import RequestFormsPage   from './projects/requestforms/RequestFormsPage';
import PaymentClaimsPage  from './projects/paymentclaims/PaymentClaimsPage';
import ZBASlipPage        from './projects/zbaslip/ZBASlipPage';
import TSASlipPage        from './projects/tsaslip/TSASlipPage';
import CMRGSlipPage       from './projects/cmrgslip/CMRGSlipPage';
import ConsultanciesPage  from './consultancies/ConsultanciesPage';
import TestingPage        from './testing/TestingPage';
import TrainingPage       from './training/TrainingPage';
import WorkshopsPage      from './workshops/WorkshopsPage';
import NewEndorsementPage from "./endorsements/new/NewEndorsementPage";
import { NewFormatReport } from "./endorsements/new/EndorsementReport";

function FacultyDashboardApp() {
  const [page, setPage] = useState("home");

  const navigate = (target) => setPage(target);

  if (page === "home") {
    return <ModulesPage onNavigate={navigate} />;
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return <ModulesPage onNavigate={navigate} />;
      case "profile":
        return <ProfilePage />;
      case "endorsements":
        return <EndorsementsPage onNavigate={navigate} />;
      case "endorsements-list":
        return <EndorsementsList onNavigate={navigate} />;
      case "endorsements-new":
        return <NewEndorsementPage onNavigate={navigate} />;

      case "endorsement-report":
        return <NewFormatReport onNavigate={navigate} />;
      case "projects":
        return <ProjectsPage onNavigate={navigate} />;
      
      case "sanctioned":
        return <SanctionedList onNavigate={navigate} />;
      case "ctdt":
        return <CTDTPage onNavigate={navigate} />;
      case "projectstaff":
        return <ProjectStaffPage onNavigate={navigate} />;
      case "requestforms":
        return <RequestFormsPage onNavigate={navigate} />;
      case "paymentclaims":
        return <PaymentClaimsPage onNavigate={navigate} />;
      case "zbaslip":
        return <ZBASlipPage onNavigate={navigate} />;
      case "tsaslip":
        return <TSASlipPage onNavigate={navigate} />;
      case "cmrgslip":
        return <CMRGSlipPage onNavigate={navigate} />;
      case "consultancies":
        return <ConsultanciesPage onNavigate={navigate} />;
      case "testing":
        return <TestingPage />;
      case "training":
        return <TrainingPage />;
      case "workshops":
        return <WorkshopsPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <DashboardLayout activePage={page} onNavigate={navigate}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default FacultyDashboardApp;