/// <reference path="../typings/index.d.ts" />
/// <reference path="models/index.d.ts" />
/// <reference path="services/index.d.ts" />

var mod: ng.IModule;

namespace webngen.identity {
    export class Bootstrapper {
        public init() {


            var mod = angular.module("webngen.identity", []);
            //var cfg: webngen.identity.models.IdentityConfig = {
            //    identityApi:"api.webngen.net/identity"
            //};
            //mod.constant('appConfig', cfg);

            mod.service('webngenIdAuthService', services.AuthenticationService);
            mod.service('webngenIdDiscoService', services.IdentityDiscoveryService);

        }
    }

    export class Constants {
        public static Events = {
            LoggedIn: "LoggedIn",
            LoggedOut: "LoggedOut",
        };
    }
}

new webngen.identity.Bootstrapper().init();