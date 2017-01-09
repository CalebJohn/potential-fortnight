/* globals TextGroup, resourceNames*/
var BaseObject = function(resources) {
  //whether or not a base is active
  //needs to be like this so we can use a getter and setter
  this._active = false;

  //reference to the resource composition of the sector
  //can be used to lower resource abundance in sector data
  //but currently just used to read abundance of each material
  this.resources = resources;

  //resources to be counted
  this.resourceCount = [0, 0, 0, 0, 0, 0];

  //gatherers represent arbitrary units which gather resources
  //we can make them automiton or people for gameplay sake
  this.gatherers = [1, 1, 1, 1, 1, 1];

  //this is an object that should hold all the info that the base is going to display
  //should have a type 'label' which doesnt get updated
  //and allows us to display information about the base
  this.information = [{name: 'Resources',
                       type: 'resource', // type may be unecessary
                       x: 20 + game.world.width,
                       y: 100,
                       anchor: [0.0, 0.0],
                       context: this,
                       updater: this.getResources},
                       {name: 'Gatherers',
                       type: 'gatherers', 
                       x: 170 + game.world.width,
                       y: 100,
                       anchor: [0.0, 0.0],
                       context: this,
                       updater: this.getGatherers},
                       {name: 'abundance',
                       type: 'abundance', 
                       x: 300 + game.world.width,
                       y: 100,
                       anchor: [0.0, 0.0],
                       context: this,
                       updater: this.getAbundance}];

  //and this is the object that actually displays our text
  //it might not be a bad idea to move all this stuff into the sectordata object
  //but for the time being it makes more sense here
  this.infoDisplay = null; // new TextGroup(this, 0, 0, this.information);

};

BaseObject.prototype = {
  //updates our resource count every frame
  update: function() {
    for (var i = 0; i < this.resourceCount.length; i++) {
      this.resourceCount[i] += game.time.physicsElapsed * this.gatherers[i] * this.resources.type[i].abundance;
    }
  },

  //use getters and setters so that the textgroup is initialized when the base is created
  //not when the sector is initialized
  get active() {
    return this._active;
  },

  set active(x) {
    this._active = x;
    this.infoDisplay = new TextGroup(this, 0, 0, this.information);
  },

  updateText: function() {
    //update the information here
    //use the information to selectively update a textGroup
    if (this.information.length != this.infoDisplay.children.length) {
      this.infoDisplay.destroy();
      this.infoDisplay = new TextGroup(this, 0, 0, this.information);
    }

    for(var i = 0; i < this.information.length;i++) {
      this.infoDisplay.getChildAt(i).setText(this.information[i].updater(this.information[i].context));
    }
  },

  getResources: function(ctx) {
    //returns a formatted string with all the resources and curent values
    //currently only shows an integer version of resources but can be changed easily
    //the use of context here may seem a tad hacky but it is the only way for the information to
    //be both easily updated and manually retreived
    var context = ctx || this;
    var txt = "Resources:";
    for (var i = 0; i < context.resourceCount.length; i++) {
      txt += "\n" + resourceNames[i] + ": " + Math.floor(context.resourceCount[i]);
    }
    return txt;
  },

  getGatherers: function(ctx) {
    //returns a formatted string of how many workers there are in each resource
    var context = ctx || this;
    var txt = "Workers:";
    for (var i = 0; i < context.gatherers.length; i++) {
      txt += "\n" + resourceNames[i] + ": " + Math.floor(context.gatherers[i]);
    }
    return txt;
  }, 

  getAbundance: function(ctx) {
    //return a formatted string with the abundance of each resource in this sector
    var context = ctx || this;
    var txt = "Abundance:";
    for (var i = 0; i < context.resources.type.length; i++) {
      txt += "\n" + resourceNames[i] + ": " + context.resources.type[i].abundance.toPrecision(3);
    }
    return txt;
  }

};