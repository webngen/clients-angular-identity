
namespace Webngen.Identity.Models {
    export interface IIdentity {
        firstname: string;
        surname: string;
        username: string;
        email: string;
        roles: Array<string>;
    }
    export interface Claim {
        type: string;
        value: string;
    }
    export class ClaimTypes {
        public static GivenName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
        public static Surname = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
        public static NameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        public static Email = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
        public static Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    }
}