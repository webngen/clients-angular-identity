var Webngen;
(function (Webngen) {
    var Identity;
    (function (Identity) {
        var Models;
        (function (Models) {
            var ClaimTypes = (function () {
                function ClaimTypes() {
                }
                ClaimTypes.GivenName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
                ClaimTypes.Surname = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
                ClaimTypes.NameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
                ClaimTypes.Email = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
                ClaimTypes.Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
                return ClaimTypes;
            }());
            Models.ClaimTypes = ClaimTypes;
        })(Models = Identity.Models || (Identity.Models = {}));
    })(Identity = Webngen.Identity || (Webngen.Identity = {}));
})(Webngen || (Webngen = {}));
var Webngen;
(function (Webngen) {
    var Identity;
    (function (Identity) {
        var Services;
        (function (Services) {
            var AuthenticationService = (function () {
                function AuthenticationService($http, $q, $rootScope, discoSvc) {
                    var _this = this;
                    this.$http = $http;
                    this.$q = $q;
                    this.$rootScope = $rootScope;
                    this.discoSvc = discoSvc;
                    this.CreateIdentity = function (token) {
                        var princ = JSON.parse(atob(token.accessToken.split(".")[1]));
                        return {
                            firstname: _this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.GivenName),
                            surname: _this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.Surname),
                            username: _this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.NameIdentifier),
                            email: _this.FindClaimValue(princ.Claims, Webngen.Identity.Models.ClaimTypes.Email),
                            roles: _this.FindAllClaimValues(princ.Claims, Webngen.Identity.Models.ClaimTypes.Role)
                        };
                    };
                    this.FindClaimValue = function (claims, name) {
                        var claim = $.grep(claims, function (c) { return c.type == name; })[0];
                        if (claim)
                            return claim.value;
                        return null;
                    };
                    this.FindAllClaimValues = function (claims, name) {
                        var matching = $.grep(claims, function (c) { return c.type == name; });
                        return $.map(matching, function (c) { return c.value; });
                    };
                }
                AuthenticationService.prototype.CreateToken = function (username, password) {
                    var _this = this;
                    var deferred = this.$q.defer();
                    this.discoSvc.TokenUri.then(function (url) {
                        _this.$http({
                            method: "POST",
                            url: url,
                            data: { loginName: username, password: password }
                        }).then(function (xhr) {
                            deferred.resolve(xhr.data);
                        }).catch(function (e) {
                            deferred.reject(e);
                        });
                    });
                    return deferred.promise;
                };
                AuthenticationService.prototype.Authenticate = function (username, password) {
                    var _this = this;
                    var deferred = this.$q.defer();
                    this.CreateToken(username, password).then(function (token) {
                        //store token in session
                        sessionStorage.setItem("authToken", token.accessToken);
                        //broadcast authenticate event on event bus
                        _this.$rootScope.$broadcast(Identity.Constants.Events.LoggedIn, _this.CreateIdentity(token));
                        deferred.resolve(token);
                    });
                    return deferred.promise;
                };
                AuthenticationService.prototype.SignOut = function () {
                    var deferred = this.$q.defer();
                    //clear token in session
                    sessionStorage.removeItem("authToken");
                    //broadcast signout event on event bus
                    this.$rootScope.$broadcast(Identity.Constants.Events.LoggedOut, null);
                    deferred.resolve(true);
                    return deferred.promise;
                };
                AuthenticationService.$inject = ['$http', '$q', '$rootScope', 'webngenIdDiscoService'];
                return AuthenticationService;
            }());
            Services.AuthenticationService = AuthenticationService;
        })(Services = Identity.Services || (Identity.Services = {}));
    })(Identity = Webngen.Identity || (Webngen.Identity = {}));
})(Webngen || (Webngen = {}));
var Webngen;
(function (Webngen) {
    var Identity;
    (function (Identity) {
        var Services;
        (function (Services) {
            var IdentityDiscoveryService = (function () {
                function IdentityDiscoveryService($http, $q) {
                    var _this = this;
                    this.$http = $http;
                    this.$q = $q;
                    this._config = { identityApi: "https://api.webngen.net/identity" };
                    this.Discover = function () {
                        var deferred = _this.$q.defer();
                        var self = _this;
                        if (_this._discoveryResource != null)
                            deferred.resolve(self._discoveryResource);
                        else
                            _this.$http({
                                method: "GET",
                                url: _this._config.identityApi
                            }).then(function (xhr) {
                                self._discoveryResource = xhr.data;
                                deferred.resolve(self._discoveryResource);
                            }).catch(function (e) {
                                deferred.reject(e);
                            });
                        return deferred.promise;
                    };
                    this.FindLinkUrl = function (rel) {
                        var deferred = _this.$q.defer();
                        _this.Discover().then(function (disco) {
                            var link = $.grep(disco.links, function (link) { return link.rel === rel; })[0];
                            if (link == null)
                                deferred.reject("Link Not found");
                            else
                                deferred.resolve(link.uri);
                        });
                        return deferred.promise;
                    };
                    this.Configure = function (config) {
                        _this._config = config;
                    };
                }
                Object.defineProperty(IdentityDiscoveryService.prototype, "TokenUri", {
                    get: function () {
                        return this.FindLinkUrl(IdentityDiscoveryService.RelationTokens);
                    },
                    enumerable: true,
                    configurable: true
                });
                IdentityDiscoveryService.$inject = ['$http', '$q'];
                IdentityDiscoveryService.RelationTokens = "tokens";
                return IdentityDiscoveryService;
            }());
            Services.IdentityDiscoveryService = IdentityDiscoveryService;
        })(Services = Identity.Services || (Identity.Services = {}));
    })(Identity = Webngen.Identity || (Webngen.Identity = {}));
})(Webngen || (Webngen = {}));
/// <reference path="../typings/index.d.ts" />
/// <reference path="models/index.d.ts" />
/// <reference path="services/index.d.ts" />
var mod;
var Webngen;
(function (Webngen) {
    var Identity;
    (function (Identity) {
        var Bootstrapper = (function () {
            function Bootstrapper() {
            }
            Bootstrapper.prototype.init = function () {
                var mod = angular.module("webngen.identity", []);
                //var cfg: webngen.identity.models.IdentityConfig = {
                //    identityApi:"api.webngen.net/identity"
                //};
                //mod.constant('appConfig', cfg);
                mod.service('webngenIdAuthService', Identity.Services.AuthenticationService);
                mod.service('webngenIdDiscoService', Identity.Services.IdentityDiscoveryService);
            };
            return Bootstrapper;
        }());
        Identity.Bootstrapper = Bootstrapper;
        var Constants = (function () {
            function Constants() {
            }
            Constants.Events = {
                LoggedIn: "LoggedIn",
                LoggedOut: "LoggedOut",
            };
            return Constants;
        }());
        Identity.Constants = Constants;
    })(Identity = Webngen.Identity || (Webngen.Identity = {}));
})(Webngen || (Webngen = {}));
new Webngen.Identity.Bootstrapper().init();
