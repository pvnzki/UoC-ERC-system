import React from 'react'
import ChooseApplicationCategory from "../../components/Applicant/SubmitApplication/ChooseApplicationCategory";
import ChooseResearchType from "../../components/Applicant/SubmitApplication/ChooseResearchType";
import ConfirmSubmission from "../../components/Applicant/SubmitApplication/ConfirmSubmission";
import DownloadForm from "../../components/Applicant/SubmitApplication/DownloadForm";
import MakePayment from "../../components/Applicant/SubmitApplication/MakePayment";
import UploadEvidence from "../../components/Applicant/SubmitApplication/UploadEvidence";

function SubmitApplication() {
  return (
    <div>
      <DownloadForm />
      <ChooseApplicationCategory />
      <UploadEvidence />
      <ChooseResearchType />
      <MakePayment />
      <ConfirmSubmission />
    </div>
  )
}

export default SubmitApplication