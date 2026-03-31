import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Organizations from "../pages/Organizations";
import DetailOrganization from "../pages/DetailOrganization";
import DetailElection from "../pages/DetailElection";
import LookupElection from "../pages/LookupElection";
import AboutUs from "../pages/AboutUs";
export const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {index:true , element: <Home/>},
            {path:"/about_us", element: <AboutUs/>},
            {path:"organizations", element: <Organizations/>},
            {path:"organizations/:id", element: <DetailOrganization/>},
            {path:"elections/:electionId", element: <DetailElection/>},
            {path:"elections/lookup", element: <LookupElection/>},
        ]
    }
])