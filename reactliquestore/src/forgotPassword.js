import { Alert, Container } from "@mui/material";

function ForgotPage() {

    return (
        <Container component="main" maxWidth="sm" sx={{marginTop: 10}}>
            <Alert variant="filled" severity="error" sx={{marginBottom: 5}}>
                <p>error message</p>
            </Alert>
        </Container>
    )
}

export default ForgotPage;