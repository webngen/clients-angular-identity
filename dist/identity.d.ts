/// <reference path="../typings/index.d.ts" />
/// <reference path="../source/models/index.d.ts" />
/// <reference path="../source/services/index.d.ts" />
declare namespace Webngen.Identity.Models {
    interface IdentityConfig {
        identityApi: string;
    }
}
declare namespace Webngen.Identity.Models {
    interface IIdentity {
        firstname: string;
        surname: string;
        username: string;
        email: string;
        roles: Array<string>;
    }
    interface Claim {
        type: string;
        value: string;
    }
    class ClaimTypes {
        static GivenName: string;
        static Surname: string;
        static NameIdentifier: string;
        static Email: string;
        static Role: string;
    }
}
declare namespace Webngen.Identity.Models {
    interface IdentityDiscoveryResource extends Resource {
    }
}
declare namespace Webngen.Identity.Models {
    interface Link {
        uri: string;
        rel: string;
        mediaType: string;
    }
}
declare namespace Webngen.Identity.Models {
    interface Resource {
        links: Array<Link>;
    }
}
declare namespace Webngen.Identity.Models {
    interface Token {
        accessToken: string;
        expires: string;
        tokenType: string;
    }
}
declare namespace Webngen.Identity.Services {
    class AuthenticationService implements IAuthenticationService {
        private $http;
        private $q;
        private $rootScope;
        private discoSvc;
        static $inject: string[];
        constructor($http: ng.IHttpService, $q: ng.IQService, $rootScope: ng.IRootScopeService, discoSvc: IIdentityDiscoveryService);
        CreateToken(username: string, password: string): angular.IPromise<Object>;
        Authenticate(username: string, password: string): angular.IPromise<any>;
        SignOut(): angular.IPromise<any>;
        private CreateIdentity;
        private FindClaimValue;
        private FindAllClaimValues;
    }
    interface IAuthenticationService {
        Authenticate(username: string, password: string): ng.IPromise<any>;
        SignOut(): ng.IPromise<any>;
    }
}
declare namespace Webngen.Identity.Services {
    class IdentityDiscoveryService implements IIdentityDiscoveryService {
        private $http;
        private $q;
        static $inject: string[];
        private static RelationTokens;
        private _discoveryResource;
        private _config;
        constructor($http: ng.IHttpService, $q: ng.IQService);
        private Discover;
        TokenUri: angular.IPromise<string>;
        private FindLinkUrl;
        Configure: (config: Models.IdentityConfig) => void;
    }
    interface IIdentityDiscoveryService {
        TokenUri: ng.IPromise<string>;
        Configure(options: Models.IdentityConfig): any;
    }
}
declare var mod: ng.IModule;
declare namespace Webngen.Identity {
    class Bootstrapper {
        init(): void;
    }
    class Constants {
        static Events: {
            LoggedIn: string;
            LoggedOut: string;
        };
    }
}
