
// defined allowed value types for every case description 
type CaseStatus = 
"New" | "Under Review" | "Open" | "On Hold" | "Closed"; 

type CaseCategory = 
"Civil" | "Criminal" | "Family" | "Employment" | "Property" | "Commercial" | "Other"; 

type CasePriority = 
"Low" | "Medium" | "High"; 

// case input describes what the user would supply (partial case description)
export interface CreateCaseInput{
    title:  string;
    clientId: number;
    description: string;
    category: CaseCategory;
    priority: CasePriority;

}

// constructs a complete case using user supplied values/info and and system-generated data (backend)
// using 'extends' to emphasize the case is complete with the additional case properties
export interface Case extends CreateCaseInput{
    caseId: string;
    // allocates appropriate date and time using backend logic
    createdAt: Date; 
    status: CaseStatus;
}
