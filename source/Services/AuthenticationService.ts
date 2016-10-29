
namespace webngen.identity.services {

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

            this.CreateToken(username, password).then((token: webngen.identity.models.Token) => {
                //store token in session
                sessionStorage.setItem("authToken", token.AccessToken);
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

        private CreateIdentity = (token: webngen.identity.models.Token): webngen.identity.models.IIdentity => {
            var princ = JSON.parse(atob(token.AccessToken.split(".")[1]));
            return {
                Firstname: this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.GivenName),
                Surname: this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.Surname),
                Username: this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.NameIdentifier),
                Email: this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.Email),
                Roles: this.FindAllClaimValues(princ.Claims, webngen.identity.models.ClaimTypes.Role)
            };
        }

        private FindClaimValue = (claims: Array<webngen.identity.models.Claim>, name: string): string => {
            var claim = $.grep(claims, (c) => c.Name == name)[0];
            if (claim) return claim.Value;
            return null;
        }
        private FindAllClaimValues = (claims: Array<webngen.identity.models.Claim>, name: string): Array<string> => {
            var matching = $.grep(claims, (c) => c.Name == name);
            return $.map(matching, (c) => c.Value);
        }
    }

    export interface IAuthenticationService {
        Authenticate(username: string, password: string): ng.IPromise<any>;
        SignOut(): ng.IPromise<any>;
    }
}