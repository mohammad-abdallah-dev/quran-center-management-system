import { useParams } from "react-router-dom"
import AddQuranprogress from "./AddQuranProgress"
import EditQuranProgress from "./EditQuranProgress"

export default function QuranProgress(){

    const {id , type}=useParams()
    
    return(
<>
{type==="Add"
?<AddQuranprogress/>
:<EditQuranProgress/>
}
</>

        
        
    )
}