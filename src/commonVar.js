const SBAOptions = [
    { value: '',     label: 'All' },
    { value: 'is NULL', label: 'NULL' },
    { value: 'Further Research Required', label: 'Further Research Required' },
    { value: 'Submission Failed', label: 'Submission Failed' },
    { value: 'Failed Validation',  label: 'Failed Validation' },
    { value: 'Pending Validation', label: 'Pending Validation' },
    { value: 'Approved by SBA', label: 'Approved by SBA' },
    { value: 'Not Approved by SBA', label: 'Not Approved by SBA' },
    { value: 'Under Review',    label: 'Under Review' }
];

const BrokerOptions = [
    { value: '',     label: 'All' },
    { value: 'Asset Enhancement Solutions',     label: 'Asset Enhancement Solutions' },
    { value: 'Guidance Funding', label: 'Guidance Funding' },
    { value: 'Motor City Funding', label: 'Motor City Funding' },
    { value: 'Gold Edge Capital', label: 'Gold Edge Capital' },
    { value: 'is NULL',  label: 'NULL' },
    { value: 'PMF', label: 'PMF' },
    { value: 'Green Ark Funding', label: 'Green Ark Funding' },
    { value: 'Useful Funding', label: 'Useful Funding' },
    { value: 'ABC Capital Corp.',    label: 'ABC Capital Corp.' },
    { value: 'Donar Consulting',    label: 'Donar Consulting' },
    { value: 'Lendie Capital',    label: 'Lendie Capital' },
    { value: 'Three Brothers',    label: 'Three Brothers' },
    { value: 'Funding Forward',    label: 'Funding Forward' },
    { value: 'Premium Merchant Funding',    label: 'Premium Merchant Funding' }
];

const StatusOptions = [
    { value: '',     label: 'All' },
    { value: 'Not Assigned',     label: 'Not Assigned' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'P/R docs Needed', label: 'P/R docs Needed' },
    { value: 'P/R docs in file, OFAC, SAM OK – move to approval', label: 'P/R docs in file, OFAC, SAM OK – move to approval' },
    { value: 'Prior To Funding docs in file',  label: 'Prior To Funding docs in file' },
    { value: 'Prior to Funding docs Needed', label: 'Prior to Funding docs Needed' },
    { value: 'Funded',            label: 'Funded' },
    { value: 'Withdrawn',         label: 'Withdrawn' },
    { value: 'Cancelled',         label: 'Cancelled' },
    { value: 'Duplicate file',    label: 'Duplicate file' },
    { value: 'Loans with SBA Submission Errors',    label: 'Loans with SBA Submission Errors' },
    { value: 'Approved by SBA',    label: 'Approved by SBA' }
];

const applicationStatusOptions = [
    { value: '',     label: 'All' },
    { value: 'Withdrawn',     label: 'Withdrawn' },
    { value: 'New', label: 'New' },
    { value: 'Approved', label: 'Approved' },
    { value: 'is NULL', label: 'NULL' },
    { value: 'Profile Complete',  label: 'Profile Complete' },
    { value: 'Application Complete', label: 'Application Complete' },
    { value: 'Eligibility In Progress', label: 'Eligibility In Progress' },
    { value: 'Locked', label: 'Locked' }
];

const brokerOverrideOptions = [
    { value: 'Premium Merchant Funding',     label: 'Premium Merchant Funding' },
    { value: 'PMF', label: 'PMF' },
    { value: 'Guidance Funding', label: 'Guidance Funding' },
    { value: 'Lendie Capital', label: 'Lendie Capital' },
    { value: 'Motor City Funding',  label: 'Motor City Funding' },
    { value: 'Eastern Union Funding', label: 'Eastern Union Funding' },
    { value: 'Asset Enhancement Solutions', label: 'Asset Enhancement Solutions' },
    { value: 'Green Ark Funding', label: 'Green Ark Funding' },
    { value: 'Donar Consulting', label: 'Donar Consulting' },
    { value: 'ABC Capital Corp.', label: 'ABC Capital Corp.' },
    { value: 'Funding Forward', label: 'Funding Forward' },
    { value: 'Useful Funding', label: 'Useful Funding' }
];

const MentorAssignedOptions = [
    { value: 'Binyomin Kolodny ADM',     label: 'Binyomin Kolodny ADM' },
    { value: 'Binyomin Kolodny', label: 'Binyomin Kolodny' },
    { value: 'IT Master', label: 'IT Master' },
    { value: 'Chad Dewdat', label: 'Chad Dewdat' },
    { value: 'Jacob Assaraf',  label: 'Jacob Assaraf' },
    { value: 'Pinchas Zerbib', label: 'Pinchas Zerbib' },
    { value: 'Esther Henselmans', label: 'Esther Henselmans' }
];

const ReviewerAssignedOptions = [
    { value: 'Binyomin Kolodny ADM',     label: 'Binyomin Kolodny ADM' },
    { value: 'Binyomin Kolodny', label: 'Binyomin Kolodny' },
    { value: 'IT Master', label: 'IT Master' },
    { value: 'Chad Dewdat', label: 'Chad Dewdat' },
    { value: 'Jacob Assaraf',  label: 'Jacob Assaraf' },
    { value: 'Pinchas Zerbib', label: 'Pinchas Zerbib' },
    { value: 'Esther Henselmans', label: 'Esther Henselmans' }
];

export { SBAOptions, BrokerOptions, StatusOptions, applicationStatusOptions, 
    brokerOverrideOptions, MentorAssignedOptions, ReviewerAssignedOptions};