var storage=angular.module("Storage",[]);


//datepicker
storage.
    directive('bDatepicker', function(){
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function($scope, element, attrs, ngModelCtrl) {
                var originalRender, updateModel;
                updateModel = function(ev) {
                    return $scope.$apply(function() {
                        var dateString=ev.date.getDate()+"-"+ev.date.getMonth()+1+"-"+ev.date.getFullYear().toString().substring(2);
                        return ngModelCtrl.$setViewValue(dateString);
                    });
                };
                if (ngModelCtrl != null) {
                    originalRender = ngModelCtrl.$render;
                    ngModelCtrl.$render = function() {
                        originalRender();
                        return element.datepicker.date = ngModelCtrl.$viewValue;
                    };
                }
                return attrs.$observe('bDatepicker', function(value) {
                    var options;
                    options = {};
                    if (angular.isObject(value)) {
                        options = value;
                    }
                    if (typeof(value) === "string") {
                        options = angular.fromJson(value);
                    }
                    return element.datepicker(options).on('changeDate', updateModel);
                });
            }
        };
    });
