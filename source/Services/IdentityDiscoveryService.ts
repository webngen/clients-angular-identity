
namespace Webngen.Identity.Services {

    export class IdentityDiscoveryService implements IIdentityDiscoveryService {
        static $inject = ['$http', '$q'];
        private static RelationTokens = "tokens";
        private _discoveryResource: Webngen.Identity.Models.IdentityDiscoveryResource;
        private _config: Models.IdentityConfig = { identityApi: "https://api.webngen.net/identity" };

        constructor(private $http: ng.IHttpService, private $q: ng.IQService) {

        }

        private Discover = (): ng.IPromise<Webngen.Identity.Models.IdentityDiscoveryResource> => {
            var deferred = this.$q.defer();
            var self = this;

            if (this._discoveryResource != null)
                deferred.resolve(self._discoveryResource);
            else
                this.$http({
                    method: "GET",
                    url: this._config.identityApi
                }).then((xhr) => {
                    self._discoveryResource = <Webngen.Identity.Models.IdentityDiscoveryResource>xhr.data;
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
                var link = $.grep(disco.links, (link) => link.rel === rel)[0];
                if (link == null)
                    deferred.reject("Link Not found");
                else
                    deferred.resolve(link.uri);
            });

            return deferred.promise;
        }

        public Configure = (config: Models.IdentityConfig) => {
            this._config = config;
        }
    }

    export interface IIdentityDiscoveryService {
        TokenUri: ng.IPromise<string>;
        Configure(options: Models.IdentityConfig);
    }
}