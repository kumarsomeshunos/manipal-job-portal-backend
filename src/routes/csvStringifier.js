import {createObjectCsvStringifier as createCsvStringifier} from "csv-writer";
import Applicaton from "../models/Application.js";

const keyNameMap = new Map()


keyNameMap.set("research", "Research")
keyNameMap.set("orcid", "ORCiD")
keyNameMap.set("scopus", "Scopus")
keyNameMap.set("webofscience", "Web of Science")
keyNameMap.set("cif", "CIF")
keyNameMap.set("nop_total", "Total Projects")
keyNameMap.set("nop_ugc_care_list", "Number of Projects (UGC Care List)")
keyNameMap.set("nop_sci", "Number of Projects (SCI)")
keyNameMap.set("nop_web_science", "Number of Projects (Web of Science)")
keyNameMap.set("nop_google_scholar", "Number of Projects (Google Scholar)")
keyNameMap.set("nop_scopus", "Number of Projects (Scopus)")
keyNameMap.set("nop_three_total", "Total Projects in last 3 years")
keyNameMap.set("nop_three_ugc_care_list", "Number of Projects in last 3 years (UGC Care List)")
keyNameMap.set("nop_three_sci", "Number of Projects in last 3 years (SCI)")
keyNameMap.set("nop_three_web_science", "Number of Projects in last 3 years (Web of Science)")
keyNameMap.set("nop_three_google_scholar", "Number of Projects in last 3 years (Google Scholar)")
keyNameMap.set("nop_three_scopus", "Number of Projects in last 3 years (Scopus)")
keyNameMap.set("number_citations", "Number of Citations")
keyNameMap.set("completed_funded_projects", "Completed Funded Projects")
keyNameMap.set("amount_completed_funded_projects", "Amount of Completed Funded Projects")
keyNameMap.set("ongoing_funded_projects", "Ongoing Funded Projects")
keyNameMap.set("amount_ongoing_funded_projects", "Amount of Ongoing Funded Projects")
keyNameMap.set("presented_national", "Presented in National Conferences")
keyNameMap.set("presented_international", "Presented in International Conferences")
keyNameMap.set("attended_national", "Attended in National Conferences")
keyNameMap.set("attended_international", "Attended in International Conferences")
keyNameMap.set("organized_national", "Organized National Conferences")
keyNameMap.set("organized_international", "Organized International Conferences")
keyNameMap.set("guidance_completed_independent_mphil", "Research Guidance Completed Independently [3 Years] (M. Phil)")
keyNameMap.set("guidance_completed_independent_phd", "Research Guidance Completed Independently [3 Years] (Ph. D)")
keyNameMap.set("guidance_completed_supervisor_mphil", "Research Guidance Completed as Co-Supervisor [3 Years] (Total)")
keyNameMap.set("guidance_completed_supervisor_phd", "Research Guidance Completed as Co-Supervisor [3 Years] (Ph. D)")
keyNameMap.set("guidance_supervision_independent_mphil", "Research Guidance Under Supervision Independently [3 Years] (M. Phil)")
keyNameMap.set("guidance_supervision_independent_phd", "Research Guidance Under Supervision Independently [3 Years] (Ph. D)")
keyNameMap.set("guidance_supervision_supervisor_mphil", "Research Guidance Under Supervision as Co-Supervisor [3 Years] (M. Phil)")
keyNameMap.set("guidance_supervision_supervisor_phd", "Research Guidance Under Supervision as Co-Supervisor [3 Years] (Ph. D)")

keyNameMap.set("status", "Status")
keyNameMap.set("viewCount", "Application View Count")
keyNameMap.set("jobType", "Job Type")
keyNameMap.set("faculty", "Faculty")
keyNameMap.set("department", "Department")
keyNameMap.set("knowAnyoneInManipal", "Knows anyone in Manipal")
keyNameMap.set("interviewedInManipal", "Interviewed in Manipal before")

keyNameMap.set("applicant", "Applicant")
keyNameMap.set("firstName", "First Name")
keyNameMap.set("middleName", "Middle Name")
keyNameMap.set("lastName", "Last Name")
keyNameMap.set("dob", "Date of Birth")
keyNameMap.set("gender", "Gender")
keyNameMap.set("religion", "Religion")
keyNameMap.set("marital_status", "Marital Status")
keyNameMap.set("mobile", "Mobile")
keyNameMap.set("email", "Email")

keyNameMap.set("aq_secondary", "Secondary Education")
keyNameMap.set("aq_higher_secondary", "Higher Secondary Education")
keyNameMap.set("aq_graduation", "Graduation")
keyNameMap.set("aq_post_graduation", "Post Graduation")
keyNameMap.set("aq_mphil", "M. Phil")
keyNameMap.set("aq_phd", "Ph. D")
keyNameMap.set("aq_post_doctoral", "Post Doctoral")

keyNameMap.set("country", "Country")
keyNameMap.set("state", "State")
keyNameMap.set("city", "City")
keyNameMap.set("mode", "Mode")
keyNameMap.set("school", "School")
keyNameMap.set("board", "Board")
keyNameMap.set("passingYear", "Passing Year")
keyNameMap.set("division", "Division")
keyNameMap.set("percentage", "Percentage")
keyNameMap.set("stream", "Stream")
keyNameMap.set("institute", "Institute")
keyNameMap.set("college", "College")
keyNameMap.set("year", "Completion Year")
keyNameMap.set("area", "Area")
keyNameMap.set("course", "Course")
keyNameMap.set("teachingExperience", "Teaching Experience")

keyNameMap.set("academicQualification", "Academic Qualification")
keyNameMap.set("gate", "GATE")
keyNameMap.set("ugcNet", "UGC NET")
keyNameMap.set("ugcJrf", "UGC JRF")
keyNameMap.set("urcCsir", "URC CSIR")
keyNameMap.set("icmr", "ICMR")
keyNameMap.set("icar", "ICAR")
keyNameMap.set("gate_score", "GATE Score")
keyNameMap.set("ugcNet_score", "UGC NET Score")
keyNameMap.set("ugcJrf_score", "UGC JRF Score")
keyNameMap.set("urcCsir_score", "URC CSIR Score")
keyNameMap.set("icmr_score", "ICMR Score")
keyNameMap.set("icar_score", "ICAR Score")

keyNameMap.set("academicExperience", "Academic Experience")
keyNameMap.set("nonAcademicExperience", "Non Academic Experience")
keyNameMap.set("natureOfJob", "Nature of Job")
keyNameMap.set("university", "University")
keyNameMap.set("position", "Position")
keyNameMap.set("academicDomain", "Academic Domain")
keyNameMap.set("dateFrom", "Date From")
keyNameMap.set("dateTo", "Date To")
keyNameMap.set("organization", "Organization")
keyNameMap.set("designation", "Designation")

keyNameMap.set("fellowships", "Fellowships")
keyNameMap.set("books", "Books")
keyNameMap.set("patent", "Patents")
keyNameMap.set("patentDetail", "Patent Details")
keyNameMap.set("peerRecognition", "Peer Recognition")

keyNameMap.set("detailsOfKnown", "Details of the known person")
keyNameMap.set("name", "Name")
keyNameMap.set("relation", "Relation")

keyNameMap.set("interviewed", "Past Interview Details")
keyNameMap.set("date", "Date of Interview")
keyNameMap.set("result", "Result of Interview")
keyNameMap.set("givenOfferToJoin", "Given Offer to Join")
keyNameMap.set("joinInManipal", "Whether joined in Manipal")

keyNameMap.set("convicted", "Ever convicted before")
keyNameMap.set("convictedDetails", "Explanation of conviction")
keyNameMap.set("caseAgainstYou", "Any pending court case")
keyNameMap.set("caseDetails", "Explanation of pending court case")
keyNameMap.set("createdAt", "Created at")
keyNameMap.set("updatedAt", "Updated at")
keyNameMap.set("createdDate", "Created Date")

const keyValueMap = new Map()

const processPath = (path) => {
    let processedName = ""
    path.split(".").forEach((value, index) => {
        let a = keyNameMap.get(value)
        if (a === undefined) a = value
        processedName += a
        if (index < path.split(".").length - 1) {
            processedName += " > "
        }
    })
    return processedName
}

Applicaton.schema.eachPath(path => {
    keyValueMap.set(path, processPath(path))
})

const csvStringifier = () => {
    const header = []
    keyValueMap.forEach((value, key) => {
        header.push({ id: key, title: value })
    })
    return createCsvStringifier({
        header: header
    })
}

export default csvStringifier