
namespace Webngen.Identity.Services {

    export class AuthenticationService implements IAuthenticationService {
        static $inject = ['$http', '$q', '$rootScope', 'webngenIdDiscoService'];

        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $rootScope: ng.IRootScopeService, private discoSvc: IIdentityDiscoveryService) {
        }

        public CreateToken(username: string, password: string): angular.IPromise<Object> {
            var deferred = this.$q.defer();

            this.discoSvc.TokenUri.then((url) => {
                this.$http({
                    method: "POST",
                    url: url,
                    data: { loginName: username, password: password }
                }).then((xhr) => {

                    deferred.resolve(xhr.data);
                }).catch((e) => {
                    deferred.reject(e);
                });
            });

            return deferred.promise;
        }

        public Authenticate(username: string, password: string): angular.IPromise<any> {
            var deferred = this.$q.defer();

            this.CreateToken(username, password).then((token: Webngen.Identity.Models.Token) => {
                //store token in session
                sessionStorage.setItem("authToken", token.accessToken);
                //broadcast authenticate event on event bus
                this.$rootScope.$broadcast(Constants.Events.LoggedIn, this.CreateIdentity(token));

                deferred.resolve(token);
            });

            return deferred.promise;
        }

        public SignOut(): angular.IPromise<any> {
            var deferred = this.$q.defer();
            //clear token in session
            sessionStorage.removeItem("authToken");
            //broadcast signout event on event bus
            this.$rootScope.$broadcast(Constants.Events.LoggedOut, null);

            deferred.resolve(true);

            return deferred.promise;
        }

        private CreateIdentity = (token: Webngen.Identity.Models.Token): Webngen.Identity.Models.IIdentity => {
            var princ = JSON.parse(atob(token.accessToken.split(".")[1]));
            return {
                firstname: this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.GivenName),
                surname: this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.Surname),
                username: this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.NameIdentifier),
                email: this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.Email),
                roles: this.FindAllClaimValues(princ.Claims, Webngen.Identity.Models.ClaimTypes.Role)
            };
        }

        private FindClaimValue = (claims: Array<Webngen.Identity.Models.Claim>, name: string): string => {
            var claim = $.grep(claims, (c) => c.type == name)[0];
            if (claim) return claim.value;
            return null;
        }
        private FindAllClaimValues = (claims: Array<Webngen.Identity.Models.Claim>, name: string): Array<string> => {
            var matching = $.grep(claims, (c) => c.type == name);
            return $.map(matching, (c) => c.value);
        }
    }

    export interface IAuthenticationService {
        Authenticate(username: string, password: string): ng.IPromise<any>;
        SignOut(): ng.IPromise<any>;
    }
}