module.exports = function foo(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    browserify: {
      dev: {
        src: ["../app/app-dependencies.js", "../app/app.js"],
        dest: "dist/bundle.js",
        options: {
          browserifyOptions: {
            debug: true
          },
          plugin: [],
        }
      },
      // production: {
      //   src: ["../app/app-dependencies.js", "../app/app.js"],
      //   dest: "dist/bundle.js",
      //   options: {
      //     browserifyOptions: {
      //       debug: true
      //     },
      //     plugin: [],
      //   }
      // },
    },
    watch: {
      options: {
        livereload: true
      },
      styles: {
        files: ["../styles/**/*.css"]
      },
      html: {
        files: ["../index.html"]
      },
      scripts: {
        files: [
          "../app/*.js", 
          "../app/**/*.js", 
          "../lib/!node_modules/**/*.js"
        ],
        tasks: ["eslint", "browserify", "notify_hooks"],
        options: {
          spawn: false,
        },
      },
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
      },
      build: {
        files: [{
            expand: true,
            // cwd: "../lib/dist/",
            src: "dist/*.js",
            dest: "dist/min/",
            ext: ".min.js"
        }]
      }
  },
    clean: {
      options: { force: true },
      public: ["../public"]
    },
    eslint: {
      src: [
        "../app/*.js",
        "../app/**/*.js",
        "!../lib/node_modules/**/*.js",
        "!../app/app-config-examples/"
      ],
    },
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output 
        title: "Project Name", // defaults to the name in package.json, or will use project directory's name 
        success: false, // whether successful grunt executions should be notified automatically 
        duration: 3 // the duration of notification in seconds, for `notify-send only 
      }
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: "../",
          src: [
            // TODO: update these scripts based on new bundler setup
            "index.html",
            "images/*",
            "images/**/*",
            "favicon.ico",
            "styles/*.css",
            "app/auth/**/*",
            "app/dashboard/**/*",
            "app/navigation/**/*",
            "app/profile/**/*",
            "app/StravaAuth/**/*",
            "app/wishlist/**/*",
            "app/app.Config.js",
            "app/app.js",
            "app/photoErrorPopupService.js",
            "lib/node_modules/jquery/dist/jquery.min.js",
            "lib/node_modules/angular/angular.min.js",
            "lib/node_modules/angular-material",
            "lib/node_modules/angular-sanitize/angular-sanitize.min.js",
            "lib/node_modules/angular-animate/angular-animate.min.js",
            "lib/node_modules/angular-route/angular-route.min.js",
          ],
          dest: "../public/"
        }]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("gruntify-eslint");
  grunt.loadNpmTasks("grunt-notify");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");

  // Default task(s).
  grunt.registerTask("default", ["eslint", "browserify", "uglify", "watch", "notify_hooks"]);
  grunt.registerTask("deploy", ["copy"]);
  grunt.registerTask("cleanit", ["clean"]);
};
