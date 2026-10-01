//loaded the express library into server.ts 
import express from "express"; 
//server directly access case type file to store created cases in an array
import type { Case, CreateCaseInput} from "./models/case.js";
//server accesses the PostgreSQL connection
import { pool } from "./db.js";
// cors imported a browser security tool
import cors from "cors";
//temporary data storage method for storing case objects using arrays
const cases: Case[] = [];

// Define the case elements stored in case category array
// Used for both POST and PATCH
const allowedCategories = [
    "Civil",
    "Criminal",
    "Family",
    "Employment",
    "Property",
    "Commercial",
    "Other"
    ];

// defined case priorities elements 
// Used for both POST and PATCH
const allowedPriorities = [
    "Low", "Medium", "High"
    ];

// defined case status priorities elements 
// Used for PATCH
const allowedStatus = [
    "New",
    "Under Review",
    "Open",
    "On Hold",
    "Closed"
    ];

//an app variable used to store application in the variable, 
//the express server runs a new web server upon the HTTP request status
//express stored inside 'app'
const app = express();
// using cors to for backend to allow requests from my Vue development frontend at web localhost:5173 to be allowed access
// express server permits access to the port origin Vue 
app.use(cors({
    origin: "http://localhost:5173"
}));

//step inserted after implementing the case and client design models as json files 
//json files are parsed as part of the req.body and this ensures the request is accessible in routes. 
app.use(express.json());


//defined port number to access this server using localhost 
const PORT = 3000;

//FIX ERRORS
//'app.get' for HTTP GET request handling by Express application
//'/' = for root/path, this is root of the server it must match for code logic 
//'(req,res) => {} this is executed once the request arrives part of the test route code 
//'res.send' servers sends a responds back to confirm 
    //req = this is information FROM the client
    //res = this is response sends BACK to the client
app.get("/", (req,res) => {
    res.send("Legal Case Management API is running");
});

//passing two arguments to execute the function
//arg1 = PORT number reference
//arg2 = the callback function that consists of a confirmation message once the function is executed

 
 
// the function app.post.... takes the input to create a case before sending back the response 
// POST endpoint created below (create-case)
// async route established 
app.post("/cases", async (req, res) =>{

    // first condition checks if the object is null
    // second condition checks the req.body is an object and if not it meets the condition and returns an error
    // finally does the req.body match the req.body format 
     if (req.body === null || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({
            message: "The Request body must be a JSON object"
        });
    }
    // input variable created to recieve request body of the case 
    // using input to create the new case 
    const input: CreateCaseInput = req.body;

    // POST route validation code
    // uses a condition that checks if the title is actually a string or not, a non-string value is rejected 
    // trim function used to remove any whitespaces before and after the string 
    // both conditions are checked used OR
    if (typeof input.title !== "string" || input.title.trim() === ""){
        return res.status(400).json({
            message: "Title is required and it must be a non-empty string"
        });
    }

    // Description validation checks 
    if (typeof input.description !== "string" || input.description.trim() === ""){
         return res.status(400).json({
            message: "Description is required and it must be a non-empty string"
        });
    }
    // ClientId validation checks 
     if (!Number.isInteger(input.clientId) || input.clientId <= 0) {
         return res.status(400).json({
            message: "Client ID must be a positive integer"
        });
    }
  
    // case category validation checks 
    if (typeof input.category !== "string" || !allowedCategories.includes(input.category)){
         return res.status(400).json({
            message: "Invalid case category"
        });
    }    

    // case priority validation checks 
    if (typeof input.priority !== "string" || !allowedPriorities.includes(input.priority)){
         return res.status(400).json({
            message: "Invalid case priority"
        });
    }   

// database query reference to insert a case 
// API handles any unexpected error or database failiure 
try{
    const result = await pool.query(
        // a new row has been added to the cases table 
        `INSERT INTO cases
            (client_id, title, description, category, priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            input.clientId,
            input.title,
            input.description,
            input.category,
            input.priority
        ]
        
    );
    
    return res.status(201).json(result.rows[0]);
} catch (error){
    console.error("Failed to create case: ", error); 

    return res.status(500).json({
        message: "Failed to create case"
    }); 
}


});

// retieves all active cases from the postgreSQL database
app.get("/cases", async (req, res) => {
    // inserted try catch to handle unexpected input or errors due to postgresql failure, API handles this properly 
    try{
        const result = await pool.query(
            // using postgreSQL SELECT to select specific data with * to retrieve it from all columns 
            // instructs cases selected that are not archived presented as NULL 
            `SELECT *
            FROM cases
            WHERE archived_at IS NULL
            ORDER BY case_id`
        );
        // row base data selection then returns it to the user from postgresql
        // using .rows instead of POST rows[0], since more than one case is returned 
        return res.json(result.rows); 
    } catch (error){
        console.error("Failed to retrieve cases: ", error);

        return res.status(500).json({
            message: "Failed to retrieve cases"
        }); 
    }
    

}); 

// returns a single case 
// async to use pool.query 
app.get("/cases/:id", async (req, res) => {

    // 'req.params.id' is essentially the route parameter from the URL in which the requested ID is retrieved
    // reference to postgresql, id is converted to number since case is already defined as a number  
    const caseId = Number(req.params.id); 
    // search method to obtain a specific case from an array by comparing the requested URL with each Case object's stored caseId
    // 'caseItem' is used as a temporary parameter in the find function, used to compare case by case using requested ID 
    // const foundCase = cases.find((caseItem) => caseItem.caseId === caseId);
    

    // API error handling using try catch 
    try{
        // case_id will always referenced as a numerical value to avoid unexpected input values
        // $1 to target a single case based on case id request in the url 
        // if case is categorised as archived then it will not return 
        const result = await pool.query(
            `SELECT *
            FROM cases
            WHERE case_id = $1
            AND archived_at IS NULL`,
            [caseId]
        ); 

        // checks if the case ID maps to a case element ID if it returns 0 as invalid/mismatch it directly equals to the condiition 0
        // if this condition is true the error 404 code is executed 
        // case is not found 
        // length is represented by case array length []
        if(result.rows.length === 0){
            return res.status(404).json({
                message: "Case not found"
            }); 
        }

        return res.json(result.rows[0]);
    } catch(error){
        // error message returned to the terminal using the error variable 
        console.error("Failed to retrieve case: ", error);
        // return error to the API user/client 
        return res.status(500).json({
            message: "Failed to retrieve case"
        }); 
    }


});


app.patch("/cases/:id", async (req, res) => {

    // first condition checks if the object is null
    // second condition checks the req.body is an object and if not it meets the condition and returns an error
    // finally does the req.body match the req.body format 
     if (req.body === null || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({
            message: "The Request body must be a JSON object"
        });
    }

    // represents the route parameter from a URL, used to retrieve the requested ID  
    // case ID is a numerical value 
    const caseId = Number(req.params.id);
 
    // instead of foundcase logic, the if condition should be used to validate if the requested ID exists 
    // if not an error is thrown 
    if (!Number.isInteger(caseId) || caseId <= 0){
        return res.status(400).json({
            message: "Case ID must be a positive integer"
        }); 
    }

        // PATCH validation code 
        
        // checks if both the title value is defined to then allow update and then checks if updated value is valid against the conditions
       if (req.body.title !== undefined && 
        (typeof req.body.title !== "string" || req.body.title.trim() === "")){
        return res.status(400).json({
            message: "Title is required and it must be a non-empty string"
        });
    }
        // validation for description
        if (req.body.description !== undefined && 
        (typeof req.body.description !== "string" || req.body.description.trim() === "")){
        return res.status(400).json({
            message: "Title is required and it must be a non-empty string"
        });
    }   
         
        //validation for category
        if (req.body.category !== undefined && 
        (typeof req.body.category !== "string" || !allowedCategories.includes(req.body.category)
    )){
        return res.status(400).json({
            message: "Invalid case category"
        });
    }
        //validation for priority
        if (req.body.priority !== undefined && 
        (typeof req.body.priority !== "string" || !allowedPriorities.includes(req.body.priority)
        )){
        return res.status(400).json({
            message: "Invalid case priority"
        });
    }
        //validation for status
        if (req.body.status !== undefined && 
        (typeof req.body.status !== "string" || !allowedStatus.includes(req.body.status)
        )){
        return res.status(400).json({
            message: "Invalid case status"
        });
    }

    try{
        // $number references a new value using input request, if no request the second variable such as title remains unchanged 
        // after returning statement the null mappings to the properties suggests values are unchanged with one value updated or none 
        const result = await pool.query(
            `UPDATE cases
            SET
                title = COALESCE($1, title), 
                description = COALESCE($2, description),
                category = COALESCE($3, category),
                priority = COALESCE($4, priority),
                status = COALESCE($5, status)
            WHERE case_id = $6
            RETURNING *`, 
            [
                req.body.title ?? null,
                req.body.description ?? null,
                req.body.category ?? null,
                req.body.priority ?? null,
                req.body.status ?? null,
                caseId
            ]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message: "case not found"
            });
        }

        return res.json(result.rows[0]);
    }catch (error){
        console.error("Failed to update case:", error);

        return res.status(500).json({
            message: "Failed to update case"
        });
    }


}); 

// removes a specific case from the case array 
// post database, cases are archived and not deleted (soft delete)
app.delete("/cases/:id", async (req, res) => {
    // represents the route parameter from a URL, used to retrieve the requested ID  
    const caseId = Number (req.params.id);
    
    // input value error handling 
    if (!Number.isInteger(caseId) || caseId <= 0){
        return res.status(400).json({
            message: "Case ID must be a positive integer"
        });
    }
    
    try{
        // case ID delete status value changes from active to archived with assorted timestamp
        const result = await pool.query(
            `UPDATE cases
            SET archived_at = CURRENT_TIMESTAMP
            WHERE case_id = $1
            RETURNING *`, 
            [caseId]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message: "Case not found"
            });
        }

        return res.json(result.rows[0]);
    }catch (error){
        console.error("Failed to archive case: ", error);

        return res.status(500).json({
            message: "Failed to archive case"
        }); 
    }

    
});


// return log message including the application link with the dedicated port number 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
 