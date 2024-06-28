const { CognitoJwtVerifier } = require("aws-jwt-verify");

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_TS7uqnCjG",
    tokenUse: "id",
    clientId: "13a9jujr1ns7p0o4k29ljghedh"
})

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


//http://localhost:3000/#
// id_token=eyJraWQiOiJReUtXYklvZGZ6aTVzc1VnQUl0Tk81eVpvUmJzSG00Mm5GQlBLQWdwRmlJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiZTE0c21Tdl9fblhUeWZtT2dYa2ZhdyIsInN1YiI6Ijk0NzhhNGQ4LTMwNDEtNzBlZC1hMTExLThkNDliMzg0OGExMSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9UUzd1cW5DakciLCJjb2duaXRvOnVzZXJuYW1lIjoibWFubnZvcmExNzI5IiwiYXVkIjoiMTNhOWp1anIxbnM3cDBvNGsyOWxqZ2hlZGgiLCJldmVudF9pZCI6IjVkYmI5MWU2LTBhYTEtNGM3ZS04MzYzLTRkNmE4ODEzYmIwNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzE5NTIzNTQwLCJleHAiOjE3MTk1MjcxNDAsImlhdCI6MTcxOTUyMzU0MCwianRpIjoiMmJiMDc0YTMtODk2ZS00MmYzLWFlMjUtNTgxYmE1NzFmMTQwIiwiZW1haWwiOiJtYW5udm9yYTE3MjlAZ21haWwuY29tIn0.s9fm4x4j1hFxdP8SsT-JrSszKR6gOpJ6jZCbYhewIu7kNDCBTzsVrwJggnEPeOSEXrEBUVgaD2PimSd2UO6Bd1IfCNXZDJhl2NyuR-YO3QmEXgRA_rlKupUCUzt_KJ4LhsRdDBRXtratiGbW1-DaD62ULSi9J0ZPzNs8nB_8X-Jj6enGx_veyMWu_YCQrXLNQ9dCIwqsUxheUB0PuhJ0LzrWBVRx7XxKnLTePuqcJtzOM9GnUUtDO58KxzMXwGnpyqrioR1N-pwQ-lxy3-P1cQXD7R9XlFQWNqKbYgJeN0iHdN4UdHX2Q7rVyD0Lpevgb5_yVvcHYPUaWDTrU_jAPw
// &access_token=eyJraWQiOiI0M1NIdXFtMitjMDlIXC9jdVRJYU0zWHFRTHpsdVVYOG11anVLSFV4K0d6ND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5NDc4YTRkOC0zMDQxLTcwZWQtYTExMS04ZDQ5YjM4NDhhMTEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9UUzd1cW5DakciLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxM2E5anVqcjFuczdwMG80azI5bGpnaGVkaCIsImV2ZW50X2lkIjoiNWRiYjkxZTYtMGFhMS00YzdlLTgzNjMtNGQ2YTg4MTNiYjA0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgZW1haWwiLCJhdXRoX3RpbWUiOjE3MTk1MjM1NDAsImV4cCI6MTcxOTUyNzE0MCwiaWF0IjoxNzE5NTIzNTQwLCJqdGkiOiI2MWE2OTJmMC04MWRiLTQwZjUtYWNmZi0yYmFiNzg1ZWRkNWEiLCJ1c2VybmFtZSI6Im1hbm52b3JhMTcyOSJ9.FcMCwKIGlWfHiUPUSsxmzGyPeLH-af8UVtrmAcUXAL5sWbJnP2Q3-5Yh-h867P81JI0RmgHecXdh2CyncC-e4FTXGbACDyBz9HXskbOPIgggDAdBxYwerwWlJ9b5DEHE9bZDQyngIN_1M-01c04e95t3dz0Odp4RAfgm6IJ1aTWAT80NVe99kV9pPL9SjpLetllLPoYchFIomKTFtBEF-hziETJAUD9VLfHX0gJ-A0AmJpYR2-vsMNoPLIe7usI37TZZT5_SJeyw2AnOsi9LeIus_0r3vrFz7yyFeEEsyiZ71VdLDjCRLQo7WOUkU3ISfwVxr2fIG8uoZ4PfrSSd0g&expires_in=3600&token_type=Bearer