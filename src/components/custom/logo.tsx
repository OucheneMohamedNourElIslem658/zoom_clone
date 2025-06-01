import { Video } from "lucide-react";

const Logo = ({size} : {size? : number}) => {
    return (
        <div>
            <div className={`inline-flex items-center justify-center w-${size || 16} h-${size || 16} rounded-full bg-muted`}>
                <Video/>
            </div>
        </div>
    );
}
 
export default Logo;