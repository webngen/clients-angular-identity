/// <reference path="../typings/index.d.ts" />
/// <reference path="../source/models/index.d.ts" />
/// <reference path="../source/services/index.d.ts" />
declare namespace webngen.identity.models {
    interface IdentityConfig {
        identityApi: string;
    }
}
declare namespace webngen.identity.models {
    interface IIdentity {
        Firstname: string;
        Surname: string;
        Username: string;
        Email: string;
        Roles: Array<string>;
    }
    interface Claim {
        Type: string;
        Value: string;
    }
    class ClaimTypes {
        static GivenName: string;
        static Surname: string;
        static NameIdentifier: string;
        static Email: string;
        static Role: string;
    }
}
declare namespace webngen.identity.models {
    interface IdentityDiscoveryResource extends Resource {
    }
}
declare namespace webngen.identity.models {
    interface Link {
        Uri: string;
        Rel: string;
        MediaType: string;
    }
}
declare namespace webngen.identity.models {
    interface Resource {
        Links: Array<Link>;
    }
}
declare namespace webngen.identity.models {
    interface Token {
        AccessToken: string;
        Expires: string;
        TokenType: string;
    }
}
declare namespace webngen.identity.services {
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
declare namespace webngen.identity.services {
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
        Configure: (config: models.IdentityConfig) => void;
    }
    interface IIdentityDiscoveryService {
        TokenUri: ng.IPromise<string>;
        Configure(options: models.IdentityConfig): any;
    }
}
declare var mod: ng.IModule;
declare namespace webngen.identity {
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
