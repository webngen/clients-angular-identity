
namespace webngen.identity.services {

    export class IdentityDiscoveryService implements IIdentityDiscoveryService {
        static $inject = ['$http', '$q'];
        private static RelationTokens = "tokens";
        private _discoveryResource: webngen.identity.models.IdentityDiscoveryResource;
        private _config: models.IdentityConfig = { identityApi: "https://api.webngen.net/identity" };

        constructor(private $http: ng.IHttpService, private $q: ng.IQService) {

        }

        private Discover = (): ng.IPromise<webngen.identity.models.IdentityDiscoveryResource> => {
            var deferred = this.$q.defer();
            var self = this;

            if (this._discoveryResource != null)
                deferred.resolve(self._discoveryResource);
            else
                this.$http({
                    method: "GET",
                    url: "/api/identity"
                }).then((xhr) => {
                    self._discoveryResource = <webngen.identity.models.IdentityDiscoveryResource>xhr.data;
                    deferred.resolve(self._discoveryResource);
                }).catch((e) => {
                    deferred.reject(e);
                });

            return deferred.promise;
        }

        public get TokenUri(): angular.IPromise<string> {
            return this.FindLinkUrl(IdentityDiscoveryService.RelationTokens);
        }

        private FindLinkUrl = (rel: string): angular.IPromise<string> => {
            var deferred = this.$q.defer();

            this.Discover().then((disco) => {
                var link = $.grep(disco.Links, (link) => link.Rel === rel)[0];
                if (link == null)
                    deferred.reject("Link Not found");
                else
                    deferred.resolve(link.Uri);
            });

            return deferred.promise;
        }

        public Configure = (config: models.IdentityConfig) => {
            this._config = config;
        }
    }

    export interface IIdentityDiscoveryService {
        TokenUri: ng.IPromise<string>;
        Configure(options: models.IdentityConfig);
    }
}