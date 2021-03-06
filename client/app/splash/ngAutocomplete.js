angular.module( "ngAutocomplete", [])
  .directive('ngAutocomplete', function($parse) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        details: '=',
        ngAutocomplete: '=',
        options: '='
      },

      link: function(scope, element, attrs, model) {

        //options for autocomplete
        var opts
        // element.bind("keyup", function(ev) {
        //   if (ev.keyCode == 13) {
        //     ctrl.$commitViewValue();
        //     scope.$apply(ctrl.$setTouched);
        //   }
        // });
        //convert options provided to opts
        var initOpts = function() {
          opts = {}
          if (scope.options) {
            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
            }
            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
            }
            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
            }
          }
        }
        initOpts()

        //create new autocomplete
        //reinitializes on every change of the options provided
        var newAutocomplete = function() {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);

          google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            var extractedZip;
            var addrComponents = scope.gPlace.getPlace().address_components;
            addrComponents.forEach(function(addrCmpnt) {
              if (addrCmpnt.types[0] === 'postal_code')
                extractedZip = addrCmpnt.short_name
            })

            var autocompleteInput = angular.element('#autocomplete')
            autocompleteInput.scope().zip = String(extractedZip);
          })
        }
        newAutocomplete()

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
          newAutocomplete()
          element[0].value = '';
          scope.ngAutocomplete = element.val();
        }, true);
      } // link
    };
  });
