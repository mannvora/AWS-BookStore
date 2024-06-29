const { CognitoJwtVerifier } = require("aws-jwt-verify");

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID,
    tokenUse: "id",
    clientId: process.env.CLIENT_ID
});

const generatePolicy = (prinicipalId, effect, resource) => {
    console.log("Effect and resource are: `", effect, resource);
    let authResponse = {};

    authResponse.principalId = prinicipalId;

    if(effect && resource) {
        let policyDocument = {
            Version: "2012-10-17", 
            Statement: [
                {
                    Effect: effect, 
                    Resource: resource,
                    Action: "execute-api:Invoke"
                }
            ]
        }

        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = {};

    console.log(JSON.stringify(authResponse));

    return authResponse;
}

exports.handler = async (event, context, cb) => {
    console.log(event);
    let token = event.headers.authorizationtoken; ``

    console.log(token);

    try {
        const payload = await jwtVerifier.verify(token);
        console.log(JSON.stringify(payload));
        cb(null, generatePolicy("user", "Allow", event.routeArn));
    } catch(err) {
        console.log(err);
        cb("Error: Invalid Token");
    }

    // switch(token) {
    //     case "allow":
    //         cb(null, generatePolicy("user", "Allow", event.methodArn));
    //         break;
        
    //     case "deny":
    //         cb(null, generatePolicy("user", "Deny", event.methodArn));
    //         break;
    //     default:
    //         cb("Error: Invalid Token");
    // } 
}


// https://mynotesdemoapp.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=13a9jujr1ns7p0o4k29ljghedh&redirect_uri=http://localhost:3000
// https://mynotesuserpool1720.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=45k0p9871354k5vfitvef8ffki&redirect_uri=http://localhost:3000


//http://localhost:3000/#id_token=eyJraWQiOiJGOGprQ1F2SnJnWTBPUFgzNWRjamZ2Rm51RDBCS3dZR0IzMHY1K1NNcEpBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiX09WcnBEYlg0M3lmSEFSVVhydV81dyIsInN1YiI6ImE0MDg5NDQ4LTYwODEtNzA0OC02MzVjLWZmZTA1YjhiOWZkZSIsImF1ZCI6IjQ1azBwOTg3MTM1NGs1dmZpdHZlZjhmZmtpIiwiZXZlbnRfaWQiOiIwYjQ2MTM3NS0wYTA0LTRlYTctOGFjMy1jZmU2YzQ0NmU2YjgiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxOTYyNDA0OSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfa3p5MzM4RkxnIiwiY29nbml0bzp1c2VybmFtZSI6Ik1hbm5Wb3JhIiwiZXhwIjoxNzE5NjI3NjQ5LCJpYXQiOjE3MTk2MjQwNDksImp0aSI6IjIzMzZhY2NlLTBlNWUtNGE3NS05ZDMzLTQzYTkxYzY1ZTVjZCJ9.JzRmlUXfg1SeMmQpOaJo44AWpD62naSgozTU_qBtOsL2azsXNOSGTKZqd3KGeqCxFy5jl9Db6i2G7WNwsZNkDV2ZZc10OsK6jEbfk8lMIP0f9nz7BeAd6f3mBHolX04VWyL2GRdIXyb_MCdJzpJJQQ4OcL0x8Nx8fMVyUC8o-UuncFbOssn3Uw2fPVhSYEmnK3QqQjCUAOaw4zjqOVz7RzKP-y6L0IeCIBehHRSDKqrGtRr-UbpNJfg3nQwJCRc2SAiG9obqwVokLErVqQQUJAvH4jw4vms3Rs0VC6xYwhfZXWIGGfoeeOiDFdjg0hcyQCjKHqJL7fnYV2F-KzcSdg&access_token=eyJraWQiOiJBVmlUMUhuWkRhTVRveW1IK0dqRUVHS1VtM1VHUURFMXFEdnJYWG5VdjRRPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhNDA4OTQ0OC02MDgxLTcwNDgtNjM1Yy1mZmUwNWI4YjlmZGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9renkzMzhGTGciLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0NWswcDk4NzEzNTRrNXZmaXR2ZWY4ZmZraSIsImV2ZW50X2lkIjoiMGI0NjEzNzUtMGEwNC00ZWE3LThhYzMtY2ZlNmM0NDZlNmI4IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTcxOTYyNDA0OSwiZXhwIjoxNzE5NjI3NjQ5LCJpYXQiOjE3MTk2MjQwNDksImp0aSI6IjkxMWUxNzAwLWZhYmUtNDFiYi1iNjMxLTUzMWI1OTQyMDM1ZiIsInVzZXJuYW1lIjoiTWFublZvcmEifQ.DdDhlGPSZaWpQq2SenAUTzAKGJVkY1GkueY_Ngzf43UQcOfSF0kSG3Nk_H03cWvi1A-9HRoiKeBZI2l5b-vcs7P5QzD9cbpQg2Sa46o9ZUFKqjguwZer_drtFzY0tX5jiQZ0Du45L4vIR6fPZ52ZdA2B5DT5MqoO9Ae-rMEihAM0i0YPCKT1ti45d07NcQP_09Ro_O5NLO5PawhIzSpscLtPLu-jlQ-oWXlQ8adk2_plUY-N-Yobe9Nip07oqtWJ3_5xSYb82pytPatjuonUPHEuB75_xEZeUDYCA2ezK5dyHnDlE_1L00xCYlWjNaRsw6Ze4GCuPQsfZMxaGQLZXw&expires_in=3600&token_type=Bearer