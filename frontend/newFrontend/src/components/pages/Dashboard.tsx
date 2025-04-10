import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function Dashboard () {
    const navigate = useNavigate();
    useEffect(() => {
        // add authentication for a signed in userby sending a req to backend
        // if not achieved then redirect back to signin
    }, [navigate])


    return (
        <div>
            <h1>welcome to dashboard</h1>
            <p>
            <a href="/fileComplaint" className="text-blue-600 font-bold">file a complaint</a> in 3 ways</p>
            <p>using a detailed form</p>
            <p>using voice</p>
            <p>adding to an existing complaint using Complaint ID</p>
        </div>
    )
}