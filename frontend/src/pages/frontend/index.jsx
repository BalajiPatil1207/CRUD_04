import { Link } from "react-router-dom";

const Index=()=>{
return(
    <>
    <Link to={"/login"}>Login Page</Link>
    <Link to={"/register"}>Register Page</Link>
    </>
)
}

export default Index;