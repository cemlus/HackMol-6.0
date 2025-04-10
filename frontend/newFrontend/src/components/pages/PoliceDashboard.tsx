import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function PoliceDashboard () {
    const navigate = useNavigate();
    useEffect(() => {
        // add authentication for a signed in userby sending a req to backend
        // if not achieved then redirect back to signin
    }, [navigate])


    return (
        <div>
            <h1>welcome to PoliceDashboard</h1>
            <p>view complaints according to severity</p>
            <p>accept and reject a comaplaint based on the reasoning for it</p>
            <p>if rejected then give the reason for it (if the reaosn isn't accepted by the user then they may reach out to the police station for the concerned officer themselves)</p>
        </div>
    )
}