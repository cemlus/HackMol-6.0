import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function SignupPage() {
    const navigate = useNavigate();
    return (
        <div>
            <div>hello</div>
            <Button onClick={() => navigate('/signin')}>Signin</Button>

        </div>
    )
}