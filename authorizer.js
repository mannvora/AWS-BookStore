const { CognitoJwtVerifier } = require("aws-jwt-verify");

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: "some user pool id",
    tokenUse: "id",
    clientId: "some client id"
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
