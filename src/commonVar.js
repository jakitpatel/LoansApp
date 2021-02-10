const SBAOptions = [
    { value: '',     label: 'All' },
    { value: 'NULL', label: 'NULL' },
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
    { value: 'NULL',  label: 'NULL' },
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
    { value: 'Funded', label: 'Funded' },
    { value: 'Withdrawn', label: 'Withdrawn' },
    { value: 'Cancelled',    label: 'Cancelled' },
    { value: 'Duplicate file',    label: 'Duplicate file' },
    { value: 'Loans with SBA Submission Errors',    label: 'Loans with SBA Submission Errors' }
];

export { SBAOptions, BrokerOptions, StatusOptions};