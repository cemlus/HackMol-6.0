import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function SigninPage() {
    const navigate = useNavigate();
    return (
        <div>
            <div>hello from signin</div>
            <Button onClick={() => navigate('/signup')}>signup</Button>
        </div>
    )
}