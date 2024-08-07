// Steps
// import {} from "react-icons/ri";

export const BusinessOnboardingSteps: Array<{
  label: string;
  id: number;
  number: number;
  solved?: boolean;
}> = [
  {
    label: "Business",
    id: 0,
    number: 1,
  },
  {
    label: "Contact & Identity",
    id: 1,
    number: 2,
  },
  {
    label: "Director",
    id: 2,
    number: 3,
  },
  {
    label: "Documents",
    id: 3,
    number: 4,
  },
];

export const LoanOnboardingSteps: Array<{
  label: string;
  id: number;
  number: number;
}> = [
  {
    label: "Basic",
    id: 0,
    number: 1,
  },
  {
    label: "Repayment",
    id: 1,
    number: 2,
  },
  {
    label: "Documents",
    id: 2,
    number: 3,
  },
];

export const CustomerOnboardingSteps: Array<{
  label: string;
  id: number;
  number: number;
  solved: boolean;
}> = [
  {
    label: "Personal",
    id: 0,
    number: 1,
    solved: false,
  },
  {
    label: "Contact & Identity",
    id: 1,
    number: 2,
    solved: false,
  },
  {
    label: "Next of Kin",
    id: 2,
    number: 3,
    solved: false,
  },
  {
    label: "Employment",
    id: 3,
    number: 4,
    solved: false,
  },
  {
    label: "Documents",
    id: 4,
    number: 5,
    solved: false,
  },
];

export const CustomerTitle = [
  {
    label: "Mr",
    value: "Mr",
  },
  {
    label: "Mrs",
    value: "Mrs",
  },
  {
    label: "Ms",
    value: "Ms",
  },
  {
    label: "Dr",
    value: "Dr",
  },
  {
    label: "Chief",
    value: "Chief",
  },
];

export const CustomerMaritalStatus = [
  {
    label: "Single",
    value: "SINGLE",
  },
  {
    label: "Married",
    value: "MARRIED",
  },
  {
    label: "Widowed",
    value: "WIDOWED",
  },
  {
    label: "Divorced",
    value: "DIVORCED",
  },
];

export const BusinessLegalStatus = [
  {
    label: "Limited Liability Company",
    value: "LIMITED_LIABILITY_COMPANY",
  },
  {
    label: "Sole Proprietorship",
    value: "SOLE_PROPRIETORSHIP",
  },
  {
    label: "Partnership",
    value: "PARTNERSHIP",
  },
];

export const CustomerEducationalLevel = [
  {
    label: "Primary School",
    value: "PRIMARY_SCHOOL",
  },
  {
    label: "Secondary School",
    value: "SECONDARY_SCHOOL",
  },
  {
    label: "Bachelor Degree",
    value: "BACHELOR_DEGREE",
  },
  {
    label: "Vocational Training",
    value: "VOCATIONAL_TRAINING",
  },
  {
    label: "Diploma",
    value: "DIPLOMA",
  },
  {
    label: "Master Degree",
    value: "MASTER_DEGREE",
  },
  {
    label: "Doctorate",
    value: "DOCTORATE",
  },
];

export const CustomerIdentificationType = [
  {
    label: "Driver's License",
    value: "Driver's License",
  },
  {
    label: "Int'l Passport",
    value: "Int'l Passport",
  },
  {
    label: "National ID",
    value: "National ID",
  },
  {
    label: "Voter's Card",
    value: "Voter's Card",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const CustomerNOKRelationship = [
  {
    label: "Wife",
    value: "Wife",
  },
  {
    label: "Husband",
    value: "Husband",
  },
  {
    label: "Mother",
    value: "Mother",
  },
  {
    label: "Father",
    value: "Father",
  },
  {
    label: "Child",
    value: "Child",
  },
  {
    label: "Sibling",
    value: "Sibling",
  },
  {
    label: "Aunt",
    value: "Aunt",
  },
  {
    label: "Uncle",
    value: "Uncle",
  },
  {
    label: "Others",
    value: "Others",
  },
];

export const LoanPurposeOptions = [
  {
    label: "Personal",
    value: "PERSONAL",
  },
  {
    label: "Business",
    value: "BUSINESS",
  },
  {
    label: "School Fees",
    value: "SCHOOL_FEES",
  },
  {
    label: "Rent",
    value: "RENT",
  },
  {
    label: "Portable Goods",
    value: "PORTABLE_GOODS",
  },
  {
    label: "Fashion",
    value: "FASHION",
  },
  {
    label: "Medical",
    value: "MEDICAL",
  },
  {
    label: "Travel Holiday",
    value: "TRAVEL_HOLIDAY",
  },
  {
    label: "Wedding Event",
    value: "WEDDING_EVENTS",
  },
  {
    label: "Household maintenance",
    value: "HOUSEHOLD_MAINTENANCE",
  },
  {
    label: "Financial gap bridge",
    value: "TO_BRIDGE_FINANCIAL_GAP",
  },
  {
    label: "Others",
    value: "OTHER_EXPENSES",
  },
];

export const LoanRepaymentMethodOptions = [
  {
    label: "Salary Deduction",
    value: "SALARY_DEDUCTION",
  },
  {
    label: "Direct Debit",
    value: "DIRECT_DEBIT",
  },
  {
    label: "Bank Transfer",
    value: "BANK_TRANSFER",
  },
  {
    label: "Cheques",
    value: "CHEQUES",
  },
];

export const LoanDecisionOptions = [
  {
    label: "Approve",
    value: "APPROVED",
  },
  {
    label: "Decline",
    value: "DECLINED",
  },
  {
    label: "Return",
    value: "RETURNED",
  },
];

export const SystemRole: string[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "FIRST_REVIEWER",
  "SECOND_REVIEWER",
  "ACCOUNT_OFFICER",
  "ACCEPTANCE_OPERATIONS",
  "BOOKING_OPERATIONS",
  "INTERNAL_CONTROL",
  "FINANCE_OPERATIONS",
  "USER_SUPPORT",
];

export const LoanStatus: string[] = [
  "PENDING_SUBMISSION",
  "PENDING_FIRST_REVIEW",
  "PENDING_SECOND_REVIEW",
  "PENDING_ACCEPTANCE",
  "PENDING_BOOKING",
  "COMPLETED",
];
