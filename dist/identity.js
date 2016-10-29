var webngen;
(function (webngen) {
    var identity;
    (function (identity) {
        var models;
        (function (models) {
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
            models.ClaimTypes = ClaimTypes;
        })(models = identity.models || (identity.models = {}));
    })(identity = webngen.identity || (webngen.identity = {}));
})(webngen || (webngen = {}));
var webngen;
(function (webngen) {
    var identity;
    (function (identity) {
        var services;
        (function (services) {
            var AuthenticationService = (function () {
                function AuthenticationService($http, $q, $rootScope, discoSvc) {
                    var _this = this;
                    this.$http = $http;
                    this.$q = $q;
                    this.$rootScope = $rootScope;
                    this.discoSvc = discoSvc;
                    this.CreateIdentity = function (token) {
                        var princ = JSON.parse(atob(token.AccessToken.split(".")[1]));
                        return {
                            Firstname: _this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.GivenName),
                            Surname: _this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.Surname),
                            Username: _this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.NameIdentifier),
                            Email: _this.FindClaimValue(princ.Claims, webngen.identity.models.ClaimTypes.Email),
                            Roles: _this.FindAllClaimValues(princ.Claims, webngen.identity.models.ClaimTypes.Role)
                        };
                    };
                    this.FindClaimValue = function (claims, name) {
                        var claim = $.grep(claims, function (c) { return c.Name == name; })[0];
                        if (claim)
                            return claim.Value;
                        return null;
                    };
                    this.FindAllClaimValues = function (claims, name) {
                        var matching = $.grep(claims, function (c) { return c.Name == name; });
                        return $.map(matching, function (c) { return c.Value; });
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
                        sessionStorage.setItem("authToken", token.AccessToken);
                        //broadcast authenticate event on event bus
                        _this.$rootScope.$broadcast(identity.Constants.Events.LoggedIn, _this.CreateIdentity(token));
                        deferred.resolve(token);
                    });
                    return deferred.promise;
                };
                AuthenticationService.prototype.SignOut = function () {
                    var deferred = this.$q.defer();
                    //clear token in session
                    sessionStorage.removeItem("authToken");
                    //broadcast signout event on event bus
                    this.$rootScope.$broadcast(identity.Constants.Events.LoggedOut, null);
                    deferred.resolve(true);
                    return deferred.promise;
                };
                AuthenticationService.$inject = ['$http', '$q', '$rootScope', 'webngenIdDiscoService'];
                return AuthenticationService;
            }());
            services.AuthenticationService = AuthenticationService;
        })(services = identity.services || (identity.services = {}));
    })(identity = webngen.identity || (webngen.identity = {}));
})(webngen || (webngen = {}));
var webngen;
(function (webngen) {
    var identity;
    (function (identity) {
        var services;
        (function (services) {
            var IdentityDiscoveryService = (function () {
                function IdentityDiscoveryService($http, $q, config) {
                    var _this = this;
                    this.$http = $http;
                    this.$q = $q;
                    this.config = config;
                    this.Discover = function () {
                        var deferred = _this.$q.defer();
                        var self = _this;
                        if (_this._discoveryResource != null)
                            deferred.resolve(self._discoveryResource);
                        else
                            _this.$http({
                                method: "GET",
                                url: "/api/identity"
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
                            var link = $.grep(disco.Links, function (link) { return link.Rel === rel; })[0];
                            if (link == null)
                                deferred.reject("Link Not found");
                            else
                                deferred.resolve(link.Uri);
                        });
                        return deferred.promise;
                    };
                }
                Object.defineProperty(IdentityDiscoveryService.prototype, "TokenUri", {
                    get: function () {
                        return this.FindLinkUrl(IdentityDiscoveryService.RelationTokens);
                    },
                    enumerable: true,
                    configurable: true
                });
                IdentityDiscoveryService.$inject = ['$http', '$q', ''];
                IdentityDiscoveryService.RelationTokens = "tokens";
                return IdentityDiscoveryService;
            }());
            services.IdentityDiscoveryService = IdentityDiscoveryService;
        })(services = identity.services || (identity.services = {}));
    })(identity = webngen.identity || (webngen.identity = {}));
})(webngen || (webngen = {}));
/// <reference path="../typings/index.d.ts" />
/// <reference path="models/index.d.ts" />
/// <reference path="services/index.d.ts" />
var mod;
var webngen;
(function (webngen) {
    var identity;
    (function (identity) {
        var Bootstrapper = (function () {
            function Bootstrapper() {
            }
            Bootstrapper.prototype.init = function () {
                var mod = angular.module("webngen.identity", []);
                //var cfg: webngen.identity.models.IdentityConfig = {
                //    identityApi:"api.webngen.net/identity"
                //};
                //mod.constant('appConfig', cfg);
                mod.service('webngenIdAuthService', identity.services.AuthenticationService);
                mod.service('webngenIdDiscoService', identity.services.IdentityDiscoveryService);
            };
            return Bootstrapper;
        }());
        identity.Bootstrapper = Bootstrapper;
        var Constants = (function () {
            function Constants() {
            }
            Constants.Events = {
                LoggedIn: "LoggedIn",
                LoggedOut: "LoggedOut",
            };
            return Constants;
        }());
        identity.Constants = Constants;
    })(identity = webngen.identity || (webngen.identity = {}));
})(webngen || (webngen = {}));
new webngen.identity.Bootstrapper().init();
