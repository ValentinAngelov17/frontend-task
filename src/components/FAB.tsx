import { Button } from '@mui/joy'
import Add from '@mui/icons-material/Add'
import {Link} from "react-router-dom" 

export default function FAB() {
    return (
        <Button
            component={Link}
            to="/banners/create"
            style={{
                position: 'fixed',
                right: '72px',
                bottom: '32px',
                height: '72px',
                borderRadius: '50%',
            }} 
            size="lg">
            <Add />
        </Button>
    )
}