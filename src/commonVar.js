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
    { value: 'P/R docs in file OFAC SAM OK – move to approval', label: 'P/R docs in file OFAC SAM OK – move to approval' },
    { value: 'Prior To Funding docs in file',  label: 'Prior To Funding docs in file' },
    { value: 'Prior to Funding docs Needed', label: 'Prior to Funding docs Needed' },
    { value: 'Funded',            label: 'Funded' },
    { value: 'Withdrawn',         label: 'Withdrawn' },
    { value: 'Cancelled',         label: 'Cancelled' },
    { value: 'Duplicate file',    label: 'Duplicate file' },
    { value: 'Loans with SBA Submission Errors',    label: 'Loans with SBA Submission Errors' },
    { value: 'Approved by SBA',    label: 'Approved by SBA' },
    { value: 'Submitted to the SBA',    label: 'Submitted to the SBA' },
    { value: 'Pending Validation',    label: 'Pending Validation' }
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
    { value: 'Andrea Sarwan',     label: 'Andrea Sarwan' },
    { value: 'Denice Aloi-McConnell', label: 'Denice Aloi-McConnell' },
    { value: 'Mike Hosephros', label: 'Mike Hosephros' },
    { value: 'Merick Birkental', label: 'Merick Birkental' },
    { value: 'Syed Hossain',  label: 'Syed Hossain' },
    { value: 'Steve Erickson', label: 'Steve Erickson' },
    { value: 'Larisa Sviridova', label: 'Larisa Sviridova' },
    { value: 'Igor Khanis ', label: 'Igor Khanis ' },
    { value: 'Usher Berkowitz', label: 'Usher Berkowitz' }
];

const TeamBAssignedOptions = [	
    { value: 'Adiv Cederbaum', label: 'Adiv Cederbaum' },	
    { value: 'Lawrence Allman', label: 'Lawrence Allman' },	
    { value: 'Steve Erickson', label: 'Steve Erickson' },	
    { value: 'Jamie Hoy', label: 'Jamie Hoy' }	
];	

const ReviewerAssignedOptions = [
    { value: 'Abigail Hyman',     label: 'Abigail Hyman' },
    { value: 'Adiv Cederbaum',     label: 'Adiv Cederbaum' },
    { value: 'Akiva Fiber',     label: 'Akiva Fiber' },
    { value: 'Alexa McConnell',     label: 'Alexa McConnell' },
    { value: 'Deanna McConnell',     label: 'Deanna McConnell' },
    { value: 'Diane Parotino',     label: 'Diane Parotino' },
    { value: 'Felicia Himes',     label: 'Felicia Himes' },
    { value: 'Imran Khan',     label: 'Imran Khan' },
    { value: 'Jamie Hoy',     label: 'Jamie Hoy' },
    { value: 'Judah Feinberg',     label: 'Judah Feinberg' },
    { value: 'Kayla Lovetro',     label: 'Kayla Lovetro' },
    { value: 'Krista Bhagwandin',     label: 'Krista Bhagwandin' },
    { value: 'Kylah Harrigan-Brantley',     label: 'Kylah Harrigan-Brantley' },
    { value: 'Lawrence Allman',     label: 'Lawrence Allman' },
    { value: 'Maranda Winget',     label: 'Maranda Winget' },
    { value: 'Mark Sanders',     label: 'Mark Sanders' },
    { value: 'Matthew Boshra',     label: 'Matthew Boshra' },
    { value: 'Matthew DiCostanzo',     label: 'Matthew DiCostanzo' },
    { value: 'Maya Chakravarty',     label: 'Maya Chakravarty' },
    { value: 'Megan Anderson',     label: 'Megan Anderson' },
    { value: 'Mohammed Hashim',     label: 'Mohammed Hashim' },
    { value: 'Nicole Bello',     label: 'Nicole Bello' },
    { value: 'Rifhaatul Islam',     label: 'Rifhaatul Islam' },
    { value: 'Rivka Sanders',     label: 'Rivka Sanders' },
    { value: 'Santino Corelli',     label: 'Santino Corelli' },
    { value: 'Tara Himes',     label: 'Tara Himes' },
    { value: 'Yoni Deutsch',     label: 'Yoni Deutsch' }
];

const ContribDocTypeOptions = [
    { value: 'Business Quarterly Financials',     label: 'Business Quarterly Financials' },
    { value: 'Business Tax Return',     label: 'Business Tax Return' },
    { value: 'Business Yr End Financials',     label: 'Business Yr End Financials' },
    { value: 'Financial Statement',     label: 'Financial Statement' },
    { value: 'Form 1040',     label: 'Form 1040' },
    { value: 'Form 1040C',     label: 'Form 1040C' },
    { value: 'Form 1040F',     label: 'Form 1040F' },
    { value: 'Form 1065',     label: 'Form 1065' },
    { value: 'Form 1120',     label: 'Form 1120' },
    { value: 'Form 1120S',     label: 'Form 1120S' },
    { value: 'Form 8825',     label: 'Form 8825' },
    { value: 'Personal Tax Return',     label: 'Personal Tax Return' },
    { value: 'Qualifying Payroll Documentation',     label: 'Qualifying Payroll Documentation' },
    { value: 'Quarterly Tax Reporting / Payroll Processor Report',     label: 'Quarterly Tax Reporting / Payroll Processor Report' },
    { value: 'Supporting Revenue Reduction Documentation',     label: 'Supporting Revenue Reduction Documentation' },
    { value: 'Voided check reflecting the business borrower name and address as noted in the application',     label: 'Voided check reflecting the business borrower name and address as noted in the application' },
    { value: 'One (1) piece of current, unexpired identification, for each owner, with an address with a copy of the FRONT AND BACK',     label: 'One (1) piece of current, unexpired identification, for each owner, with an address with a copy of the FRONT AND BACK' },
    { value: 'Screenshot of the Secretary of State Good Standing Certificate',     label: 'Screenshot of the Secretary of State Good Standing Certificate' },
    { value: 'Nov 2020 Bank Statement',     label: 'Nov 2020 Bank Statement' },
    { value: 'Dec 2020 Bank Statement',     label: 'Dec 2020 Bank Statement' },
    { value: 'Jan 2021 Bank Statement',     label: 'Jan 2021 Bank Statement' },
    { value: 'Back of ID’s',     label: 'Back of ID’s' }
];

export { SBAOptions, BrokerOptions, StatusOptions, applicationStatusOptions, 
    brokerOverrideOptions, MentorAssignedOptions, ReviewerAssignedOptions,TeamBAssignedOptions,
    ContribDocTypeOptions};