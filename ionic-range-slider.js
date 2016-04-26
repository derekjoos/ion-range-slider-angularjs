/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */

angular.module("ion.rangeslider", []);

angular.module("ion.rangeslider").directive("ionRangeSlider", [
    function () {

        var stateSyncManager;

        return {
            restrict: "E",
            scope: {
                min: "=",
                max: "=",
                type: "@",
                prefix: "@",
                maxPostfix: "@",
                prettify: "&",
                prettifyEnabled: "@",
                prettifySeparator: "@",
                grid: "@",
                gridMargin: "@",
                postfix: "@",
                step: "@",
                hideMinMax: "@",
                hideFromTo: "@",
                from: "=",
                to: "=",
                disable: "=",
                onChange: "&",
                onFinish: "&"
            },
            replace: true,
            link: function ($scope, $element, $attrs) {
                $element.ionRangeSlider({
                    min: $scope.min,
                    max: $scope.max,
                    type: $scope.type,
                    prefix: $scope.prefix,
                    max_postfix: $scope.maxPostfix,
                    prettify_enabled: ($scope.prettifyEnabled === 'true'),
                    prettify_separator: $scope.prettifySeparator,
                    grid: ($scope.grid === 'true'),
                    grid_margin: $scope.gridMargin,
                    postfix: $scope.postfix,
                    step: $scope.step,
                    hide_min_max: ($scope.hideMinMax === 'true'),
                    hide_from_to: ($scope.hideFromTo === 'true'),
                    from: $scope.from,
                    to: $scope.to,
                    disable: $scope.disable,
                    prettify: function (value) {
                        if($attrs.prettify && $scope.prettify) {
                            return $scope.prettify(value);
                        }
                        return value;
                    },
                    onChange: function (sliderState) {
                        stateSyncManager.updateScope(sliderState);
                        $attrs.onChange && $scope.onChange && $scope.onChange(sliderState);
                    },
                    onFinish: function (sliderState) {
                        stateSyncManager.updateScope(sliderState);
                        $attrs.onFinish && $scope.onFinish && $scope.onFinish(sliderState);
                    }
                });
                stateSyncManager = createStateSyncManager($scope, $element, ['min', 'max', 'from', 'to', 'disable']);
                stateSyncManager.init();
            }
        }

        function createStateSyncManager($scope, $element, properties) {

            var watches = [];
            var stateProperties = properties;

            return {
                updateScope: updateScope,
                init: enableWatches
            };

            function enableWatches() {
                angular.forEach(stateProperties, function(property) {
                    watches.push($scope.$watch(property, function (value) {
                        var updateInfo = {};
                        updateInfo[property] = value;
                        $element.data("ionRangeSlider").update(updateInfo);
                    }));
				});
            }

            function disableWatches() {
                angular.forEach(watches, function(disableWatcherFunction) {
                    disableWatcherFunction();
                })
            }

            function updateScope(sliderState) {
                disableWatches();
                $scope.$apply(function () {
                    angular.forEach(stateProperties, function(property) {
                        $scope[property] = sliderState[property];
                    })
                });
                enableWatches();
            }
        }
    }
])
