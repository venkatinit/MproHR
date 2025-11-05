export interface EducationDetail {
    id: number;
    employeeId?: number | null;
    class: string;
    institute: string;
    board_University: string;
    year_Of_Passing: number;
    marks_Grade: string;
    attachment?: string | null;
    document_Path?: string;
}

export interface KycDocument {
    id: number;
    title: string;
    attachment?: string | null;
    path?: string;
}

export interface ExperienceDetail {
    id: number;
    company?: string;
    designation?: string;
    fromDate?: string;
    toDate?: string;
    document_Path?: string;
}

export interface Employee {
    id: number;
    company_Id: number;
    employee_Code: string;
    full_Name: string;
    date_Of_Birth: string;
    father_Name: string;
    mother_Name: string;
    gender: string;
    email: string;
    mobile_No: string;
    present_Address: string;
    permanent_Address: string;
    employee_Type: string;
    department: string;
    designation: string;
    technology: string;
    offer_Date: string;
    joining_Date: string;
    offer_Designation: string;
    offer_CTC: number;
    uaN_Number: string;
    pF_Number: string;
    aadhar_Number: string;
    paN_Number: string;
    referee_Name: string;
    referee_Contact: string;
    bank_Name: string;
    account_Number: string;
    ifsC_Code: string;
    educationDetails?: EducationDetail[];
    experienceDetails?: ExperienceDetail[];
    kycDocuments?: KycDocument[];
}
