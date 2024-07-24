// import { CognitoJwtVerifier } from "aws-jwt-verify";
// import { APIGatewayTokenAuthorizerEvent, Context, Callback } from "aws-lambda";

// const jwtVerifier = CognitoJwtVerifier.create({
//     userPoolId: process.env.USER_POOL_ID!,
//     tokenUse: "id",
//     clientId: process.env.CLIENT_ID!
// });

// interface PolicyDocument {
//     Version: string;
//     Statement: Array<{
//         Action: string;
//         Effect: string;
//         Resource: string;
//     }>;
// }

// interface AuthResponse {
//     principalId: string;
//     policyDocument?: PolicyDocument;
//     context: Record<string, unknown>;
// }

// const generatePolicy = (principalId: string, effect: string, resource: string): AuthResponse => {
//     console.log("Effect and resource are: ", effect, resource);
//     let authResponse: AuthResponse = {
//         principalId: principalId,
//         context: {}
//     };

//     if (effect && resource) {
//         let policyDocument: PolicyDocument = {
//             Version: "2012-10-17",
//             Statement: [
//                 {
//                     Effect: effect,
//                     Resource: resource,
//                     Action: "execute-api:Invoke"
//                 }
//             ]
//         };

//         authResponse.policyDocument = policyDocument;
//     }

//     console.log(JSON.stringify(authResponse));

//     return authResponse;
// };

// export const handler = async (event: APIGatewayTokenAuthorizerEvent, context: Context, cb: Callback) => {
//     console.log(event);
//     let token = event.authorizationToken;

//     console.log(token);

//     try {
//         const payload = await jwtVerifier.verify(token as string);
//         console.log(JSON.stringify(payload));
//         cb(null, generatePolicy("user", "Allow", event.methodArn));
//     } catch (err) {
//         console.log(err);
//         cb("Error: Invalid Token");
//     }
// };