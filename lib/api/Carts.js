"use strict";
var _ = require('underscore'),
  Cart = require('../model/Cart'),
  util = require('util'),
  ApiCore = require('facet-core').ApiCore;

/** 
 * API constructor
 *
 * @param   {Object}  options   Options object - must contain 'db' (mongoose instance)
 *                            and 'intercom' (EventEmitter instance) keys.
 *
 * @return  {void}
 */
var CartsAPI = function( options ) {
  // set the options
  // this.setCommonAttributes( options );

  CartsAPI.super_.call(this, options);

  // set the model
  this.Model = new Cart( this.options );

  // set the router for automation
  this.setupRouterManifest();

  // register the api events
  this.registerEvents();

};

/**
 * Carts API inherits from Core API
 */
util.inherits(CartsAPI, ApiCore);

/**
 * Sets up the router manifest for route automation
 *
 * @return   {void}
 */
CartsAPI.prototype.setupRouterManifest = function () {

  // update the router manifest 
  this.routerManifest
    .setApiEventType('cart')
    .setApiModelId('cartId')
    .setRouteBase('/cartss')
    .setRoutes([
      { verb: 'GET',    route: '/:cartId', emit: 'facet:cart:findone' },  // GET a single cart by id
      { verb: 'GET',    route: '',         emit: 'facet:cart:find'    },  // GET an array of cart objects 
      { verb: 'POST',   route: '',         emit: 'facet:cart:create'  },  // POST new cart
      { verb: 'PUT',    route: '/:cartId', emit: 'facet:cart:update'  },  // PUT single/multiple carts
      { verb: 'DELETE', route: '/:cartId', emit: 'facet:cart:remove'  },  // DELETE a single cart resource
    ])
    .extendRouteErrorMessages({
      container: 'The API cart does not have a valid container id.',
      conditions: 'No query conditions were specified',
      query: 'Error querying for cart(s): ',
      notFound: 'No cart was found.',
      find: 'No cart(s) matched your criteria.',
      findOne: 'No cart matched your criteria.',
      update: 'No updates were specified.',
      updateMatch: 'No products were updated based on your criteria.',
      create: 'No data supplied for creating new cart.',
      createMatch: 'No cart was created based on your criteria.',
      remove: 'No data supplied for removing cart.',
      removeMatch: 'No cart was removed based on your criteria.'
    });
};


/** 
 * Registers this API's event listeners. Note that the CRUD functions
 * bound here are part of the facet core module in the FacetApiCore class
 *
 * The standard CRUD functions (find, findOne, create, update, remove)
 * are part of FacetApiCore. If you want custom behavior or logic, emit
 * a different event in the routerManifest for the http method in question
 * or bind the existing events to different handers. You'll still be able to invoke
 * the standard CRUD functions from within your custom handler with this.<function name>.
 *
 * @return  {void}
 */
CartsAPI.prototype.registerEvents = function () {
  this.intercom.on('facet:cart:find', this.find.bind(this) );
  this.intercom.on('facet:cart:findone', this.findOne.bind(this) );
  this.intercom.on('facet:cart:create', this.create.bind(this) );
  this.intercom.on('facet:cart:update', this.update.bind(this) );
  this.intercom.on('facet:cart:remove', this.remove.bind(this) );
};


/**
 * Exports the Carts API
 *
 * @type   {Object}
 */
exports = module.exports = CartsAPI;
