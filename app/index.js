'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('pageName', { type: String, desc:"name of new page", required: true });
    this.argument('ctrls', { type: Array, desc:"list of controllers for this new page",required: false });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to epiclouds\' ' + chalk.red('Ecng') + ' generator!'
    ));

    //make sure the config is right
    this.log("Name of your new page:" + chalk.red(this.pageName));
    this.pageName = _.camelCase(this.pageName);
    this.pageRoot = this.destinationPath('/app/'+this.pageName);
    if(this.ctrls) {
      this.log("list of " + this.ctrls.length + " controllers for this new page:" + chalk.red(this.ctrls));
      for(var i=0; i<this.ctrls.length; i++){
        this.ctrls[i] = _.camelCase(this.ctrls[i]);
      }
    }
    this.prompt({
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure to apply this config?',
      default: true
    }, function (answers) {
      if(answers.confirm)
        done();
      else
        return;
    }.bind(this));
  },

  writing: {
    data: function () {
      var filepath = this.pageRoot + "/" + "data";
      mkdirp.sync(filepath);
    },
    fonts: function () {
      var filepath = this.pageRoot + "/" + "fonts";
      mkdirp.sync(filepath);
    },
    images: function () {
      var filepath = this.pageRoot + "/" + "images";
      mkdirp.sync(filepath);
    },

    sass: function () {
      var filepath = this.pageRoot + "/" + "sass";
      mkdirp.sync(filepath);
      //create theme scss
      this.fs.copyTpl(
        this.templatePath('sass/_theme.scss'),
        filepath + '/_theme.scss'
      );
      //create main scss
      this.fs.copyTpl(
        this.templatePath('sass/mainsass.scss'),
        filepath + '/' + this.pageName + ".scss",
        {
          pageName: this.pageName,
          ctrls: this.ctrls
        }
      );
      //create scss for each partial
      if(this.ctrls) {
        for(var i=0; i<this.ctrls.length; i++){
          this.fs.copyTpl(
            this.templatePath('sass/_partialsass.scss'),
            filepath  + '/' + this.ctrls[i] + '/' + '_' +this.ctrls[i] + '.scss',
            {
              pageName: this.pageName,
              ctrlName: this.ctrls[i]
            }
          );
        }
      }
    },

    scripts: function () {
      var filepath = this.pageRoot + "/" + "scripts/src";
      mkdirp.sync(filepath);
      //create main module
      this.fs.copyTpl(
        this.templatePath('scripts/mainModuleDefinition.js'),
        filepath + '/' + this.pageName + ".js",
        {
          mainAppName: this.pageName,
          ctrls: this.ctrls
        }
      );
      //create module and controller for each partial
      if(this.ctrls) {
        for(var i=0; i<this.ctrls.length; i++){
          this.fs.copyTpl(
            this.templatePath('scripts/partialModuleDefinition.js'),
            filepath  + '/' + this.ctrls[i] + '/' + this.ctrls[i] + '.js',
            {
              mainAppName: this.pageName,
              partialAppName: this.ctrls[i]
            }
          );
          this.fs.copyTpl(
            this.templatePath('scripts/partialCtrlDefinition.js'),
            filepath + '/' + this.ctrls[i] + '/controller/' + this.ctrls[i] + 'Ctrl.js',
            {
              mainAppName: this.pageName,
              partialAppName: this.ctrls[i]
            }
          );
        }
      }
    },

    views: function () {
      var filepath = this.pageRoot + "/" + "views";
      mkdirp.sync(filepath);
      //create main html
      this.fs.copyTpl(
        this.templatePath('views/main.html'),
        filepath + '/' + this.pageName + ".html",
        {
          mainAppName: this.pageName,
          ctrls: this.ctrls
        }
      );
      //create html for each partial
      if(this.ctrls) {
        for(var i=0; i<this.ctrls.length; i++){
          this.fs.copyTpl(
            this.templatePath('views/partial.html'),
            filepath + '/partials/' + this.ctrls[i] + "/" + this.ctrls[i] + '.html',
            {
              mainAppName: this.pageName,
              partialAppName: this.ctrls[i]
            }
          );
        }
      }
    }
  }
});
